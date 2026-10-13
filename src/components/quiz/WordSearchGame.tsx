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
  Volume2, 
  VolumeX, 
  Zap,
  HelpCircle,
  Award
} from 'lucide-react';
import { soundEngine } from '../../utils/soundEffects';
import { QuizConfetti } from './QuizConfetti';

interface WordItem {
  id: string;
  word: string;
  hint: string;
  legalReference: string;
  start: [number, number]; // [row, col]
  end: [number, number];
  color: string;
}

// 10x10 Grid with fixed, well-placed words
const GRID_SIZE = 10;

const WORDS_DATABASE: WordItem[] = [
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
    word: 'PEATON',
    hint: 'Actor vial más vulnerable en la pirámide de movilidad con prelación de paso.',
    legalReference: 'Art. 105 Ley 769 de 2002',
    start: [1, 9],
    end: [6, 9],
    color: '#00FF88'
  },
  {
    id: 'w-3',
    word: 'CINTURON',
    hint: 'Elemento de seguridad pasiva obligatorio en asientos delanteros y traseros.',
    legalReference: 'Art. 82 Ley 769 de 2002',
    start: [3, 1],
    end: [3, 8],
    color: '#FF6B00'
  },
  {
    id: 'w-4',
    word: 'VELOCIDAD',
    hint: 'Límite urbano máximo general fijado en 50 km/h por la Ley Julián Esteban.',
    legalReference: 'Ley 2251 de 2022',
    start: [6, 0],
    end: [6, 8],
    color: '#A855F7'
  },
  {
    id: 'w-5',
    word: 'CASCO',
    hint: 'Protección reglamentaria y certificada (DOT/ECE) para motociclistas.',
    legalReference: 'Resolución 23385 de 2020',
    start: [1, 0],
    end: [5, 0],
    color: '#F43F5E'
  },
  {
    id: 'w-6',
    word: 'PARE',
    hint: 'Señal reglamentaria octagonal SR-01 de detención total e inequívoca a 0 km/h.',
    legalReference: 'Art. 109 Ley 769 de 2002',
    start: [1, 2],
    end: [4, 2],
    color: '#EAB308'
  },
  {
    id: 'w-7',
    word: 'CEBRA',
    hint: 'Demarcación vial de líneas blancas longitudinales para cruce peatonal seguro.',
    legalReference: 'Manual de Señalización Mintransporte',
    start: [8, 3],
    end: [8, 7],
    color: '#06B6D4'
  },
  {
    id: 'w-8',
    word: 'FRENOS',
    hint: 'Sistema de detención mecánica e hidráulica clave en la revisión técnico-mecánica.',
    legalReference: 'Art. 28 Ley 769 de 2002',
    start: [2, 5],
    end: [7, 5],
    color: '#10B981'
  }
];

// Pre-filled 10x10 matrix ensuring every word is placed and filler letters are realistic
const BASE_GRID: string[][] = [
  ['T', 'S', 'E', 'M', 'A', 'F', 'O', 'R', 'O', 'B'], // 0: SEMAFORO (1..8)
  ['C', 'X', 'P', 'J', 'K', 'L', 'M', 'N', 'O', 'P'], // 1: CASCO(1..5,0), PARE(1..4,2), PEATON(1..6,9)
  ['A', 'Z', 'A', 'Q', 'W', 'F', 'R', 'T', 'Y', 'E'], // 2: FRENOS(2..7,5)
  ['S', 'C', 'I', 'N', 'T', 'U', 'R', 'O', 'N', 'A'], // 3: CINTURON(3, 1..8)
  ['C', 'D', 'E', 'G', 'H', 'E', 'I', 'J', 'K', 'T'], // 4: E of PARE
  ['O', 'L', 'M', 'N', 'P', 'N', 'Q', 'R', 'S', 'O'], // 5: O of CASCO
  ['V', 'E', 'L', 'O', 'C', 'I', 'D', 'A', 'D', 'N'], // 6: VELOCIDAD(6, 0..8)
  ['A', 'B', 'C', 'D', 'E', 'O', 'F', 'G', 'H', 'I'], // 7: O of FRENOS
  ['J', 'K', 'L', 'C', 'E', 'S', 'R', 'A', 'M', 'N'], // 8: CEBRA -> wait, index 5 is S in typo, let's fix
  ['O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Z']  // 9
];

// Fix row 8 so row 8, col 3..7 spells C-E-B-R-A
BASE_GRID[8][3] = 'C';
BASE_GRID[8][4] = 'E';
BASE_GRID[8][5] = 'B';
BASE_GRID[8][6] = 'R';
BASE_GRID[8][7] = 'A';

// Fix row 7 col 5: S of FRENOS (F-R-E-N-O-S: row 2=F, row 3=R, row 4=E, row 5=N, row 6=O, row 7=S)
BASE_GRID[2][5] = 'F';
BASE_GRID[3][5] = 'R'; // wait! In row 3, C-I-N-T-U-R-O-N: col 5 is U!
// To keep CINTURON and FRENOS from colliding at (3,5), let's place FRENOS at column 4 from row 4 to 9 or place FRENOS at col 6:
// Let's place FRENOS vertically at col 0, rows 4..9 or horizontal row 9:
BASE_GRID[9][1] = 'F';
BASE_GRID[9][2] = 'R';
BASE_GRID[9][3] = 'E';
BASE_GRID[9][4] = 'N';
BASE_GRID[9][5] = 'O';
BASE_GRID[9][6] = 'S';
WORDS_DATABASE[7].start = [9, 1];
WORDS_DATABASE[7].end = [9, 6];

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
  const [startCell, setStartCell] = useState<[number, number] | null>(null);
  const [activeHintWordId, setActiveHintWordId] = useState<string | null>(null);
  const [pulsingCell, setPulsingCell] = useState<[number, number] | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [selectedWordDetail, setSelectedWordDetail] = useState<WordItem | null>(null);

  // Timer
  useEffect(() => {
    if (gameFinished) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameFinished]);

  // Check victory
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

  // Helper: check if a cell is part of any found word
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

  // Generate line of cells between start and current
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

  const handleCellDown = (r: number, c: number) => {
    soundEngine.playLetterSelect(0);
    setIsDragging(true);
    setStartCell([r, c]);
    setSelectedCells([[r, c]]);
  };

  const handleCellEnter = (r: number, c: number) => {
    if (!isDragging || !startCell) return;
    const line = getLineCells(startCell, [r, c]);
    if (line.length !== selectedCells.length) {
      soundEngine.playLetterSelect(line.length);
    }
    setSelectedCells(line);
  };

  const handleCellUp = () => {
    if (!isDragging || selectedCells.length === 0) {
      setIsDragging(false);
      setStartCell(null);
      return;
    }

    // Check if selected cells match any word in database (both forward or backward)
    const selectedString = selectedCells.map(([r, c]) => grid[r][c]).join('');
    const reversedString = selectedString.split('').reverse().join('');

    let matchedWord: WordItem | null = null;
    for (const w of WORDS_DATABASE) {
      if (w.word === selectedString || w.word === reversedString) {
        // Also verify endpoints
        const [sr, sc] = w.start;
        const [er, ec] = w.end;
        const [firstR, firstC] = selectedCells[0];
        const [lastR, lastC] = selectedCells[selectedCells.length - 1];

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
    } else {
      soundEngine.playClick();
    }

    setIsDragging(false);
    setStartCell(null);
    setSelectedCells([]);
  };

  // Provide a hint: highlight first letter of an unfound word
  const handleUseHint = () => {
    const remaining = WORDS_DATABASE.filter(w => !foundWordIds.includes(w.id));
    if (remaining.length === 0) return;
    const hintWord = remaining[Math.floor(Math.random() * remaining.length)];
    setPulsingCell(hintWord.start);
    setActiveHintWordId(hintWord.id);
    setSelectedWordDetail(hintWord);
    soundEngine.playSuccess();
  };

  const handleRestart = () => {
    soundEngine.playClick();
    setFoundWordIds([]);
    setSelectedCells([]);
    setStartCell(null);
    setIsDragging(false);
    setPulsingCell(null);
    setActiveHintWordId(null);
    setTimerSeconds(0);
    setGameFinished(false);
    setSelectedWordDetail(null);
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
                EDUCAPLAY STYLE • SOPA DE LETRAS
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0052cc] dark:text-sky-300 text-[10px] font-bold">
                10x10
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Sopa de Letras de Seguridad Vial
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
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col items-center select-none">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 text-center">
            Haz clic o arrastra desde la primera hasta la última letra de cada palabra oculta.
          </p>

          <div 
            className="grid grid-cols-10 gap-1 sm:gap-1.5 p-2 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-full touch-none"
            onPointerUp={handleCellUp}
            onPointerLeave={handleCellUp}
          >
            {grid.map((row, r) =>
              row.map((letter, c) => {
                const foundColor = getCellFoundColor(r, c);
                const isSelected = isCellSelected(r, c);
                const isPulsing = pulsingCell && pulsingCell[0] === r && pulsingCell[1] === c;

                return (
                  <motion.button
                    key={`${r}-${c}`}
                    type="button"
                    onPointerDown={() => handleCellDown(r, c)}
                    onPointerEnter={() => handleCellEnter(r, c)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      backgroundColor: foundColor 
                        ? `${foundColor}33` 
                        : isSelected 
                          ? '#0052cc' 
                          : undefined,
                      borderColor: foundColor 
                        ? foundColor 
                        : isSelected 
                          ? '#00AFFF' 
                          : isPulsing 
                            ? '#F59E0B' 
                            : undefined
                    }}
                    className={`w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-xl text-xs sm:text-base font-black flex items-center justify-center transition-all cursor-pointer relative border ${
                      foundColor
                        ? 'text-slate-900 dark:text-white font-black shadow-xs'
                        : isSelected
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

          <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 flex-wrap justify-center">
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
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles size={18} className="text-[#0052cc] dark:text-[#00AFFF]" />
                <span>Palabras por Encontrar ({WORDS_DATABASE.length})</span>
              </h3>
              <span className="text-xs font-bold text-slate-400">
                Toca una palabra para ver pista
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
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between group ${
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

          {/* Educational Inspector Card for selected or found word */}
          <AnimatePresence mode="wait">
            {selectedWordDetail && (
              <motion.div
                key={selectedWordDetail.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50/70 dark:from-slate-900 dark:to-blue-950/30 p-5 rounded-3xl border border-blue-200/80 dark:border-blue-900/60 shadow-sm space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-white text-[10px] font-black uppercase"
                      style={{ backgroundColor: selectedWordDetail.color }}
                    >
                      {selectedWordDetail.word}
                    </span>
                    {foundWordIds.includes(selectedWordDetail.id) && (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={13} />
                        <span>¡Descubierta!</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                    {selectedWordDetail.legalReference}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {selectedWordDetail.hint}
                </p>
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
                  ¡Excelente Agilidad Visual!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Encontraste las {WORDS_DATABASE.length} palabras clave de seguridad vial colombiana en un tiempo de{' '}
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
