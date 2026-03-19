import { useState } from 'react';
import { BrainCircuit, CheckCircle, HelpCircle, Radio, RefreshCw, ShieldAlert, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { PROCEDURE_TEMPLATES } from './srcData';
import { VHF_SCENARIOS, shuffleArray } from './vhfData';
import type { VhfScenario } from './vhfData';

interface VhfModeProps {
  onBack: () => void;
}

interface PhraseBlock {
  id: string;
  text: string;
}

type ScenarioFilter = VhfScenario['type'] | 'All';

interface ScenarioRound {
  scenario: VhfScenario | null;
  availableBlocks: PhraseBlock[];
}

interface MnemonicHint {
  mnemonic: string;
  rules: string[];
}

const FILTER_OPTIONS: ScenarioFilter[] = ['All', 'Routine', 'Safety', 'Urgency', 'Distress'];

const TEMPLATE_HINTS: Record<string, MnemonicHint> = {
  'routine-call': {
    mnemonic: 'CALL-R-OVER',
    rules: [
      'Call station x3 -> This is -> own vessel x3.',
      'Give reason/request briefly.',
      'Finish with Over and move off 16 to a working channel.',
    ],
  },
  'urgency-template': {
    mnemonic: 'PAN-POS-PROB-HELP',
    rules: [
      'Pan Pan x3 -> addressee -> This is -> identity.',
      'Give Position, then Problem.',
      'State help required and persons on board if relevant.',
    ],
  },
  'safety-template': {
    mnemonic: 'SEC-WARN-AREA',
    rules: [
      'Securite x3 -> All Stations -> This is -> identity.',
      'State warning nature clearly.',
      'Give affected area/position and channel/out instruction.',
    ],
  },
  'distress-template': {
    mnemonic: 'MIPDANIO',
    rules: [
      'Mayday x3 -> This is -> identity.',
      'Mayday message order: Identity, Position, Distress, Assistance, Number, Information, Over.',
      'Do not skip position: it is the highest-value field for rescue.',
    ],
  },
  'distress-acknowledgement': {
    mnemonic: 'MAYDAY-THISIS-RECEIVED',
    rules: [
      'Start with Mayday and casualty identity.',
      'Then This is + acknowledging station identity.',
      'Use Received Mayday + control instruction + Over.',
    ],
  },
  'mayday-relay-template': {
    mnemonic: 'RELAY-CASUALTY-POS',
    rules: [
      'Mayday Relay x3 -> addressee -> This is -> relaying station.',
      'State casualty identity and position.',
      'State distress nature and assistance required.',
    ],
  },
};

function getScenarioPool(filter: ScenarioFilter): VhfScenario[] {
  return filter === 'All' ? VHF_SCENARIOS : VHF_SCENARIOS.filter((scenario) => scenario.type === filter);
}

function buildScenarioRound(
  filter: ScenarioFilter,
  solvedScenarioIds: string[],
  previousScenarioId?: string,
): ScenarioRound {
  const unsolvedPool = getScenarioPool(filter).filter((scenario) => !solvedScenarioIds.includes(scenario.id));

  if (unsolvedPool.length === 0) {
    return {
      scenario: null,
      availableBlocks: [],
    };
  }

  const candidatePool =
    previousScenarioId && unsolvedPool.length > 1
      ? unsolvedPool.filter((scenario) => scenario.id !== previousScenarioId)
      : unsolvedPool;
  const finalPool = candidatePool.length > 0 ? candidatePool : unsolvedPool;
  const scenario = finalPool[Math.floor(Math.random() * finalPool.length)];

  return {
    scenario,
    availableBlocks: shuffleArray(
      scenario.correctSequence.map((text, index) => ({
        id: `${scenario.id}-${index}`,
        text,
      })),
    ),
  };
}

function getTypeTone(type: VhfScenario['type']): string {
  switch (type) {
    case 'Distress':
      return 'border-red-500/40 bg-red-500/10 text-red-200';
    case 'Urgency':
      return 'border-orange-500/40 bg-orange-500/10 text-orange-200';
    case 'Safety':
      return 'border-amber-500/40 bg-amber-500/10 text-amber-200';
    default:
      return 'border-sky-500/40 bg-sky-500/10 text-sky-200';
  }
}

function getMnemonicHint(scenario: VhfScenario): MnemonicHint {
  const fromTemplate = scenario.procedureTemplateId ? TEMPLATE_HINTS[scenario.procedureTemplateId] : null;
  if (fromTemplate) {
    return fromTemplate;
  }

  if (scenario.type === 'Distress') {
    return TEMPLATE_HINTS['distress-template'];
  }
  if (scenario.type === 'Urgency') {
    return TEMPLATE_HINTS['urgency-template'];
  }
  if (scenario.type === 'Safety') {
    return TEMPLATE_HINTS['safety-template'];
  }
  return TEMPLATE_HINTS['routine-call'];
}

export const VhfMode = ({ onBack }: VhfModeProps) => {
  const [selectedType, setSelectedType] = useState<ScenarioFilter>('All');
  const [solvedScenarioIds, setSolvedScenarioIds] = useState<string[]>([]);
  const [round, setRound] = useState<ScenarioRound>(() => buildScenarioRound('All', []));
  const [selectedBlocks, setSelectedBlocks] = useState<PhraseBlock[]>([]);
  const [errorIndex, setErrorIndex] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [solutionRevealed, setSolutionRevealed] = useState(false);

  const currentScenario = round.scenario;
  const availableBlocks = round.availableBlocks;

  const totalScenarios = VHF_SCENARIOS.length;
  const solvedCount = solvedScenarioIds.length;
  const totalPercent = Math.round((solvedCount / totalScenarios) * 100);

  const filterPool = getScenarioPool(selectedType);
  const filterTotal = filterPool.length;
  const filterSolved = filterPool.filter((scenario) => solvedScenarioIds.includes(scenario.id)).length;
  const filterRemaining = filterTotal - filterSolved;
  const filterPercent = filterTotal > 0 ? Math.round((filterSolved / filterTotal) * 100) : 0;

  const resetAssembly = () => {
    setSelectedBlocks([]);
    setErrorIndex(null);
    setIsSuccess(false);
    setSolutionRevealed(false);
  };

  const loadScenario = (preferredType = selectedType, solvedIds = solvedScenarioIds) => {
    setRound(buildScenarioRound(preferredType, solvedIds, round.scenario?.id));
    resetAssembly();
  };

  const handleTypeChange = (type: ScenarioFilter) => {
    setSelectedType(type);
    setRound(buildScenarioRound(type, solvedScenarioIds));
    resetAssembly();
  };

  const resetCycle = () => {
    setSolvedScenarioIds([]);
    setRound(buildScenarioRound(selectedType, []));
    resetAssembly();
  };

  const handleSelectBlock = (block: PhraseBlock) => {
    if (!currentScenario || isSuccess || errorIndex !== null || solutionRevealed) {
      return;
    }

    const newSelected = [...selectedBlocks, block];
    const currentIndex = selectedBlocks.length;

    if (currentScenario.correctSequence[currentIndex] === block.text) {
      setSelectedBlocks(newSelected);
      setRound((value) => ({
        ...value,
        availableBlocks: value.availableBlocks.filter((candidate) => candidate.id !== block.id),
      }));

      if (newSelected.length === currentScenario.correctSequence.length) {
        const updatedSolved = solvedScenarioIds.includes(currentScenario.id)
          ? solvedScenarioIds
          : [...solvedScenarioIds, currentScenario.id];
        setSolvedScenarioIds(updatedSolved);
        setIsSuccess(true);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      setSelectedBlocks(newSelected);
      setErrorIndex(currentIndex);
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    }
  };

  const revealSolution = () => {
    if (!currentScenario || isSuccess || errorIndex !== null || solutionRevealed) {
      return;
    }

    setSelectedBlocks(
      currentScenario.correctSequence.map((text, index) => ({
        id: `reveal-${currentScenario.id}-${index}`,
        text,
      })),
    );
    setRound((value) => ({
      ...value,
      availableBlocks: [],
    }));
    setSolutionRevealed(true);
  };

  const undoLastError = () => {
    if (errorIndex !== null) {
      setSelectedBlocks(selectedBlocks.slice(0, errorIndex));
      setErrorIndex(null);
    }
  };

  const deselectBlock = (block: PhraseBlock, index: number) => {
    if (isSuccess || errorIndex !== null || solutionRevealed) {
      return;
    }

    if (index === selectedBlocks.length - 1) {
      const newSelected = [...selectedBlocks];
      newSelected.pop();
      setSelectedBlocks(newSelected);
      setRound((value) => ({
        ...value,
        availableBlocks: [...value.availableBlocks, block],
      }));
    }
  };

  const activeTemplate = currentScenario
    ? PROCEDURE_TEMPLATES.find((template) => template.id === currentScenario.procedureTemplateId)
      ?? (currentScenario.type === 'Routine'
        ? PROCEDURE_TEMPLATES.find((template) => template.id === 'routine-call')
        : currentScenario.type === 'Distress'
          ? PROCEDURE_TEMPLATES.find((template) => template.id === 'distress-template')
          : currentScenario.type === 'Urgency'
            ? PROCEDURE_TEMPLATES.find((template) => template.id === 'urgency-template')
            : PROCEDURE_TEMPLATES.find((template) => template.id === 'safety-template'))
    : null;
  const mnemonicHint = currentScenario ? getMnemonicHint(currentScenario) : null;

  return (
    <div className="drill-view mx-auto flex w-full max-w-6xl flex-col gap-3 p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <Button onClick={onBack} variant="outline" size="sm" className="h-10 min-w-24">
          <XCircle size={18} />
          Back
        </Button>
        <div className="text-center">
          <div className="mb-1 text-[11px] font-semibold tracking-[0.18em] uppercase text-sky-300">Message Sequencing</div>
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-foreground md:text-3xl">
            <Radio size={24} />
            Procedure Builder
          </div>
        </div>
        <Button
          onClick={() => loadScenario()}
          disabled={!currentScenario}
          variant="secondary"
          size="sm"
          className="h-10 min-w-24"
          title="Skip to next scenario"
        >
          <RefreshCw size={16} />
          Skip
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="border-border/70 bg-card/95">
          <CardHeader className="pb-2">
            <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-sky-300">Global Completion</div>
            <CardTitle className="text-3xl font-extrabold">{solvedCount} / {totalScenarios} ({totalPercent}%)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div>Solved scenarios do not repeat in this cycle.</div>
            <Progress value={totalPercent} className="h-2 bg-muted/70" />
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/95">
          <CardHeader className="pb-2">
            <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-emerald-300">
              {selectedType === 'All' ? 'Current View' : `${selectedType} Completion`}
            </div>
            <CardTitle className="text-3xl font-extrabold">{filterSolved} / {filterTotal} ({filterPercent}%)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div>{filterRemaining} scenarios remaining.</div>
            <Progress value={filterPercent} className="h-2 bg-muted/70" />
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70 bg-card/95">
        <CardContent className="pt-5">
          <Tabs value={selectedType} onValueChange={(value) => handleTypeChange(value as ScenarioFilter)}>
            <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
              <TabsList className="grid h-auto w-full grid-cols-2 gap-1 bg-muted/40 p-1 md:grid-cols-3 xl:grid-cols-5">
                {FILTER_OPTIONS.map((type) => (
                  <TabsTrigger key={type} value={type} className="text-xs font-semibold">
                    {type === 'All' ? 'All Scenarios' : type}
                  </TabsTrigger>
                ))}
              </TabsList>
              <Button onClick={resetCycle} variant="outline" size="sm" className="xl:w-auto">
                Restart Cycle
              </Button>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {!currentScenario ? (
        <Card className="border-emerald-500/40 bg-emerald-500/10 text-center">
          <CardHeader className="items-center pb-1">
            <CheckCircle className="mb-1 h-12 w-12 text-emerald-300" />
            <CardTitle className="text-3xl font-extrabold text-foreground">
              {selectedType === 'All' ? 'All scenarios completed' : `${selectedType} scenarios completed`}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-5">
            <p className="text-base text-muted-foreground">
              Completion: {solvedCount} / {totalScenarios} ({totalPercent}%)
            </p>
            <Button onClick={resetCycle} size="lg">Start New Cycle</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className={cn('border', getTypeTone(currentScenario.type))}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase">
                    <ShieldAlert size={14} />
                    {currentScenario.type}
                  </div>
                  <CardTitle className="text-2xl font-extrabold text-foreground">{currentScenario.title}</CardTitle>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{currentScenario.description}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {selectedBlocks.length} / {currentScenario.correctSequence.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2 xl:grid-cols-5">
              <div className="rounded-lg border border-border/70 bg-muted/35 p-3">
                <div className="mb-1 text-[11px] font-semibold tracking-[0.16em] uppercase">Vessel</div>
                <div className="font-semibold text-foreground">{currentScenario.myVessel.name}</div>
              </div>
              <div className="rounded-lg border border-border/70 bg-muted/35 p-3">
                <div className="mb-1 text-[11px] font-semibold tracking-[0.16em] uppercase">Call Sign</div>
                <div className="font-mono text-foreground">{currentScenario.myVessel.callsign}</div>
              </div>
              <div className="rounded-lg border border-border/70 bg-muted/35 p-3">
                <div className="mb-1 text-[11px] font-semibold tracking-[0.16em] uppercase">MMSI</div>
                <div className="font-mono text-foreground">{currentScenario.myVessel.mmsi}</div>
              </div>
              {currentScenario.position && (
                <div className="rounded-lg border border-border/70 bg-muted/35 p-3">
                  <div className="mb-1 text-[11px] font-semibold tracking-[0.16em] uppercase">Position</div>
                  <div className="truncate text-foreground" title={currentScenario.position}>{currentScenario.position}</div>
                </div>
              )}
              {currentScenario.otherVessel && (
                <div className="rounded-lg border border-border/70 bg-muted/35 p-3">
                  <div className="mb-1 text-[11px] font-semibold tracking-[0.16em] uppercase">Other Station</div>
                  <div className="truncate text-foreground" title={currentScenario.otherVessel}>{currentScenario.otherVessel}</div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-3 xl:grid-cols-2">
            {mnemonicHint && (
              <Card className="border-sky-500/40 bg-sky-500/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-sky-200">
                    <BrainCircuit size={14} />
                    Mnemonic Rules
                  </div>
                  <CardTitle className="text-xl font-extrabold text-foreground">{mnemonicHint.mnemonic}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mnemonicHint.rules.map((rule) => (
                    <div key={rule} className="rounded-lg border border-border/70 bg-muted/35 p-3 text-sm leading-relaxed text-muted-foreground">
                      {rule}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeTemplate && (
              <Card className="border-border/70 bg-card/95">
                <CardHeader className="pb-3">
                  <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">Procedure Reminder</div>
                  <CardTitle className="text-xl font-extrabold text-foreground">{activeTemplate.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{activeTemplate.intro}</p>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {activeTemplate.steps.slice(0, 6).map((step, index) => (
                    <Badge key={step} variant="outline" className="normal-case text-xs tracking-normal">
                      {index + 1}. {step}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="grid gap-4 pb-1 xl:grid-cols-[1.5fr,1fr]">
            <Card className="flex flex-col border-border/70 bg-card/95">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                    <Radio size={14} />
                    Transmission Assembly
                  </div>
                  <Badge variant="outline">{selectedBlocks.length} / {currentScenario.correctSequence.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {selectedBlocks.length === 0 && (
                  <div className="flex min-h-[140px] items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/20 p-4 text-sm text-muted-foreground">
                    Sequence empty. Click phrases to assemble.
                  </div>
                )}

                {selectedBlocks.map((block, i) => {
                  const isError = i === errorIndex;
                  const isLast = i === selectedBlocks.length - 1;

                  return (
                    <button
                      key={block.id}
                      onClick={() => deselectBlock(block, i)}
                      className={cn(
                        'flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition-colors',
                        isError
                          ? 'border-red-500/50 bg-red-500/15 text-red-100'
                          : 'border-emerald-500/40 bg-emerald-500/15 text-emerald-50',
                        isLast && errorIndex === null ? 'cursor-pointer hover:border-red-500/50 hover:bg-red-500/20 hover:text-red-100' : 'cursor-default',
                      )}
                    >
                      <span className={cn(
                        'mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                        isError ? 'bg-red-500/25 text-red-200' : 'bg-emerald-500/25 text-emerald-200',
                      )}
                      >
                        {i + 1}
                      </span>
                      <span className={cn(
                        'flex-1 leading-relaxed',
                        isLast && errorIndex === null && 'opacity-80',
                      )}
                      >
                        {block.text}
                      </span>
                    </button>
                  );
                })}

                {errorIndex !== null && (
                  <Card className="border-red-500/50 bg-red-500/15">
                    <CardContent className="flex items-center justify-between gap-3 pt-4">
                      <div className="text-sm text-red-100">Incorrect procedure sequence.</div>
                      <Button onClick={undoLastError} variant="destructive" size="sm">Undo</Button>
                    </CardContent>
                  </Card>
                )}

                {solutionRevealed && (
                  <Card className="border-amber-500/50 bg-amber-500/15">
                    <CardContent className="space-y-3 pt-4">
                      <div className="text-sm text-amber-100">
                        Solution revealed. This scenario is not marked as completed.
                      </div>
                      <Button onClick={() => loadScenario(selectedType)} size="sm">
                        Next Unsolved Scenario
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {isSuccess && (
                  <Card className="border-emerald-500/50 bg-emerald-500/15 text-center">
                    <CardContent className="space-y-3 pt-5">
                      <CheckCircle className="mx-auto h-10 w-10 text-emerald-300" />
                      <p className="text-xl font-extrabold text-foreground">Transmission Ready</p>
                      <p className="text-sm text-muted-foreground">
                        Scenario marked as completed.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Progress: {solvedCount} / {totalScenarios} ({totalPercent}%)
                      </p>
                      <Button onClick={() => loadScenario(selectedType)}>
                        Next Unsolved Scenario
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            <Card className="flex flex-col border-border/70 bg-card/95">
              <CardHeader className="pb-3">
                <div className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                  Available Phrases
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {availableBlocks.map((block) => (
                  <button
                    key={block.id}
                    onClick={() => handleSelectBlock(block)}
                    disabled={errorIndex !== null || isSuccess || solutionRevealed}
                    className={cn(
                      'w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors',
                      (errorIndex !== null || isSuccess || solutionRevealed)
                        ? 'cursor-not-allowed border-border/50 bg-muted/30 text-muted-foreground opacity-50'
                        : 'border-border/70 bg-muted/35 text-foreground hover:border-primary/60 hover:bg-accent',
                    )}
                  >
                    {block.text}
                  </button>
                ))}

                {!isSuccess && !solutionRevealed && (
                  <Button onClick={revealSolution} disabled={errorIndex !== null} variant="outline" className="w-full">
                    <HelpCircle size={16} />
                    I Don't Know (Reveal)
                  </Button>
                )}

                {availableBlocks.length === 0 && !isSuccess && (
                  <div className="flex h-28 items-center justify-center rounded-lg border border-dashed border-border/70 text-sm text-muted-foreground">
                    All phrases selected
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
