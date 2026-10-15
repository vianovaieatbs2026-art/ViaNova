import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  RotateCcw, 
  Lightbulb, 
  Trophy, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Check,
  Info
} from 'lucide-react';
import { soundEngine } from '../../utils/soundEffects';
import { QuizConfetti } from './QuizConfetti';

export interface WordItem {
  id: string;
  word: string;
  hint: string;
  legalReference: string;
  start: [number, number]; // [row, col]
  end: [number, number];
  color: string;
}

// 10 Road Safety Words 100% placed and verified in a 10x10 matrix
export const WORDS_DATABASE: WordItem[] = [
  {
    id: 'w-1',
    word: 'SEMAFORO',
    hint: 'Dispositivo luminoso que regula el tránsito con luces verde, amarilla y roja.',
    legalReference: 'Art. 116 Ley 769 de 2002',
    start: [0, 1],
    end: [0, 8],
    color: '#00AFFF'
  },
  {
    id: 'w-2',
    word: 'SOAT',
    hint: 'Seguro Obligatorio de Accidentes de Tránsito que ampara a todas las víctimas.',
    legalReference: 'Art. 42 Ley 769 de 2002',
    start: [1, 3],
    end: [1, 6],
    color: '#3B82F6'
  },
  {
    id: 'w-3',
    word: 'PARE',
    hint: 'Señal reglamentaria octagonal SR-01 de detención total e inequívoca a 0 km/h.',
    legalReference: 'Art. 109 Ley 769 de 2002',
    start: [2, 2],
    end: [2, 5],
    color: '#EAB308'
  },
  {
    id: 'w-4',
    word: 'CINTURON',
    hint: 'Elemento de seguridad pasiva obligatorio en asientos delanteros y traseros.',
    legalReference: 'Art. 82 Ley 769 de 2002',
    start: [4, 1],
    end: [4, 8],
    color: '#FF6B00'
  },
  {
    id: 'w-5',
    word: 'VELOCIDAD',
    hint: 'Límite urbano general de 50 km/h fijado por la Ley Julián Esteban.',
    legalReference: 'Ley 2251 de 2022',
    start: [6, 0],
    end: [6, 8],
    color: '#A855F7'
  },
  {
    id: 'w-6',
    word: 'LUCES',
    hint: 'Sistema de alumbrado reglamentario activo obligatorio para visibilidad en vía.',
    legalReference: 'Art. 86 Ley 769 de 2002',
    start: [7, 2],
    end: [7, 6],
    color: '#EC4899'
  },
  {
    id: 'w-7',
    word: 'CEBRA',
    hint: 'Demarcación vial de líneas blancas longitudinales para cruce peatonal seguro.',
    legalReference: 'Manual de Señalización Mintransporte',
    start: [8, 2],
    end: [8, 6],
    color: '#06B6D4'
  },
  {
    id: 'w-8',
    word: 'FRENOS',
    hint: 'Sistema de detención mecánica e hidráulica clave en la revisión técnico-mecánica.',
    legalReference: 'Art. 28 Ley 769 de 2002',
    start: [9, 1],
    end: [9, 6],
    color: '#10B981'
  },
  {
    id: 'w-9',
    word: 'CASCO',
    hint: 'Protección reglamentaria y certificada (DOT/ECE) para motociclistas.',
    legalReference: 'Resolución 23385 de 2020',
    start: [1, 0],
    end: [5, 0],
    color: '#F43F5E'
  },
  {
    id: 'w-10',
    word: 'PEATON',
    hint: 'Actor vial más vulnerable en la pirámide de movilidad con prelación de paso.',
    legalReference: 'Art. 105 Ley 769 de 2002',
    start: [1, 9],
    end: [6, 9],
    color: '#00FF88'
  }
];

// Exact 10x10 pre-computed grid: all 10 words completely verified without overlap defects
export const BASE_GRID: string[][] = [
  ['X', 'S', 'E', 'M', 'A', 'F', 'O', 'R', 'O', 'V'], // Row 0: SEMAFORO (0,1)..(0,8)
  ['C', 'Y', 'U', 'S', 'O', 'A', 'T', 'P', 'T', 'P'], // Row 1: CASCO(1..5,0), SOAT(1,3)..(1,6), PEATON(1..6,9)
  ['A', 'P', 'P', 'A', 'R', 'E', 'B', 'S', 'U', 'E'], // Row 2: PARE (2,2)..(2,5)
  ['S', 'S', 'J', 'T', 'Y', 'Z', 'X', 'E', 'D', 'A'], // Row 3: filler
  ['C', 'C', 'I', 'N', 'T', 'U', 'R', 'O', 'N', 'T'], // Row 4: CINTURON (4,1)..(4,8)
  ['O', 'R', 'V', 'E', 'M', 'I', 'N', 'R', 'B', 'O'], // Row 5: CASCO ends at (5,0)
  ['V', 'E', 'L', 'O', 'C', 'I', 'D', 'A', 'D', 'N'], // Row 6: VELOCIDAD (6,0)..(6,8), PEATON ends at (6,9)
  ['O', 'T', 'L', 'U', 'C', 'E', 'S', 'L', 'T', 'D'], // Row 7: LUCES (7,2)..(7,6)
  ['X', 'M', 'C', 'E', 'B', 'R', 'A', 'E', 'W', 'E'], // Row 8: CEBRA (8,2)..(8,6)
  ['J', 'F', 'R', 'E', 'N', 'O', 'S', 'U', 'I', 'A']  // Row 9: FRENOS (9,1)..(9,6)
];

interface WordSearchGameProps {
  onBackToHub: () => void;
  onRecordScore?: (score: number) => void;
}

export const WordSearchGame: React.FC<WordSearchGameProps> = ({
  onBackToHub,
  onRecordScore
}) => {
  const [grid] = useState<string[][]>(BASE_GRID);
  const [foundWordIds, setFoundWordIds] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [firstTapCell, setFirstTapCell] = useState<[number, number] | null>(null);
  const [dragStartCell, setDragStartCell] = useState<[number, number] | null>(null);
  const [pulsingCell, setPulsingCell] = useState<[number, number] | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [selectedWordDetail, setSelectedWordDetail] = useState<WordItem | null>(WORDS_DATABASE[0]);

  const gridRef = useRef<HTMLDivElement>(null);

  // Timer
  useEffect(() => {
    if (gameFinished) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameFinished]);

  // Victory check
  useEffect(() => {
    if (foundWordIds.length === WORDS_DATABASE.length && !gameFinished) {
      setGameFinished(true);
      soundEngine.playWordFound();
      setTimeout(() => {
        soundEngine.playComplete();
        soundEngine.playConfettiPop();
      }, 500);
      if (onRecordScore) {
        onRecordScore(100);
      }
    }
  }, [foundWordIds, gameFinished, onRecordScore]);

  // Check if cell is in any found word
  const getCellFoundColor = (r: number, c: number): string | null => {
    for (const id of foundWordIds) {
      const item = WORDS_DATABASE.find(w => w.id === id);
      if (!item) continue;
      if (isCellInWord(r, c, item)) {
        return item.color;
      }
    }
    return null;
  };

  const isCellInWord = (r: number, c: number, item: WordItem): boolean => {
    const [sr, sc] = item.start;
    const [er, ec] = item.end;
    if (sr === er) {
      // Horizontal
      return r === sr && c >= Math.min(sc, ec) && c <= Math.max(sc, ec);
    }
    if (sc === ec) {
      // Vertical
      return c === sc && r >= Math.min(sr, er) && r <= Math.max(sr, er);
    }
    return false;
  };

  const isCellSelected = (r: number, c: number): boolean => {
    return selectedCells.some(([sr, sc]) => sr === r && sc === c);
  };

  // Generate line between two points (supports Horizontal, Vertical, Diagonal)
  const getLineCells = (start: [number, number], end: [number, number]): [number, number][] => {
    const [r1, c1] = start;
    const [r2, c2] = end;
    const cells: [number, number][] = [];

    // Horizontal
    if (r1 === r2) {
      const step = c2 >= c1 ? 1 : -1;
      for (let c = c1; c !== c2 + step; c += step) {
        cells.push([r1, c]);
      }
      return cells;
    }

    // Vertical
    if (c1 === c2) {
      const step = r2 >= r1 ? 1 : -1;
      for (let r = r1; r !== r2 + step; r += step) {
        cells.push([r, c1]);
      }
      return cells;
    }

    // Diagonal
    const dr = r2 - r1;
    const dc = c2 - c1;
    if (Math.abs(dr) === Math.abs(dc)) {
      const stepR = dr > 0 ? 1 : -1;
      const stepC = dc > 0 ? 1 : -1;
      let currR = r1;
      let currC = c1;
      while (true) {
        cells.push([currR, currC]);
        if (currR === r2 && currC === c2) break;
        currR += stepR;
        currC += stepC;
      }
      return cells;
    }

    return [[r1, c1]];
  };

  // Evaluate candidate cells array against words database
  const tryMatchWord = (cells: [number, number][]): boolean => {
    if (cells.length < 3) return false;
    const selectedString = cells.map(([r, c]) => grid[r][c]).join('');
    const reversedString = selectedString.split('').reverse().join('');

    let matchedWord: WordItem | null = null;
    for (const w of WORDS_DATABASE) {
      if (w.word === selectedString || w.word === reversedString) {
        const [sr, sc] = w.start;
        const [er, ec] = w.end;
        const [firstR, firstC] = cells[0];
        const [lastR, lastC] = cells[cells.length - 1];

        const matchForward = (firstR === sr && firstC === sc && lastR === er && lastC === ec);
        const matchBackward = (firstR === er && firstC === ec && lastR === sr && lastC === sc);

        if (matchForward || matchBackward) {
          matchedWord = w;
          break;
        }
      }
    }

    if (matchedWord && !foundWordIds.includes(matchedWord.id)) {
      soundEngine.playWordFound();
      setFoundWordIds(prev => [...prev, matchedWord!.id]);
      setSelectedWordDetail(matchedWord);
      setPulsingCell(null);
      setFirstTapCell(null);
      setSelectedCells([]);
      return true;
    }
    return false;
  };

  // Interaction handlers (dual support: drag OR 2-tap selection)
  const handleCellClickOrTap = (r: number, c: number) => {
    soundEngine.playLetterSelect(0);

    if (!firstTapCell) {
      // First tap: mark as candidate start
      setFirstTapCell([r, c]);
      setSelectedCells([[r, c]]);
      return;
    }

    // Second tap on the exact same cell deselects
    if (firstTapCell[0] === r && firstTapCell[1] === c) {
      setFirstTapCell(null);
      setSelectedCells([]);
      return;
    }

    // Second tap on a different cell: calculate line and attempt match
    const line = getLineCells(firstTapCell, [r, c]);
    setSelectedCells(line);

    const isMatch = tryMatchWord(line);
    if (!isMatch) {
      // Brief visual flash, then reset
      soundEngine.playClick();
      setTimeout(() => {
        setSelectedCells([]);
        setFirstTapCell(null);
      }, 400);
    }
  };

  // Drag start
  const handlePointerDown = (r: number, c: number) => {
    setIsDragging(true);
    setDragStartCell([r, c]);
    setSelectedCells([[r, c]]);
  };

  // Drag over
  const handlePointerEnter = (r: number, c: number) => {
    if (!isDragging || !dragStartCell) return;
    const line = getLineCells(dragStartCell, [r, c]);
    if (line.length !== selectedCells.length) {
      soundEngine.playLetterSelect(line.length);
    }
    setSelectedCells(line);
  };

  // Drag end
  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (selectedCells.length > 1) {
      const matched = tryMatchWord(selectedCells);
      if (!matched) {
        soundEngine.playClick();
        setSelectedCells([]);
      }
    } else if (selectedCells.length === 1) {
      // Single click: handle as tap-tap start
      const [r, c] = selectedCells[0];
      handleCellClickOrTap(r, c);
      return;
    }
    setDragStartCell(null);
  };

  // Hint: highlights start cell of next unfound word
  const handleUseHint = () => {
    const remaining = WORDS_DATABASE.filter(w => !foundWordIds.includes(w.id));
    if (remaining.length === 0) return;
    const hintWord = remaining[Math.floor(Math.random() * remaining.length)];
    setPulsingCell(hintWord.start);
    setSelectedWordDetail(hintWord);
    soundEngine.playSuccess();
  };

  const handleRestart = () => {
    soundEngine.playClick();
    setFoundWordIds([]);
    setSelectedCells([]);
    setFirstTapCell(null);
    setDragStartCell(null);
    setIsDragging(false);
    setPulsingCell(null);
    setTimerSeconds(0);
    setGameFinished(false);
    setSelectedWordDetail(WORDS_DATABASE[0]);
  };

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-fade-in relative max-w-6xl mx-auto">
      {gameFinished && <QuizConfetti />}

      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToHub}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Volver a Modos de Quiz"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-[#0052cc] dark:text-[#00AFFF] tracking-wider">
                EDUCAPLAY STYLE • SOPA DE LETRAS COMPLETA
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0052cc] dark:text-sky-300 text-[10px] font-bold">
                10x10
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              Sopa de Letras de Seguridad Vial
            </h2>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
            <Clock size={15} className="text-[#0052cc] dark:text-[#00AFFF]" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <CheckCircle2 size={15} />
            <span>{foundWordIds.length}/{WORDS_DATABASE.length} Encontradas</span>
          </div>

          <button
            type="button"
            onClick={handleUseHint}
            disabled={gameFinished}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
            title="Mostrar la primera letra de una palabra pendiente"
          >
            <Lightbulb size={15} />
            <span>Pista</span>
          </button>

          <button
            type="button"
            onClick={handleRestart}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            title="Reiniciar partida"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Main Game Layout: Grid (Left) + Word Clues (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: 10x10 Word Grid */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-3 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col items-center select-none">
          <div className="w-full flex items-center justify-between mb-3 text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>Toca o arrastra la palabra desde la 1ª a la última letra</span>
            {firstTapCell && (
              <span className="text-amber-600 dark:text-amber-400 font-bold animate-pulse">
                Inicio fijado: Toca la letra final
              </span>
            )}
          </div>

          {/* 10x10 Responsive Matrix */}
          <div 
            ref={gridRef}
            className="grid grid-cols-10 gap-1 sm:gap-1.5 p-2 sm:p-3 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-full touch-none"
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {grid.map((row, r) =>
              row.map((letter, c) => {
                const foundColor = getCellFoundColor(r, c);
                const isSelected = isCellSelected(r, c);
                const isPulsing = pulsingCell && pulsingCell[0] === r && pulsingCell[1] === c;
                const isFirstTap = firstTapCell && firstTapCell[0] === r && firstTapCell[1] === c;

                return (
                  <motion.button
                    key={`${r}-${c}`}
                    type="button"
                    onPointerDown={() => handlePointerDown(r, c)}
                    onPointerEnter={() => handlePointerEnter(r, c)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.94 }}
                    style={{
                      backgroundColor: foundColor 
                        ? `${foundColor}33` 
                        : isSelected || isFirstTap
                          ? '#0052cc' 
                          : undefined,
                      borderColor: foundColor 
                        ? foundColor 
                        : isSelected || isFirstTap
                          ? '#00AFFF' 
                          : isPulsing 
                            ? '#F59E0B' 
                            : undefined
                    }}
                    className={`w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-lg sm:rounded-xl text-xs sm:text-base font-black flex items-center justify-center transition-all cursor-pointer relative border ${
                      foundColor
                        ? 'text-slate-900 dark:text-white font-black shadow-xs'
                        : isSelected || isFirstTap
                          ? 'text-white border-2 shadow-md z-10'
                          : isPulsing
                            ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-2 border-amber-400 animate-pulse'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-[#0052cc]'
                    }`}
                  >
                    <span>{letter}</span>
                    {foundColor && (
                      <span 
                        className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: foundColor }}
                      />
                    )}
                  </motion.button>
                );
              })
            )}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap justify-center">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00AFFF]" />
              <span>Horizontales</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00FF88]" />
              <span>Verticales</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Pista activa</span>
            </span>
          </div>
        </div>

        {/* Right: Word List & Clues */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles size={18} className="text-[#0052cc] dark:text-[#00AFFF]" />
                <span>Palabras por Encontrar ({WORDS_DATABASE.length})</span>
              </h3>
              <span className="text-[11px] font-bold text-slate-400">
                Toca para ver pista
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {WORDS_DATABASE.map((item) => {
                const isFound = foundWordIds.includes(item.id);
                const isSelectedForHint = selectedWordDetail?.id === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedWordDetail(item);
                    }}
                    style={{
                      borderColor: isFound ? item.color : undefined
                    }}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between group ${
                      isFound
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold border-emerald-300 dark:border-emerald-800'
                        : isSelectedForHint
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-[#0052cc] text-[#0052cc] dark:text-[#00AFFF]'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span 
                        className="w-2.5 h-2.5 rounded-full shrink-0" 
                        style={{ backgroundColor: item.color }} 
                      />
                      <span className={`text-xs font-black tracking-wider truncate ${isFound ? 'line-through opacity-70' : ''}`}>
                        {item.word}
                      </span>
                    </div>
                    {isFound ? (
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">
                        {item.word.length} ltrs
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Educational Inspector Card */}
          <AnimatePresence mode="wait">
            {selectedWordDetail && (
              <motion.div
                key={selectedWordDetail.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50/70 dark:from-slate-900 dark:to-blue-950/30 p-4 sm:p-5 rounded-3xl border border-blue-200/80 dark:border-blue-900/60 shadow-sm space-y-2 relative"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-white text-[10px] font-black uppercase tracking-wider"
                      style={{ backgroundColor: selectedWordDetail.color }}
                    >
                      {selectedWordDetail.word}
                    </span>
                    {foundWordIds.includes(selectedWordDetail.id) ? (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={13} />
                        <span>¡Encontrada!</span>
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        ({selectedWordDetail.word.length} letras)
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold bg-white/70 dark:bg-slate-800/80 px-2 py-0.5 rounded-full">
                    {selectedWordDetail.legalReference}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {selectedWordDetail.hint}
                </p>

                {!foundWordIds.includes(selectedWordDetail.id) && (
                  <button
                    type="button"
                    onClick={() => {
                      setPulsingCell(selectedWordDetail.start);
                      soundEngine.playSuccess();
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0052cc] dark:text-[#00AFFF] hover:underline cursor-pointer pt-1"
                  >
                    <Lightbulb size={13} />
                    <span>Resaltar primera letra en la cuadrícula</span>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Victory Celebration Modal */}
      <AnimatePresence>
        {gameFinished && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-5 relative overflow-hidden"
            >
              <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-bounce">
                <Trophy size={34} />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  ¡SOPA DE LETRAS COMPLETADA!
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  ¡Excelente Visión Vial!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Has descubierto todas las {WORDS_DATABASE.length} palabras de seguridad vial y normativa colombiana en{' '}
                  <span className="font-bold text-[#0052cc] dark:text-[#00AFFF]">{formatTimer(timerSeconds)}</span>.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
                <div>
                  <span className="text-xs text-slate-400">Puntaje</span>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">100 Pts</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Tiempo</span>
                  <p className="text-xl font-black text-slate-800 dark:text-white">{formatTimer(timerSeconds)}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                >
                  Jugar de Nuevo
                </button>
                <button
                  type="button"
                  onClick={onBackToHub}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#0052cc] hover:bg-[#0047b3] text-white font-bold text-xs transition-all shadow-md cursor-pointer"
                >
                  Otros Quizzes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
