import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const ROOT = process.cwd();
const require = createRequire(import.meta.url);
const SRC_DATA_PATH = path.join(ROOT, 'src', 'srcData.ts');
const VHF_DATA_PATH = path.join(ROOT, 'src', 'vhfData.ts');
const OCR_DIR = path.join(ROOT, 'extracted', 'rya_ocr_txt');

function loadTsModule(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const moduleObj = { exports: {} };
  vm.runInNewContext(
    output,
    { module: moduleObj, exports: moduleObj.exports, require, console },
    { filename: filePath },
  );
  return moduleObj.exports;
}

function parseHandbookPages(refText) {
  const pages = [];
  const matcher = /\b(?:p|pp)\.\s*(\d{1,3})(?:\s*-\s*(\d{1,3}))?/g;
  let match = matcher.exec(refText);
  while (match) {
    const start = Number(match[1]);
    const end = match[2] ? Number(match[2]) : start;
    const low = Math.min(start, end);
    const high = Math.max(start, end);
    for (let page = low; page <= high; page += 1) {
      pages.push(page);
    }
    match = matcher.exec(refText);
  }
  return [...new Set(pages)];
}

function getOcrPages() {
  const files = fs.readdirSync(OCR_DIR);
  const pages = new Set();
  for (const file of files) {
    const match = file.match(/page-(\d+)\.txt$/);
    if (match) {
      pages.add(Number(match[1]));
    }
  }
  return pages;
}

function tokenise(text) {
  const stopWords = new Set([
    'the', 'and', 'for', 'with', 'that', 'this', 'from', 'are', 'was', 'when', 'where', 'what', 'which',
    'only', 'into', 'must', 'used', 'use', 'your', 'have', 'has', 'had', 'not', 'yet', 'but', 'can', 'may',
    'all', 'via', 'its', 'their', 'than', 'then', 'them', 'been', 'being', 'under', 'over', 'after', 'before',
    'onto', 'through', 'while', 'does', 'should', 'would', 'could', 'there', 'they', 'you', 'about', 'message',
    'channel', 'calls', 'call', 'voice', 'dsc', 'distress', 'safety', 'urgency', 'routine',
  ]);
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => token.length > 3 && !stopWords.has(token));
}

function buildQuestionBanks(mod) {
  return [
    ['EXAM_QUESTIONS', mod.EXAM_QUESTIONS],
    ['CHANNEL_PLAN_SIM_QUESTIONS', { channels: mod.CHANNEL_PLAN_SIM_QUESTIONS }],
    ['DSC_CONSOLE_DRILL_QUESTIONS', { dsc: mod.DSC_CONSOLE_DRILL_QUESTIONS }],
  ];
}

function auditQuestions(mod, ocrPages) {
  const issues = [];
  const manualReview = [];
  const idMap = new Map();
  let total = 0;

  const banks = buildQuestionBanks(mod);

  const pageTextCache = new Map();
  function getPageText(page) {
    if (!pageTextCache.has(page)) {
      const name = path.join(OCR_DIR, `page-${String(page).padStart(3, '0')}.txt`);
      pageTextCache.set(page, fs.existsSync(name) ? fs.readFileSync(name, 'utf8').toLowerCase() : '');
    }
    return pageTextCache.get(page);
  }

  for (const [bankName, grouped] of banks) {
    for (const [topic, questions] of Object.entries(grouped)) {
      if (!Array.isArray(questions)) {
        continue;
      }
      for (const question of questions) {
        total += 1;
        const prefix = `${bankName}/${topic}/${question.id}`;

        if (!question.id) {
          issues.push(`${bankName}/${topic}: missing question id`);
          continue;
        }

        if (idMap.has(question.id)) {
          issues.push(`${prefix}: duplicate id (already in ${idMap.get(question.id)})`);
        } else {
          idMap.set(question.id, `${bankName}/${topic}`);
        }

        if (!Array.isArray(question.options) || question.options.length < 2) {
          issues.push(`${prefix}: invalid options list`);
        }
        if (!question.answer || !question.options?.some((option) => option.id === question.answer)) {
          issues.push(`${prefix}: answer id not found in options`);
        }
        if (!question.explanation || question.explanation.trim().length < 20) {
          issues.push(`${prefix}: weak explanation`);
        }
        if (!question.handbookRef) {
          issues.push(`${prefix}: missing handbookRef`);
          continue;
        }

        const pages = parseHandbookPages(question.handbookRef);
        if (pages.length === 0) {
          issues.push(`${prefix}: handbookRef has no parseable page (${question.handbookRef})`);
          continue;
        }
        for (const page of pages) {
          if (!ocrPages.has(page)) {
            issues.push(`${prefix}: referenced OCR page ${page} not found`);
          }
        }

        // Heuristic support check: low lexical overlap is not an error, but requires manual review.
        const text = pages.map((page) => getPageText(page)).join('\n');
        const probeTokens = [...new Set(tokenise(`${question.title} ${question.explanation} ${question.answer}`))].slice(0, 20);
        if (probeTokens.length > 0) {
          const hits = probeTokens.filter((token) => text.includes(token));
          const ratio = hits.length / probeTokens.length;
          if (ratio < 0.15) {
            manualReview.push({
              id: question.id,
              handbookRef: question.handbookRef,
              lexicalRatio: Number(ratio.toFixed(2)),
            });
          }
        }
      }
    }
  }

  return { total, uniqueIds: idMap.size, issues, manualReview };
}

function auditVhfScenarios(mod) {
  const issues = [];
  const scenarios = mod.VHF_SCENARIOS;
  if (!Array.isArray(scenarios)) {
    return { total: 0, issues: ['VHF_SCENARIOS missing or invalid'] };
  }

  for (const scenario of scenarios) {
    const prefix = `VHF/${scenario.id}`;
    if (!Array.isArray(scenario.correctSequence) || scenario.correctSequence.length < 4) {
      issues.push(`${prefix}: too-short or missing correctSequence`);
      continue;
    }

    const opening = scenario.correctSequence[0] ?? '';
    if (scenario.type === 'Distress' && !/mayday/i.test(opening)) {
      issues.push(`${prefix}: distress scenario does not start with MAYDAY or MAYDAY RELAY`);
    }
    if (scenario.type === 'Urgency' && !/pan pan/i.test(opening)) {
      issues.push(`${prefix}: urgency scenario does not start with PAN PAN`);
    }
    if (scenario.type === 'Safety' && !/securite/i.test(opening)) {
      issues.push(`${prefix}: safety scenario does not start with SECURITE`);
    }

    const hasThisIs = scenario.correctSequence.some((line) => /\bthis is\b/i.test(line));
    if (!hasThisIs) {
      issues.push(`${prefix}: missing \"This is\" identity segment`);
    }

    const hasTurnToken = scenario.correctSequence.some((line) => /\b(over|out)\b/i.test(line));
    if (!hasTurnToken) {
      issues.push(`${prefix}: no turn-taking closure token (Over/Out)`);
    }
  }

  return { total: scenarios.length, issues };
}

function main() {
  const srcData = loadTsModule(SRC_DATA_PATH);
  const vhfData = loadTsModule(VHF_DATA_PATH);
  const ocrPages = getOcrPages();

  const questionAudit = auditQuestions(srcData, ocrPages);
  const vhfAudit = auditVhfScenarios(vhfData);

  const criticalIssues = [...questionAudit.issues, ...vhfAudit.issues];

  console.log(`Question items checked: ${questionAudit.total}`);
  console.log(`Unique question ids: ${questionAudit.uniqueIds}`);
  console.log(`VHF scenarios checked: ${vhfAudit.total}`);
  console.log(`Critical issues: ${criticalIssues.length}`);
  console.log(`Manual-review flags (low lexical overlap): ${questionAudit.manualReview.length}`);

  if (criticalIssues.length > 0) {
    console.log('\nCritical issues:');
    for (const issue of criticalIssues) {
      console.log(`- ${issue}`);
    }
    process.exitCode = 1;
  }

  if (questionAudit.manualReview.length > 0) {
    console.log('\nManual-review flags:');
    for (const flag of questionAudit.manualReview.slice(0, 50)) {
      console.log(`- ${flag.id} (${flag.handbookRef}) lexicalRatio=${flag.lexicalRatio}`);
    }
    if (questionAudit.manualReview.length > 50) {
      console.log(`- ... and ${questionAudit.manualReview.length - 50} more`);
    }
  }
}

main();
