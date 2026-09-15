import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  ArrowRight, 
  SlidersHorizontal, 
  BookOpen, 
  HelpCircle, 
  FileCheck2, 
  MapPin, 
  Scale, 
  Sparkles,
  Command
} from 'lucide-react';
import { ScreenId, SearchResultItem } from '../types';
import { searchViaNovaItems } from '../data/searchIndex';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { TrafficSignGraphic } from './TrafficSignGraphic';

interface HeaderSearchBarProps {
  onNavigate: (screen: ScreenId) => void;
  className?: string;
}

export const HeaderSearchBar: React.FC<HeaderSearchBarProps> = ({ 
  onNavigate,
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useThemeLanguage();

  // Popular default items when query is empty but search is open
  const popularDefaultItems: SearchResultItem[] = React.useMemo(() => [
    {
      id: 'hdr-sr01',
      title: 'SR-01 - Señal de Pare',
      categoryType: 'senales',
      categoryLabel: 'Señal Reglamentaria',
      subtitle: 'Detención obligatoria total del vehículo',
      targetScreen: 'senales',
      description: '',
      tags: []
    },
    {
      id: 'hdr-sim',
      title: 'Simulador de Examen Oficial',
      categoryType: 'evaluacion',
      categoryLabel: 'Simulador Licencias',
      subtitle: 'Prueba de 30 preguntas con temporizador',
      targetScreen: 'simulador',
      description: '',
      tags: []
    },
    {
      id: 'hdr-quiz',
      title: 'Quiz de Conocimiento Vial',
      categoryType: 'evaluacion',
      categoryLabel: 'Evaluación Rápida',
      subtitle: 'Preguntas interactivas con retroalimentación',
      targetScreen: 'quiz',
      description: '',
      tags: []
    },
    {
      id: 'hdr-ley',
      title: 'Límites de Velocidad (Ley 2251)',
      categoryType: 'educacion',
      categoryLabel: 'Educación Vial',
      subtitle: 'Ley Julián Esteban: 50 km/h en vías urbanas',
      targetScreen: 'educacion_vial',
      description: '',
      tags: []
    }
  ], []);

  // Compute live search suggestions
  const suggestions = React.useMemo(() => {
    if (!query.trim()) return popularDefaultItems;
    return searchViaNovaItems(query, 'todos').slice(0, 7);
  }, [query, popularDefaultItems]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' && suggestions.length > 0) {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelectItem(suggestions[selectedIndex]);
      } else if (query.trim()) {
        onNavigate('busqueda');
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelectItem = (item: SearchResultItem) => {
    setIsOpen(false);
    setQuery('');
    if (item.id === 'quick-mapa' || item.title.toLowerCase().includes('mapa')) {
      const target = document.getElementById('mapa-en-vivo-medellin');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        onNavigate('inicio');
        setTimeout(() => {
          document.getElementById('mapa-en-vivo-medellin')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
      return;
    }
    if (item.targetScreen) {
      onNavigate(item.targetScreen);
    } else {
      onNavigate('senales');
    }
  };

  const getCategoryIcon = (categoryType: string) => {
    switch (categoryType) {
      case 'senales':
        return <SlidersHorizontal size={14} className="text-amber-500 shrink-0" />;
      case 'evaluacion':
        return <FileCheck2 size={14} className="text-blue-500 shrink-0" />;
      case 'educacion':
        return <BookOpen size={14} className="text-emerald-500 shrink-0" />;
      case 'reportes':
        return <MapPin size={14} className="text-rose-500 shrink-0" />;
      default:
        return <Sparkles size={14} className="text-indigo-500 shrink-0" />;
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <div className="absolute left-3 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center">
          <Search size={15} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onClick={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={t('header_search_placeholder', 'Buscar señales, leyes, simulador...')}
          className="w-full pl-9 pr-8 py-1.5 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200/70 dark:hover:bg-slate-800 text-[#0f172a] dark:text-slate-100 placeholder:text-slate-400 text-xs rounded-xl border border-transparent focus:border-[#0052cc] dark:focus:border-sky-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052cc]/20 transition-all"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
            title="Limpiar búsqueda"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Resultados: div con absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl z-50 */}
      {/* SIN ningún fondo negro detrás, SIN fixed, SIN inset-0, SIN backdrop */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full mt-2 w-full min-w-[320px] bg-white rounded-xl shadow-2xl z-50 border border-slate-200 overflow-hidden">
          <div className="p-2.5 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500 px-3.5 bg-slate-50">
            <span>Resultados encontrados ({suggestions.length})</span>
            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
              <Command size={10} /> Enter
            </span>
          </div>

          {suggestions.length > 0 ? (
            <div className="py-1 max-h-[340px] overflow-y-auto">
              {suggestions.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                const isSignal = item?.categoryType === 'senales';
                const signCodeMatch = item?.title ? item.title.match(/^[A-Z]{2}-\d{2}/i) : null;

                return (
                  <button
                    key={item?.id || idx}
                    type="button"
                    onClick={() => handleSelectItem(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left px-3.5 py-2.5 flex items-start gap-3 transition-colors cursor-pointer text-xs border-b border-slate-50 last:border-0 ${
                      isSelected 
                        ? 'bg-blue-50 text-[#0052cc]' 
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isSignal && signCodeMatch && signCodeMatch[0] ? (
                        <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                          <TrafficSignGraphic 
                            signCode={signCodeMatch[0].toUpperCase()}
                            size="xs"
                            showCodeBadge={false}
                          />
                        </div>
                      ) : (
                        getCategoryIcon(item?.categoryType || 'otro')
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold truncate text-[12px] text-slate-900">
                          {item?.title || 'Contenido'}
                        </span>
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 shrink-0">
                          {item?.categoryLabel || 'General'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {item?.subtitle || item?.description || ''}
                      </p>
                    </div>

                    <ArrowRight size={12} className="text-slate-300 mt-1 shrink-0" />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-slate-500">
              <p className="font-medium">No se encontraron resultados para "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
