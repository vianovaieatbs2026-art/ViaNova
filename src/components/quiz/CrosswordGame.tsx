import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  RotateCcw, 
  Lightbulb, 
  CheckCircle2, 
  Clock, 
  Trophy, 
  HelpCircle, 
  Sparkles,
  Check,
  ChevronRight,
  Info
} from 'lucide-react';
import { soundEngine } from '../../utils/soundEffects';
import { QuizConfetti } from './QuizConfetti';

interface CrosswordClue {
  id: string;
  number: number;
  direction: 'horizontal' | 'vertical';
  word: string;
  clue: string;
  legalReference: string;
  startRow: number;
  startCol: number;
  length: number;
}

const CLUES_DATA: CrosswordClue[] = [
  {
    id: 'c-1h',
    number: 1,
    direction: 'horizontal',
    word: 'PARE',
    clue: 'Señal reglamentaria octagonal roja (SR-01) que exige detener totalmente el vehículo a cero km/h.',
    legalReference: 'Art. 109 Ley 769 de 2002',
    startRow: 1,
    startCol: 2,
    length: 4
  },
  {
    id: 'c-2v',
    number: 2,
    direction: 'vertical',
    word: 'PEATON',
    clue: 'Actor más vulnerable en la pirámide de la movilidad; tiene prelación absoluta en cruces y cebras.',
    legalReference: 'Art. 105 Ley 769 de 2002',
    startRow: 1,
    startCol: 2,
    length: 6
  },
  {
    id: 'c-3h',
    number: 3,
    direction: 'horizontal',
    word: 'ALCOHOL',
    clue: 'Sustancia con Cero Tolerancia al volante en Colombia bajo la Ley 1696; genera suspensión de licencia.',
    legalReference: 'Ley 1696 de 2013',
    startRow: 3,
    startCol: 2,
    length: 7
  },
  {
    id: 'c-4v',
    number: 4,
    direction: 'vertical',
    word: 'CASCO',
    clue: 'Elemento de protección de uso obligatorio y certificado (DOT/ECE) para motociclistas.',
    legalReference: 'Resolución 23385 de 2020',
    startRow: 3,
    startCol: 4,
    length: 5
  },
  {
    id: 'c-5h',
    number: 5,
    direction: 'horizontal',
    word: 'SEGURO',
    clue: 'Póliza obligatoria SOAT que cubre gastos médicos de todas las víctimas en siniestros viales.',
    legalReference: 'Art. 42 Ley 769 de 2002',
    startRow: 5,
    startCol: 4,
    length: 6
  },
  {
    id: 'c-6h',
    number: 6,
    direction: 'horizontal',
    word: 'CEBRA',
    clue: 'Demarcación vial de franjas blancas en la calzada destinada al cruce peatonal protegido.',
    legalReference: 'Manual de Señalización Mintransporte',
    startRow: 6,
    startCol: 4,
    length: 5
  },
  {
    id: 'c-7h',
    number: 7,
    direction: 'horizontal',
    word: 'OBRAS',
    clue: 'Señales temporales de color naranja (ST) que informan sobre cierres y operarios en la vía.',
    legalReference: 'Capítulo Señales Transitorias Mintransporte',
    startRow: 7,
    startCol: 4,
    length: 5
  }
];

const ROWS = 9;
const COLS = 10;

interface CellCoord {
  r: number;
  c: number;
}

interface CrosswordGameProps {
  onBackToHub: () => void;
  onRecordScore?: (score: number) => void;
}

export const CrosswordGame: React.FC<CrosswordGameProps> = ({
  onBackToHub,
  onRecordScore
}) => {
  // User letter entries grid
  const [userGrid, setUserGrid] = useState<string[][]>(() => 
    Array.from({ length: ROWS }, () => Array(COLS).fill(''))
  );
  const [activeClueId, setActiveClueId] = useState<string>('c-1h');
  const [activeCell, setActiveCell] = useState<CellCoord>({ r: 1, c: 2 });
  const [solvedWordIds, setSolvedWordIds] = useState<string[]>([]);
  const [checkedResults, setCheckedResults] = useState<{ [key: string]: boolean }>({});
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [wrongShake, setWrongShake] = useState<boolean>(false);

  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const activeClue = CLUES_DATA.find(c => c.id === activeClueId) || CLUES_DATA[0];

  // Timer
  useEffect(() => {
    if (gameFinished) return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameFinished]);

  // Solution map for each cell
  const solutionMap = React.useMemo(() => {
    const map: { [key: string]: string } = {};
    CLUES_DATA.forEach(clue => {
      for (let i = 0; i < clue.length; i++) {
        const r = clue.direction === 'horizontal' ? clue.startRow : clue.startRow + i;
        const c = clue.direction === 'horizontal' ? clue.startCol + i : clue.startCol;
        map[`${r}-${c}`] = clue.word[i];
      }
    });
    return map;
  }, []);

  // Numbers to display in cells that start clues
  const cellNumbers = React.useMemo(() => {
    const map: { [key: string]: number } = {};
    CLUES_DATA.forEach(clue => {
      map[`${clue.startRow}-${clue.startCol}`] = clue.number;
    });
    return map;
  }, []);

  // Check which clues are currently solved by user letters
  useEffect(() => {
    const newSolved: string[] = [];
    CLUES_DATA.forEach(clue => {
      let isSolved = true;
      for (let i = 0; i < clue.length; i++) {
        const r = clue.direction === 'horizontal' ? clue.startRow : clue.startRow + i;
        const c = clue.direction === 'horizontal' ? clue.startCol + i : clue.startCol;
        if (userGrid[r][c].toUpperCase() !== clue.word[i]) {
          isSolved = false;
          break;
        }
      }
      if (isSolved) {
        newSolved.push(clue.id);
      }
    });

    if (newSolved.length > solvedWordIds.length) {
      soundEngine.playWordFound();
    }

    setSolvedWordIds(newSolved);

    if (newSolved.length === CLUES_DATA.length && !gameFinished) {
      setGameFinished(true);
      setTimeout(() => {
        soundEngine.playComplete();
        soundEngine.playConfettiPop();
      }, 400);
      if (onRecordScore) {
        onRecordScore(100);
      }
    }
  }, [userGrid, solvedWordIds.length, gameFinished, onRecordScore]);

  // Handle cell click
  const handleSelectCell = (r: number, c: number) => {
    const key = `${r}-${c}`;
    if (!solutionMap[key]) return; // empty black cell

    soundEngine.playLetterSelect(0);
    setActiveCell({ r, c });

    // Find clue that includes this cell
    const matchingClues = CLUES_DATA.filter(clue => {
      if (clue.direction === 'horizontal') {
        return clue.startRow === r && c >= clue.startCol && c < clue.startCol + clue.length;
      } else {
        return clue.startCol === c && r >= clue.startRow && r < clue.startRow + clue.length;
      }
    });

    if (matchingClues.length > 0) {
      // Toggle between H and V if on intersection
      if (matchingClues.some(m => m.id === activeClueId) && matchingClues.length > 1) {
        const other = matchingClues.find(m => m.id !== activeClueId);
        if (other) setActiveClueId(other.id);
      } else {
        setActiveClueId(matchingClues[0].id);
      }
    }
  };

  const handleSelectClue = (clue: CrosswordClue) => {
    soundEngine.playClick();
    setActiveClueId(clue.id);
    setActiveCell({ r: clue.startRow, c: clue.startCol });
    const key = `${clue.startRow}-${clue.startCol}`;
    inputRefs.current[key]?.focus();
  };

  // Keyboard navigation & typing
  const handleKeyDown = (e: React.KeyboardEvent, r: number, c: number) => {
    const key = e.key.toUpperCase();

    if (key === 'BACKSPACE') {
      e.preventDefault();
      soundEngine.playClick();
      const newGrid = [...userGrid.map(row => [...row])];
      newGrid[r][c] = '';
      setUserGrid(newGrid);

      // Move backward along active clue
      if (activeClue.direction === 'horizontal' && c > activeClue.startCol) {
        setActiveCell({ r, c: c - 1 });
        inputRefs.current[`${r}-${c - 1}`]?.focus();
      } else if (activeClue.direction === 'vertical' && r > activeClue.startRow) {
        setActiveCell({ r: r - 1, c });
        inputRefs.current[`${r - 1}-${c}`]?.focus();
      }
      return;
    }

    if (key === 'ARROWLEFT' && c > 0 && solutionMap[`${r}-${c - 1}`]) {
      setActiveCell({ r, c: c - 1 });
      inputRefs.current[`${r}-${c - 1}`]?.focus();
    } else if (key === 'ARROWRIGHT' && c < COLS - 1 && solutionMap[`${r}-${c + 1}`]) {
      setActiveCell({ r, c: c + 1 });
      inputRefs.current[`${r}-${c + 1}`]?.focus();
    } else if (key === 'ARROWUP' && r > 0 && solutionMap[`${r - 1}-${c}`]) {
      setActiveCell({ r: r - 1, c });
      inputRefs.current[`${r - 1}-${c}`]?.focus();
    } else if (key === 'ARROWDOWN' && r < ROWS - 1 && solutionMap[`${r + 1}-${c}`]) {
      setActiveCell({ r: r + 1, c });
      inputRefs.current[`${r + 1}-${c}`]?.focus();
    } else if (/^[A-ZÑ]$/.test(key)) {
      e.preventDefault();
      soundEngine.playLetterSelect(c);
      const newGrid = [...userGrid.map(row => [...row])];
      newGrid[r][c] = key;
      setUserGrid(newGrid);

      // Advance along active clue direction
      if (activeClue.direction === 'horizontal') {
        const nextC = c + 1;
        if (nextC < activeClue.startCol + activeClue.length) {
          setActiveCell({ r, c: nextC });
          inputRefs.current[`${r}-${nextC}`]?.focus();
        }
      } else {
        const nextR = r + 1;
        if (nextR < activeClue.startRow + activeClue.length) {
          setActiveCell({ r: nextR, c });
          inputRefs.current[`${nextR}-${c}`]?.focus();
        }
      }
    }
  };

  // Provide a hint: reveal next letter in active clue
  const handleRevealLetter = () => {
    soundEngine.playSuccess();
    for (let i = 0; i < activeClue.length; i++) {
      const r = activeClue.direction === 'horizontal' ? activeClue.startRow : activeClue.startRow + i;
      const c = activeClue.direction === 'horizontal' ? activeClue.startCol + i : activeClue.startCol;
      const targetLetter = activeClue.word[i];
      if (userGrid[r][c].toUpperCase() !== targetLetter) {
        const newGrid = [...userGrid.map(row => [...row])];
        newGrid[r][c] = targetLetter;
        setUserGrid(newGrid);
        setActiveCell({ r, c });
        inputRefs.current[`${r}-${c}`]?.focus();
        break;
      }
    }
  };

  const handleCheckWord = () => {
    soundEngine.playClick();
    let hasMistake = false;
    for (let i = 0; i < activeClue.length; i++) {
      const r = activeClue.direction === 'horizontal' ? activeClue.startRow : activeClue.startRow + i;
      const c = activeClue.direction === 'horizontal' ? activeClue.startCol + i : activeClue.startCol;
      if (userGrid[r][c] && userGrid[r][c].toUpperCase() !== activeClue.word[i]) {
        hasMistake = true;
        break;
      }
    }

    if (hasMistake) {
      soundEngine.playError();
      setWrongShake(true);
      setTimeout(() => setWrongShake(false), 600);
    } else {
      soundEngine.playSuccess();
    }
  };

  const handleRestart = () => {
    soundEngine.playClick();
    setUserGrid(Array.from({ length: ROWS }, () => Array(COLS).fill('')));
    setSolvedWordIds([]);
    setCheckedResults({});
    setTimerSeconds(0);
    setGameFinished(false);
    setActiveCell({ r: 1, c: 2 });
    setActiveClueId('c-1h');
  };

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {gameFinished && <QuizConfetti />}

      {/* Header bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToHub}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            title="Volver a Modos de Quiz"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-[#0052cc] dark:text-[#00AFFF] tracking-wider">
                EDUCAPLAY STYLE • CRUCIGRAMA INTERACTIVO
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0052cc] dark:text-sky-300 text-[10px] font-bold">
                {CLUES_DATA.length} Palabras
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Crucigrama de Leyes y Normas Viales
            </h2>
          </div>
        </div>

        {/* Status controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
            <Clock size={15} className="text-[#0052cc] dark:text-[#00AFFF]" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <CheckCircle2 size={15} />
            <span>{solvedWordIds.length}/{CLUES_DATA.length} Resueltas</span>
          </div>

          <button
            type="button"
            onClick={handleRevealLetter}
            disabled={gameFinished}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
            title="Revelar una letra en la palabra seleccionada"
          >
            <Lightbulb size={15} />
            <span>Revelar Letra</span>
          </button>

          <button
            type="button"
            onClick={handleCheckWord}
            disabled={gameFinished}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-[#0052cc] dark:text-sky-300 border border-blue-200 dark:border-blue-800 text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Check size={15} />
            <span>Comprobar</span>
          </button>

          <button
            type="button"
            onClick={handleRestart}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            title="Reiniciar crucigrama"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Active Clue Ribbon */}
      <div className="bg-gradient-to-r from-blue-600 via-[#0052cc] to-sky-600 text-white p-4 rounded-2xl shadow-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-sm font-black shrink-0">
            {activeClue.number}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-200">
                {activeClue.direction === 'horizontal' ? 'Horizontal' : 'Vertical'} • {activeClue.length} Letras
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.2 rounded-full font-bold">
                {activeClue.legalReference}
              </span>
            </div>
            <p className="text-sm font-bold text-white mt-0.5">
              {activeClue.clue}
            </p>
          </div>
        </div>

        {solvedWordIds.includes(activeClue.id) && (
          <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 text-xs font-black shrink-0 flex items-center gap-1 shadow-xs">
            <Check size={14} />
            <span>¡Resuelta!</span>
          </span>
        )}
      </div>

      {/* Main Grid & Clues Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Crossword Matrix Board */}
        <div className={`lg:col-span-7 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col items-center select-none ${wrongShake ? 'animate-shake' : ''}`}>
          
          <div className="grid grid-cols-10 gap-1 sm:gap-1.5 p-2 bg-slate-900 dark:bg-slate-950 rounded-2xl border border-slate-800 max-w-full overflow-x-auto">
            {Array.from({ length: ROWS }).map((_, r) =>
              Array.from({ length: COLS }).map((_, c) => {
                const key = `${r}-${c}`;
                const isPuzzleCell = Boolean(solutionMap[key]);
                const number = cellNumbers[key];
                const isActive = activeCell.r === r && activeCell.c === c;

                // Check if this cell belongs to current active clue
                const isInActiveClue = activeClue.direction === 'horizontal'
                  ? (activeClue.startRow === r && c >= activeClue.startCol && c < activeClue.startCol + activeClue.length)
                  : (activeClue.startCol === c && r >= activeClue.startRow && r < activeClue.startRow + activeClue.length);

                if (!isPuzzleCell) {
                  return (
                    <div
                      key={key}
                      className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-lg bg-slate-950/70"
                    />
                  );
                }

                return (
                  <div
                    key={key}
                    onClick={() => handleSelectCell(r, c)}
                    className={`w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-xl relative cursor-pointer flex items-center justify-center font-black text-xs sm:text-base transition-all border ${
                      isActive
                        ? 'bg-amber-300 dark:bg-amber-400 text-slate-950 border-amber-500 shadow-md scale-105 z-10'
                        : isInActiveClue
                          ? 'bg-blue-100 dark:bg-blue-900/60 text-[#0052cc] dark:text-sky-200 border-[#0052cc]'
                          : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 hover:border-[#0052cc]'
                    }`}
                  >
                    {/* Small number label */}
                    {number && (
                      <span className="absolute top-0.5 left-1 text-[8px] sm:text-[9px] font-black text-slate-500 dark:text-slate-400 pointer-events-none">
                        {number}
                      </span>
                    )}

                    <input
                      ref={el => { inputRefs.current[key] = el; }}
                      type="text"
                      maxLength={1}
                      value={userGrid[r][c]}
                      onChange={() => {}}
                      onKeyDown={(e) => handleKeyDown(e, r, c)}
                      className="w-full h-full text-center uppercase font-black bg-transparent focus:outline-hidden cursor-pointer"
                    />
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Virtual Alphabet for Touch Mobile Devices */}
          <div className="mt-5 w-full max-w-md">
            <span className="text-[10px] font-black uppercase text-slate-400 block text-center mb-1.5">
              Teclado de Apoyo Táctil
            </span>
            <div className="flex flex-wrap justify-center gap-1">
              {'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('').map(letter => (
                <button
                  key={letter}
                  type="button"
                  onClick={() => {
                    soundEngine.playLetterSelect(0);
                    const { r, c } = activeCell;
                    const newGrid = [...userGrid.map(row => [...row])];
                    newGrid[r][c] = letter;
                    setUserGrid(newGrid);

                    // Advance
                    if (activeClue.direction === 'horizontal') {
                      const nextC = c + 1;
                      if (nextC < activeClue.startCol + activeClue.length) {
                        setActiveCell({ r, c: nextC });
                      }
                    } else {
                      const nextR = r + 1;
                      if (nextR < activeClue.startRow + activeClue.length) {
                        setActiveCell({ r: nextR, c });
                      }
                    }
                  }}
                  className="w-7 h-8 sm:w-8 sm:h-9 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  {letter}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  const { r, c } = activeCell;
                  const newGrid = [...userGrid.map(row => [...row])];
                  newGrid[r][c] = '';
                  setUserGrid(newGrid);
                }}
                className="px-2 h-8 sm:h-9 bg-rose-100 hover:bg-rose-200 dark:bg-rose-950 text-rose-700 dark:text-rose-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Borrar
              </button>
            </div>
          </div>

        </div>

        {/* Right: Clues lists */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Horizontales */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
              <span>Pistas Horizontales</span>
              <span className="text-xs font-bold text-slate-400">
                {CLUES_DATA.filter(c => c.direction === 'horizontal' && solvedWordIds.includes(c.id)).length} / {CLUES_DATA.filter(c => c.direction === 'horizontal').length}
              </span>
            </h3>

            <div className="space-y-2">
              {CLUES_DATA.filter(c => c.direction === 'horizontal').map(clue => {
                const isSelected = activeClueId === clue.id;
                const isSolved = solvedWordIds.includes(clue.id);

                return (
                  <button
                    key={clue.id}
                    type="button"
                    onClick={() => handleSelectClue(clue)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-[#0052cc] shadow-xs'
                        : isSolved
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                      isSolved 
                        ? 'bg-emerald-500 text-white' 
                        : isSelected 
                          ? 'bg-[#0052cc] text-white' 
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      {clue.number}
                    </span>
                    <div className="flex-1">
                      <p className={`text-xs leading-relaxed ${isSolved ? 'line-through text-slate-500' : 'text-slate-800 dark:text-slate-200 font-medium'}`}>
                        {clue.clue}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400 font-bold">{clue.length} letras</span>
                        <span className="text-[10px] text-slate-400 font-bold">• {clue.legalReference}</span>
                      </div>
                    </div>
                    {isSolved && <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Verticales */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
              <span>Pistas Verticales</span>
              <span className="text-xs font-bold text-slate-400">
                {CLUES_DATA.filter(c => c.direction === 'vertical' && solvedWordIds.includes(c.id)).length} / {CLUES_DATA.filter(c => c.direction === 'vertical').length}
              </span>
            </h3>

            <div className="space-y-2">
              {CLUES_DATA.filter(c => c.direction === 'vertical').map(clue => {
                const isSelected = activeClueId === clue.id;
                const isSolved = solvedWordIds.includes(clue.id);

                return (
                  <button
                    key={clue.id}
                    type="button"
                    onClick={() => handleSelectClue(clue)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-[#0052cc] shadow-xs'
                        : isSolved
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                      isSolved 
                        ? 'bg-emerald-500 text-white' 
                        : isSelected 
                          ? 'bg-[#0052cc] text-white' 
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      {clue.number}
                    </span>
                    <div className="flex-1">
                      <p className={`text-xs leading-relaxed ${isSolved ? 'line-through text-slate-500' : 'text-slate-800 dark:text-slate-200 font-medium'}`}>
                        {clue.clue}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400 font-bold">{clue.length} letras</span>
                        <span className="text-[10px] text-slate-400 font-bold">• {clue.legalReference}</span>
                      </div>
                    </div>
                    {isSolved && <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-1" />}
                  </button>
                );
              })}
            </div>
          </div>

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
                  ¡CRUCIGRAMA VIAL RESUELTO!
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  ¡Maestría en Normas Viales!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Has completado las {CLUES_DATA.length} palabras del crucigrama de seguridad vial colombiana en{' '}
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
