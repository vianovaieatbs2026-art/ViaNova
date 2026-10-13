import React, { useState } from 'react';
import { TrafficSignGraphic } from './TrafficSignGraphic';
import { RoadSituationGraphic } from './RoadSituationGraphic';
import { ExamQuestion } from '../types';
import { HelpCircle, Eye, ShieldAlert, Sparkles, Image as ImageIcon } from 'lucide-react';

interface QuizQuestionVisualProps {
  question: ExamQuestion;
  className?: string;
}

export const QuizQuestionVisual: React.FC<QuizQuestionVisualProps> = ({
  question,
  className = ''
}) => {
  const [showHint, setShowHint] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  const hasSign = Boolean(question.signCode || question.signType);
  const hasSituation = Boolean(question.situationType);
  const hasImage = Boolean(question.imageUrl && !imageError);

  if (!hasSign && !hasSituation && !hasImage) {
    return null;
  }

  // Difficulty badge colors
  const difficultyMap = {
    facil: {
      label: 'Nivel Fácil',
      color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
    },
    medio: {
      label: 'Nivel Intermedio',
      color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800'
    },
    dificil: {
      label: 'Nivel Avanzado',
      color: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800'
    }
  };

  const currentDiff = question.difficulty ? difficultyMap[question.difficulty] : null;

  return (
    <div className={`w-full my-4 rounded-3xl bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800/80 dark:to-slate-900 border border-slate-200 dark:border-slate-700/80 p-4 sm:p-5 shadow-sm transition-all ${className}`}>
      
      {/* Top Header inside Visual Card */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-700/60">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-[#0052cc] dark:text-sky-400">
            <Eye size={14} />
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {hasSituation ? 'Situación Vial Ilustrada' : hasSign ? 'Señal de Tránsito Oficial' : 'Elemento Visual de Seguridad'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {currentDiff && (
            <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${currentDiff.color}`}>
              {currentDiff.label}
            </span>
          )}

          {question.signHint && (
            <button
              type="button"
              onClick={() => setShowHint(prev => !prev)}
              className="text-[11px] font-bold text-[#0052cc] dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 shadow-2xs"
            >
              <HelpCircle size={12} />
              <span>{showHint ? 'Ocultar Pista' : 'Ver Pista'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Visual Display */}
      <div className="flex flex-col items-center justify-center py-2">
        {hasSituation && (
          <RoadSituationGraphic 
            situationType={question.situationType!} 
            caption={question.imageCaption}
          />
        )}

        {!hasSituation && hasSign && (
          <div className="flex flex-col items-center justify-center">
            <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner flex items-center justify-center">
              <TrafficSignGraphic
                signCode={question.signCode}
                signType={question.signType || question.signCode}
                size="lg"
                showCodeBadge={false}
              />
            </div>
            {question.imageCaption && (
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2 text-center">
                {question.imageCaption}
              </span>
            )}
          </div>
        )}

        {!hasSituation && !hasSign && hasImage && (
          <div className="w-full max-w-md rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md bg-slate-900">
            <img
              src={question.imageUrl}
              alt={question.imageCaption || 'Ilustración vial'}
              className="w-full h-auto max-h-64 object-cover"
              onError={() => setImageError(true)}
              loading="lazy"
            />
            {question.imageCaption && (
              <div className="p-2 text-center text-xs text-slate-300 bg-slate-900/90 font-medium">
                {question.imageCaption}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hint Reveal Box */}
      {showHint && question.signHint && (
        <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2 animate-fade-in">
          <Sparkles size={14} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <p className="leading-relaxed">
            <strong className="font-bold">Pista clave:</strong> {question.signHint}
          </p>
        </div>
      )}

    </div>
  );
};
