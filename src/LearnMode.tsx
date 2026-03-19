import { BookOpen, ClipboardList, Radio, XCircle } from 'lucide-react';
import {
  APPENDIX_SYLLABUS_BLOCKS,
  EXAM_CRITICAL_ITEMS,
  HANDBOOK_MODULES,
  LEARN_SECTIONS,
  PROCEDURE_TEMPLATES,
} from './srcData';

interface LearnModeProps {
  onBack: () => void;
}

export const LearnMode = ({ onBack }: LearnModeProps) => {
  return (
    <div
      className="glass-panel p-6 max-w-5xl mx-auto w-full flex flex-col gap-5 relative overflow-hidden overflow-y-auto"
      style={{ maxHeight: 'calc(100vh - 8rem)' }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex justify-between items-center relative z-10">
        <button onClick={onBack} className="btn-secondary px-4 py-2 text-sm rounded-lg flex items-center gap-2">
          <XCircle size={18} />
          Back
        </button>

        <div className="text-center">
          <div className="text-xs tracking-widest uppercase text-blue-200">Handbook Core</div>
          <div className="text-2xl font-extrabold text-white">Learn</div>
        </div>

        <div className="w-24"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {HANDBOOK_MODULES.map((module) => (
          <div key={module.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex justify-between items-center gap-4 mb-2">
              <div className="text-white font-bold">{module.title}</div>
              <div className="text-xs text-blue-200 uppercase tracking-widest">{module.pages}</div>
            </div>
            <div className="text-sm text-slate-300 leading-relaxed mb-3">{module.summary}</div>
            <div className="flex flex-wrap gap-2">
              {module.skills.map((skill) => (
                <span key={skill} className="text-xs bg-black/20 border border-white/10 rounded-full px-3 py-2 text-slate-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {LEARN_SECTIONS.map((section) => (
          <div key={section.id} className="bg-black/20 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-blue-200 text-sm uppercase tracking-widest mb-2">
              <BookOpen size={16} />
              {section.pages}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{section.title}</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">{section.objective}</p>

            <div className="text-xs tracking-widest uppercase text-white/50 mb-2">Exam Focus</div>
            <div className="flex flex-wrap gap-2 mb-4">
              {section.examFocus.map((item) => (
                <span key={item} className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-2 text-slate-300">
                  {item}
                </span>
              ))}
            </div>

            <div className="text-xs tracking-widest uppercase text-white/50 mb-2">Essentials</div>
            <div className="space-y-2">
              {section.essentials.map((fact) => (
                <div key={fact} className="text-sm text-slate-300 bg-white/5 border border-white/10 rounded-xl p-3 leading-relaxed">
                  {fact}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 bg-red-500/10 border border-red-500/30 rounded-2xl p-5">
        <div className="text-xs tracking-widest uppercase text-red-200 mb-4">Official Exam Blueprint (Appendix 1)</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {APPENDIX_SYLLABUS_BLOCKS.map((block) => (
            <div key={block.id} className="bg-black/20 border border-white/10 rounded-2xl p-4">
              <div className="flex justify-between items-center gap-3 mb-2">
                <div className="text-white font-bold">Block {block.code}: {block.title}</div>
                <div className="text-xs uppercase tracking-widest text-red-200">{block.pages}</div>
              </div>
              <div className="space-y-2">
                {block.exactKnowledge.map((item) => (
                  <div key={item} className="text-sm text-slate-300 bg-white/5 border border-white/10 rounded-xl p-3">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-5">
        <div className="text-xs tracking-widest uppercase text-yellow-300 mb-4">Must-Know Before Exam Attempt</div>
        <div className="space-y-3">
          {EXAM_CRITICAL_ITEMS.map((item) => (
            <div key={item.id} className="bg-black/20 border border-white/10 rounded-xl p-4">
              <div className="text-white font-semibold mb-1">{item.label}</div>
              <div className="text-sm text-slate-300 leading-relaxed mb-2">{item.why}</div>
              <div className="text-xs uppercase tracking-widest text-yellow-200">{item.handbookRef}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-white/70 mb-4">
          <ClipboardList size={16} />
          Procedure Checklists
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROCEDURE_TEMPLATES.map((template) => (
            <div key={template.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-blue-200 text-sm uppercase tracking-widest mb-2">
                <Radio size={16} />
                {template.title}
              </div>
              <div className="text-sm text-slate-300 leading-relaxed mb-4">{template.intro}</div>
              <div className="space-y-2">
                {template.steps.map((step, index) => (
                  <div key={step} className="flex items-start gap-3 bg-black/20 border border-white/10 rounded-xl p-3">
                    <div className="w-6 h-6 rounded-full bg-white/10 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </div>
                    <div className="text-sm text-slate-300 leading-relaxed">{step}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
