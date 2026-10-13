import React from 'react';
import { CheckCircle2, Circle, Shield, ShieldCheck, ShieldAlert, Sparkles, Info } from 'lucide-react';
import { PasswordValidationResult } from '../utils/security';

interface PasswordRequirementsGuideProps {
  password: string;
  analysis: PasswordValidationResult;
  showAlways?: boolean;
}

export const PasswordRequirementsGuide: React.FC<PasswordRequirementsGuideProps> = ({
  password,
  analysis,
  showAlways = true,
}) => {
  const hasTyped = password.length > 0;

  if (!showAlways && !hasTyped) {
    return null;
  }

  const { rules } = analysis;

  const criteria = [
    {
      id: 'min-length',
      label: 'Mínimo 6 caracteres',
      detail: '(Obligatorio)',
      met: rules.minLength,
      mandatory: true,
    },
    {
      id: 'uppercase',
      label: 'Al menos una letra mayúscula',
      detail: '(A-Z)',
      met: rules.hasUpperCase,
      mandatory: false,
    },
    {
      id: 'lowercase',
      label: 'Al menos una letra minúscula',
      detail: '(a-z)',
      met: rules.hasLowerCase,
      mandatory: false,
    },
    {
      id: 'number',
      label: 'Al menos un número',
      detail: '(0-9)',
      met: rules.hasNumber,
      mandatory: false,
    },
  ];

  return (
    <div 
      id="password-strength-guide"
      className="mt-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 transition-all duration-300 text-xs shadow-sm"
    >
      {/* Header with Strength Status */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
          {analysis.isStrong ? (
            <ShieldCheck size={16} className="text-emerald-500 dark:text-emerald-400" />
          ) : analysis.isValid ? (
            <Shield size={16} className="text-blue-500 dark:text-sky-400" />
          ) : (
            <ShieldAlert size={16} className="text-amber-500 dark:text-amber-400" />
          )}
          <span className="text-[12px] font-bold">
            {hasTyped ? 'Nivel de Seguridad:' : '¿Qué se necesita para que sea fuerte?'}
          </span>
        </div>

        {hasTyped && (
          <span 
            className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md border tracking-wide transition-colors"
            style={{
              backgroundColor: `${analysis.strengthColor}18`,
              borderColor: `${analysis.strengthColor}40`,
              color: analysis.strengthColor,
            }}
          >
            {analysis.strengthLabel} ({analysis.score}%)
          </span>
        )}
      </div>

      {/* Progress Bar (when typing) */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2.5">
        <div 
          className="h-full transition-all duration-300"
          style={{
            width: hasTyped ? `${Math.max(8, analysis.score)}%` : '0%',
            backgroundColor: analysis.strengthColor,
          }}
        />
      </div>

      {/* Specification Title */}
      <div className="mb-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
        <Info size={12} className="text-blue-500 shrink-0" />
        <span>Para considerarla <strong>fuerte</strong>, tu contraseña debe incluir:</span>
      </div>

      {/* Criteria Checklist */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-2.5">
        {criteria.map((item) => (
          <li 
            key={item.id}
            className={`flex items-center gap-2 p-1.5 rounded-lg text-[11px] transition-all ${
              item.met
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-medium'
                : hasTyped
                ? 'bg-slate-100/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {item.met ? (
              <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <Circle size={14} className="text-slate-400 dark:text-slate-500 shrink-0 stroke-2" />
            )}
            <span className="truncate">
              {item.label} <span className="opacity-75 font-normal">{item.detail}</span>
            </span>
          </li>
        ))}
      </ul>

      {/* Dynamic Feedback Box */}
      <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-start gap-1.5 text-[11px]">
        <Sparkles size={13} className="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
        <span className="text-slate-600 dark:text-slate-300 leading-snug">
          {analysis.feedbackTip}
        </span>
      </div>
    </div>
  );
};
