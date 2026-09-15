import React, { useState, useEffect } from 'react';
import { getEducationModules } from '../data/educationData';
import { EducationModule, UserProfile } from '../types';
import { 
  BookOpen, 
  Gauge, 
  Shield, 
  GitFork, 
  Heart, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle, 
  FileCheck2, 
  BookmarkCheck, 
  Scale 
} from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { getActiveUserSession } from '../utils/authStorage';
import { getUserCompletedModules, toggleUserCompletedModule } from '../utils/userProgress';

interface EducationScreenProps {
  user?: UserProfile | null;
  onNavigateToQuiz: () => void;
  onNavigateToSimulator: () => void;
}

export const EducationScreen: React.FC<EducationScreenProps> = ({
  user,
  onNavigateToQuiz,
  onNavigateToSimulator
}) => {
  const activeUser = user || getActiveUserSession();
  const { language, t } = useThemeLanguage();
  const modules = getEducationModules(language);
  const [selectedModuleId, setSelectedModuleId] = useState<string>(modules[0].id);
  const [completedModules, setCompletedModules] = useState<string[]>(() => {
    return activeUser?.email ? getUserCompletedModules(activeUser.email) : [];
  });

  const selectedModule = modules.find(m => m.id === selectedModuleId) || modules[0];

  const toggleModuleComplete = (id: string) => {
    if (activeUser?.email) {
      const updated = toggleUserCompletedModule(activeUser.email, id);
      setCompletedModules(updated);
    } else {
      if (completedModules.includes(id)) {
        setCompletedModules(completedModules.filter(m => m !== id));
      } else {
        setCompletedModules([...completedModules, id]);
      }
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Gauge': return Gauge;
      case 'Shield': return Shield;
      case 'GitFork': return GitFork;
      case 'Heart': return Heart;
      default: return BookOpen;
    }
  };

  const isCompleted = completedModules.includes(selectedModule.id);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0052cc] dark:text-sky-400 text-xs font-bold mb-2 border border-blue-100 dark:border-blue-900/50">
          <Scale size={14} />
          <span>{t('edu_badge_legal', 'Código Nacional de Tránsito de Colombia (Ley 769 & Ley 2251)')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight">
          {t('edu_title', 'Módulos de Educación y Seguridad Vial')}
        </h1>
        <p className="text-sm text-[#475569] dark:text-slate-300 mt-1 max-w-3xl">
          {t('edu_desc', 'Aprende y repasa las leyes, normas de convivencia y técnicas de manejo preventivo vigentes en Colombia para aspirantes y conductores de todas las categorías.')}
        </p>

        {/* Progress Bar */}
        <div className="mt-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-2/3">
            <div className="flex justify-between text-xs font-bold text-[#334155] dark:text-slate-300 mb-1.5">
              <span>{t('edu_your_progress', 'Tu Progreso de Formación Vial')}</span>
              <span>{completedModules.length} {t('edu_of', 'de')} {modules.length} {t('edu_modules_read', 'módulos leídos')}</span>
            </div>
            <div className="w-full bg-[#f1f5f9] dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#0052cc] dark:bg-sky-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(completedModules.length / modules.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={onNavigateToQuiz}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-[#eff6ff] dark:bg-slate-800 text-[#0052cc] dark:text-sky-400 text-xs font-bold hover:bg-[#dbeafe] dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <HelpCircle size={14} />
              <span>{t('edu_practice_quiz', 'Hacer un Quiz')}</span>
            </button>
            <button
              onClick={onNavigateToSimulator}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-[#0052cc] text-white text-xs font-bold hover:bg-[#0043a8] transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <FileCheck2 size={14} />
              <span>{t('edu_go_to_simulator', 'Simulador RUNT')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar List + Content Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Module Selector Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-[#64748b] dark:text-slate-400 px-1">
            {t('edu_available_modules', 'Temas de Formación')}
          </h2>

          {modules.map((module) => {
            const Icon = getIcon(module.icon);
            const isSelected = selectedModule.id === module.id;
            const isDone = completedModules.includes(module.id);

            return (
              <div
                key={module.id}
                onClick={() => setSelectedModuleId(module.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-[#eff6ff] dark:bg-blue-950/40 border-[#0052cc] dark:border-sky-500 shadow-xs' 
                    : 'bg-white dark:bg-slate-900 border-[#e2e8f0] dark:border-slate-800 hover:border-[#cbd5e1] hover:bg-[#f8fafc] dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-lg shrink-0 ${
                    isSelected ? 'bg-[#0052cc] text-white' : 'bg-[#f1f5f9] dark:bg-slate-800 text-[#475569] dark:text-slate-300'
                  }`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-bold text-xs text-[#0f172a] dark:text-white truncate">
                        {module.title}
                      </h3>
                      {isDone && (
                        <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#64748b] dark:text-slate-400 line-clamp-2 mt-0.5">
                      {module.subtitle}
                    </p>
                    <span className="inline-block mt-2 text-[10px] font-semibold text-[#0052cc] dark:text-sky-400">
                      {module.readTime}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Module Detail View (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* Header of reading */}
          <div className="border-b border-[#f1f5f9] dark:border-slate-800 pb-6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <span className="px-2.5 py-1 rounded bg-[#f1f5f9] dark:bg-slate-800 text-[#334155] dark:text-slate-300 text-[11px] font-bold">
                {selectedModule.readTime}
              </span>
              <button
                onClick={() => toggleModuleComplete(selectedModule.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isCompleted
                    ? 'bg-[#dcfce7] dark:bg-emerald-950/50 text-[#166534] dark:text-emerald-300 hover:bg-[#bbf7d0]'
                    : 'bg-[#f1f5f9] dark:bg-slate-800 text-[#475569] dark:text-slate-300 hover:bg-[#e2e8f0]'
                }`}
              >
                <BookmarkCheck size={15} />
                <span>{isCompleted ? t('edu_module_done', 'Módulo Completado ✓') : t('edu_mark_read', 'Marcar como Leído')}</span>
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] dark:text-white">
              {selectedModule.title}
            </h2>
            <p className="text-xs text-[#0052cc] dark:text-sky-400 font-semibold mt-1">
              {t('edu_legal_basis', 'Base Legal')}: {selectedModule.legalBasis}
            </p>
            <p className="text-sm text-[#475569] dark:text-slate-300 mt-2 italic bg-[#f8fafc] dark:bg-slate-800/60 p-3 rounded-lg border-l-4 border-[#0052cc]">
              {selectedModule.summary}
            </p>
          </div>

          {/* Module Sections */}
          <div className="space-y-6">
            {selectedModule.contentSections.map((sec, idx) => (
              <div key={idx} className="space-y-2.5">
                <h3 className="text-base font-bold text-[#0f172a] dark:text-white">
                  {sec.heading}
                </h3>
                <p className="text-sm text-[#334155] dark:text-slate-300 leading-relaxed">
                  {sec.body}
                </p>
                {sec.keyPoints && (
                  <div className="bg-[#f0f9ff] dark:bg-slate-800/80 border border-[#bae6fd] dark:border-slate-700 rounded-xl p-3.5 space-y-1.5 mt-2">
                    <div className="text-[11px] font-black uppercase text-[#0369a1] dark:text-sky-400 tracking-wider">
                      {t('edu_key_points', 'Puntos Clave y Normativa:')}
                    </div>
                    {sec.keyPoints.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2 text-xs text-[#0c4a6e] dark:text-slate-200">
                        <span className="text-[#0284c7] font-bold">•</span>
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Next Steps Footer */}
          <div className="mt-8 pt-6 border-t border-[#f1f5f9] dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => toggleModuleComplete(selectedModule.id)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#0052cc] text-white text-xs font-bold hover:bg-[#0043a8] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <CheckCircle2 size={16} />
              <span>{isCompleted ? t('edu_completed', 'Completado') : t('edu_mark_read', 'Marcar como Leído')}</span>
            </button>

            <button
              onClick={onNavigateToQuiz}
              className="w-full sm:w-auto text-xs font-bold text-[#0052cc] dark:text-sky-400 hover:underline flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>{t('edu_practice_quiz_cta', 'Evaluar lo aprendido en un Quiz')}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
