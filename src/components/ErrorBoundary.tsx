import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ViaNova Uncaught Render Error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-[360px] flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 my-4 text-center">
          <div className="max-w-md w-full flex flex-col items-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
              <AlertTriangle size={28} />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {this.props.fallbackTitle || 'Ha ocurrido un error al cargar esta sección'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {this.props.fallbackMessage || 'La aplicación detectó una incidencia al procesar los datos. Puedes reiniciar la vista sin perder tu sesión.'}
              </p>
              {this.state.error?.message && (
                <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-[11px] font-mono text-slate-600 dark:text-slate-300 text-left overflow-x-auto max-h-20">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="px-4 py-2 bg-[#0052cc] text-white text-xs font-bold rounded-xl hover:bg-[#0043a8] transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <RotateCcw size={14} />
                <span>Reintentar</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Home size={14} />
                <span>Recargar página</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
