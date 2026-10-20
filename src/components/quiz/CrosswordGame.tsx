import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  RotateCcw, 
  Lightbulb, 
  CheckCircle2, 
  Clock, 
  Trophy, 
  Check, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { soundEngine } from '../../utils/soundEffects';
import { QuizConfetti } from './QuizConfetti';

export interface CrosswordClue {
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

export interface CrosswordLevel {
  id: number;
  title: string;
  subtitle: string;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  rows: number;
  cols: number;
  clues: CrosswordClue[];
}

export const CROSSWORD_LEVELS: CrosswordLevel[] = [
  {
    id: 1,
    title: 'Leyes y Normas Fundamentales',
    subtitle: 'Nivel 1 • Tránsito y Derechos Viales',
    difficulty: 'Básico',
    rows: 9,
    cols: 10,
    clues: [
      {
        id: 'c1-1h',
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
        id: 'c1-1v',
        number: 1,
        direction: 'vertical',
        word: 'PEATON',
        clue: 'Actor más vulnerable en la pirámide de la movilidad; tiene prelación absoluta en cruces y cebras.',
        legalReference: 'Art. 105 Ley 769 de 2002',
        startRow: 1,
        startCol: 2,
        length: 6
      },
      {
        id: 'c1-2h',
        number: 2,
        direction: 'horizontal',
        word: 'ALCOHOL',
        clue: 'Sustancia con Cero Tolerancia al volante en Colombia bajo la Ley 1696; genera suspensión de licencia.',
        legalReference: 'Ley 1696 de 2013',
        startRow: 3,
        startCol: 2,
        length: 7
      },
      {
        id: 'c1-3v',
        number: 3,
        direction: 'vertical',
        word: 'CASCO',
        clue: 'Elemento de protección de uso obligatorio y certificado (DOT/ECE) para motociclistas.',
        legalReference: 'Resolución 23385 de 2020',
        startRow: 3,
        startCol: 4,
        length: 5
      },
      {
        id: 'c1-4h',
        number: 4,
        direction: 'horizontal',
        word: 'TRANSITO',
        clue: 'Desplazamiento ordenado de personas, vehículos y animales regulado por el Código Nacional.',
        legalReference: 'Art. 1 Ley 769 de 2002',
        startRow: 4,
        startCol: 2,
        length: 8
      },
      {
        id: 'c1-5h',
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
        id: 'c1-6h',
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
        id: 'c1-7h',
        number: 7,
        direction: 'horizontal',
        word: 'OBRAS',
        clue: 'Señales temporales de color naranja (ST) que informan sobre cierres y operarios en la vía.',
        legalReference: 'Capítulo Señales Transitorias Mintransporte',
        startRow: 7,
        startCol: 4,
        length: 5
      }
    ]
  },
  {
    id: 2,
    title: 'Equipamiento y Señales',
    subtitle: 'Nivel 2 • Seguridad Activa y Pasiva',
    difficulty: 'Intermedio',
    rows: 9,
    cols: 11,
    clues: [
      {
        id: 'c2-1h',
        number: 1,
        direction: 'horizontal',
        word: 'FRENOS',
        clue: 'Sistema indispensable de detención del vehículo que requiere líquido y pastillas vigentes.',
        legalReference: 'Art. 28 Ley 769 de 2002',
        startRow: 1,
        startCol: 2,
        length: 6
      },
      {
        id: 'c2-1v',
        number: 1,
        direction: 'vertical',
        word: 'FLECHA',
        clue: 'Demarcación en el pavimento que indica la dirección permitida de giro o continuidad de carril.',
        legalReference: 'Manual de Señalización',
        startRow: 1,
        startCol: 2,
        length: 6
      },
      {
        id: 'c2-2h',
        number: 2,
        direction: 'horizontal',
        word: 'LIMITE',
        clue: 'Velocidad máxima fijada por la ley que no debe superarse bajo ninguna circunstancia.',
        legalReference: 'Ley 2251 de 2022',
        startRow: 2,
        startCol: 2,
        length: 6
      },
      {
        id: 'c2-3h',
        number: 3,
        direction: 'horizontal',
        word: 'ESPEJO',
        clue: 'Dispositivo retrovisor que permite controlar los puntos ciegos laterales y posteriores.',
        legalReference: 'Art. 28 Ley 769 de 2002',
        startRow: 3,
        startCol: 2,
        length: 6
      },
      {
        id: 'c2-4v',
        number: 4,
        direction: 'vertical',
        word: 'PLACA',
        clue: 'Documento público y metálico que identifica externamente el automotor de forma única.',
        legalReference: 'Art. 43 Ley 769 de 2002',
        startRow: 3,
        startCol: 4,
        length: 5
      },
      {
        id: 'c2-5h',
        number: 5,
        direction: 'horizontal',
        word: 'BALIZA',
        clue: 'Dispositivo triangular reflectivo colocado en carretera ante averías mecánicas.',
        legalReference: 'Art. 30 Ley 769 de 2002',
        startRow: 5,
        startCol: 3,
        length: 6
      },
      {
        id: 'c2-6h',
        number: 6,
        direction: 'horizontal',
        word: 'CHALECO',
        clue: 'Prenda reflectiva de alta visibilidad reglamentaria para motociclistas de noche.',
        legalReference: 'Art. 94 Ley 769 de 2002',
        startRow: 6,
        startCol: 4,
        length: 7
      },
      {
        id: 'c2-7h',
        number: 7,
        direction: 'horizontal',
        word: 'AIRBAG',
        clue: 'Bolsa inflable de seguridad pasiva complementaria al cinturón ante impacto frontal.',
        legalReference: 'Norma Técnica NTC 5550',
        startRow: 7,
        startCol: 4,
        length: 6
      }
    ]
  },
  {
    id: 3,
    title: 'Maniobras y Distancias',
    subtitle: 'Nivel 3 • Prevención en la Vía',
    difficulty: 'Avanzado',
    rows: 12,
    cols: 11,
    clues: [
      {
        id: 'c3-1h',
        number: 1,
        direction: 'horizontal',
        word: 'SEMAFORO',
        clue: 'Dispositivo electrónico luminoso con luces verde, amarilla y roja para control del flujo vehicular.',
        legalReference: 'Art. 116 Ley 769 de 2002',
        startRow: 1,
        startCol: 2,
        length: 8
      },
      {
        id: 'c3-1v',
        number: 1,
        direction: 'vertical',
        word: 'SOAT',
        clue: 'Póliza sin deducibles que cubre atención médica integral a todos los involucrados en siniestros.',
        legalReference: 'Art. 42 Ley 769 de 2002',
        startRow: 1,
        startCol: 2,
        length: 4
      },
      {
        id: 'c3-2h',
        number: 2,
        direction: 'horizontal',
        word: 'ANDEN',
        clue: 'Franja vial reservada para peatones; su invasión por motos o autos genera comparendo.',
        legalReference: 'Art. 105 Ley 769 de 2002',
        startRow: 3,
        startCol: 2,
        length: 5
      },
      {
        id: 'c3-3v',
        number: 3,
        direction: 'vertical',
        word: 'DISTANCIA',
        clue: 'Espacio de seguridad longitudinal que se debe mantener con el vehículo de adelante (regla de los 3s).',
        legalReference: 'Art. 108 Ley 769 de 2002',
        startRow: 3,
        startCol: 4,
        length: 9
      },
      {
        id: 'c3-4h',
        number: 4,
        direction: 'horizontal',
        word: 'TIMON',
        clue: 'Volante de conducción que siempre debe sujetarse con ambas manos en la posición 9 y 3.',
        legalReference: 'Manual de Conducción Segura',
        startRow: 6,
        startCol: 4,
        length: 5
      },
      {
        id: 'c3-5h',
        number: 5,
        direction: 'horizontal',
        word: 'ALCOHOL',
        clue: 'Causa grave de accidentalidad vial sancionada con inmovilización, multa millonaria y suspensión de licencia.',
        legalReference: 'Ley 1696 de 2013',
        startRow: 7,
        startCol: 4,
        length: 7
      },
      {
        id: 'c3-6h',
        number: 6,
        direction: 'horizontal',
        word: 'NORMA',
        clue: 'Regla obligatoria de conducta vial dictada por el Ministerio de Transporte y el Código de Tránsito.',
        legalReference: 'Ley 769 de 2002',
        startRow: 8,
        startCol: 4,
        length: 5
      },
      {
        id: 'c3-7h',
        number: 7,
        direction: 'horizontal',
        word: 'CASCO',
        clue: 'Elemento protector de cabeza certificado reglamentario para circular en motocicleta.',
        legalReference: 'Resolución 23385 de 2020',
        startRow: 9,
        startCol: 4,
        length: 5
      }
    ]
  }
];

// Fallback constant
export const CLUES_DATA = CROSSWORD_LEVELS[0].clues;

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
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const currentLevel = CROSSWORD_LEVELS.find(l => l.id === currentLevelId) || CROSSWORD_LEVELS[0];

  const [userGrid, setUserGrid] = useState<string[][]>(() => 
    Array.from({ length: currentLevel.rows }, () => Array(currentLevel.cols).fill(''))
  );
  const [activeClueId, setActiveClueId] = useState<string>(currentLevel.clues[0].id);
  const [activeCell, setActiveCell] = useState<CellCoord>({ 
    r: currentLevel.clues[0].startRow, 
    c: currentLevel.clues[0].startCol 
  });
  const [solvedWordIds, setSolvedWordIds] = useState<string[]>([]);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [wrongShake, setWrongShake] = useState<boolean>(false);

  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const activeClue = currentLevel.clues.find(c => c.id === activeClueId) || currentLevel.clues[0];

  // Switch level handler
  const handleSelectLevel = (levelId: number) => {
    soundEngine.playClick();
    setCurrentLevelId(levelId);
    const target = CROSSWORD_LEVELS.find(l => l.id === levelId) || CROSSWORD_LEVELS[0];
    setUserGrid(Array.from({ length: target.rows }, () => Array(target.cols).fill('')));
    setActiveClueId(target.clues[0].id);
    setActiveCell({ r: target.clues[0].startRow, c: target.clues[0].startCol });
    setSolvedWordIds([]);
    setTimerSeconds(0);
    setGameFinished(false);
  };

  // Timer
  useEffect(() => {
    if (gameFinished) return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameFinished]);

  // Solution map for active level
  const solutionMap = React.useMemo(() => {
    const map: { [key: string]: string } = {};
    currentLevel.clues.forEach(clue => {
      for (let i = 0; i < clue.length; i++) {
        const r = clue.direction === 'horizontal' ? clue.startRow : clue.startRow + i;
        const c = clue.direction === 'horizontal' ? clue.startCol + i : clue.startCol;
        map[`${r}-${c}`] = clue.word[i];
      }
    });
    return map;
  }, [currentLevel]);

  // Numbers to display in cells that start clues
  const cellNumbers = React.useMemo(() => {
    const map: { [key: string]: number } = {};
    currentLevel.clues.forEach(clue => {
      map[`${clue.startRow}-${clue.startCol}`] = clue.number;
    });
    return map;
  }, [currentLevel]);

  // Check solved clues
  useEffect(() => {
    const newSolved: string[] = [];
    currentLevel.clues.forEach(clue => {
      let isSolved = true;
      for (let i = 0; i < clue.length; i++) {
        const r = clue.direction === 'horizontal' ? clue.startRow : clue.startRow + i;
        const c = clue.direction === 'horizontal' ? clue.startCol + i : clue.startCol;
        if (!userGrid[r] || userGrid[r][c]?.toUpperCase() !== clue.word[i]) {
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

    if (newSolved.length === currentLevel.clues.length && !gameFinished && currentLevel.clues.length > 0) {
      setGameFinished(true);
      if (!completedLevels.includes(currentLevelId)) {
        setCompletedLevels(prev => [...prev, currentLevelId]);
      }
      setTimeout(() => {
        soundEngine.playComplete();
        soundEngine.playConfettiPop();
      }, 400);
      if (onRecordScore) {
        onRecordScore(100);
      }
    }
  }, [userGrid, solvedWordIds.length, gameFinished, currentLevel, currentLevelId, completedLevels, onRecordScore]);

  const handleSelectCell = (r: number, c: number) => {
    const key = `${r}-${c}`;
    if (!solutionMap[key]) return;

    soundEngine.playLetterSelect(0);
    setActiveCell({ r, c });

    const matchingClues = currentLevel.clues.filter(clue => {
      if (clue.direction === 'horizontal') {
        return clue.startRow === r && c >= clue.startCol && c < clue.startCol + clue.length;
      } else {
        return clue.startCol === c && r >= clue.startRow && r < clue.startRow + clue.length;
      }
    });

    if (matchingClues.length > 0) {
      if (matchingClues.some(m => m.id === activeClueId) && matchingClues.length > 1) {
        const other = matchingClues.find(m => m.id !== activeClueId);
        if (other) setActiveClueId(other.id);
      } else {
        setActiveClueId(matchingClues[0].id);
      }
    }

    inputRefs.current[key]?.focus();
  };

  const handleSelectClue = (clue: CrosswordClue) => {
    soundEngine.playClick();
    setActiveClueId(clue.id);
    setActiveCell({ r: clue.startRow, c: clue.startCol });
    const key = `${clue.startRow}-${clue.startCol}`;
    inputRefs.current[key]?.focus();
  };

  const handleLetterInput = (letter: string, r: number, c: number) => {
    soundEngine.playLetterSelect(c);
    const newGrid = [...userGrid.map(row => [...row])];
    newGrid[r][c] = letter.toUpperCase();
    setUserGrid(newGrid);

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
  };

  const handleKeyDown = (e: React.KeyboardEvent, r: number, c: number) => {
    const key = e.key.toUpperCase();

    if (key === 'BACKSPACE') {
      e.preventDefault();
      soundEngine.playClick();
      const newGrid = [...userGrid.map(row => [...row])];
      if (newGrid[r][c] !== '') {
        newGrid[r][c] = '';
        setUserGrid(newGrid);
      } else {
        if (activeClue.direction === 'horizontal' && c > activeClue.startCol) {
          newGrid[r][c - 1] = '';
          setUserGrid(newGrid);
          setActiveCell({ r, c: c - 1 });
          inputRefs.current[`${r}-${c - 1}`]?.focus();
        } else if (activeClue.direction === 'vertical' && r > activeClue.startRow) {
          newGrid[r - 1][c] = '';
          setUserGrid(newGrid);
          setActiveCell({ r: r - 1, c });
          inputRefs.current[`${r - 1}-${c}`]?.focus();
        }
      }
      return;
    }

    if (key === 'ARROWLEFT' && c > 0 && solutionMap[`${r}-${c - 1}`]) {
      setActiveCell({ r, c: c - 1 });
      inputRefs.current[`${r}-${c - 1}`]?.focus();
    } else if (key === 'ARROWRIGHT' && c < currentLevel.cols - 1 && solutionMap[`${r}-${c + 1}`]) {
      setActiveCell({ r, c: c + 1 });
      inputRefs.current[`${r}-${c + 1}`]?.focus();
    } else if (key === 'ARROWUP' && r > 0 && solutionMap[`${r - 1}-${c}`]) {
      setActiveCell({ r: r - 1, c });
      inputRefs.current[`${r - 1}-${c}`]?.focus();
    } else if (key === 'ARROWDOWN' && r < currentLevel.rows - 1 && solutionMap[`${r + 1}-${c}`]) {
      setActiveCell({ r: r + 1, c });
      inputRefs.current[`${r + 1}-${c}`]?.focus();
    } else if (/^[A-ZÑ]$/.test(key)) {
      e.preventDefault();
      handleLetterInput(key, r, c);
    }
  };

  const handleRevealLetter = () => {
    soundEngine.playSuccess();
    for (let i = 0; i < activeClue.length; i++) {
      const r = activeClue.direction === 'horizontal' ? activeClue.startRow : activeClue.startRow + i;
      const c = activeClue.direction === 'horizontal' ? activeClue.startCol + i : activeClue.startCol;
      const targetLetter = activeClue.word[i];
      if (userGrid[r][c]?.toUpperCase() !== targetLetter) {
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
    setUserGrid(Array.from({ length: currentLevel.rows }, () => Array(currentLevel.cols).fill('')));
    setSolvedWordIds([]);
    setTimerSeconds(0);
    setGameFinished(false);
    setActiveCell({ r: currentLevel.clues[0].startRow, c: currentLevel.clues[0].startCol });
    setActiveClueId(currentLevel.clues[0].id);
  };

  const handleNextLevel = () => {
    if (currentLevelId < CROSSWORD_LEVELS.length) {
      handleSelectLevel(currentLevelId + 1);
    } else {
      handleSelectLevel(1);
    }
  };

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-fade-in relative max-w-6xl mx-auto">
      {gameFinished && <QuizConfetti />}

      {/* Header bar */}
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
                JUEGO DIDÁCTICO • 3 CRUCIGRAMAS
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0052cc] dark:text-sky-300 text-[10px] font-bold">
                {currentLevel.difficulty}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              Crucigrama: {currentLevel.title}
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
            <span>{solvedWordIds.length}/{currentLevel.clues.length} Resueltas</span>
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

      {/* 3 CRUCIGRAMAS TABS SELECTOR */}
      <div className="bg-slate-100 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-1.5">
        {CROSSWORD_LEVELS.map((lvl) => {
          const isActive = lvl.id === currentLevelId;
          const isDone = completedLevels.includes(lvl.id);

          return (
            <button
              key={lvl.id}
              type="button"
              onClick={() => handleSelectLevel(lvl.id)}
              className={`p-3 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm font-black border border-purple-200 dark:border-purple-900/60'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                  isActive 
                    ? 'bg-purple-600 text-white' 
                    : isDone
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {lvl.id}
                </span>
                <div className="truncate">
                  <p className="text-xs font-bold leading-tight truncate">
                    {lvl.title}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    {lvl.difficulty} • {lvl.clues.length} Palabras
                  </span>
                </div>
              </div>
              {isDone && (
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Clue Ribbon */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-4 rounded-2xl shadow-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-sm font-black shrink-0">
            {activeClue.number}
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-200">
                {activeClue.direction === 'horizontal' ? 'Horizontal' : 'Vertical'} • {activeClue.length} Letras
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                {activeClue.legalReference}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-white mt-0.5">
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
        <div className={`lg:col-span-7 bg-white dark:bg-slate-900 p-3 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col items-center select-none ${wrongShake ? 'animate-shake' : ''}`}>
          
          <div 
            className="grid gap-1 sm:gap-1.5 p-2 bg-slate-900 dark:bg-slate-950 rounded-2xl border border-slate-800 max-w-full overflow-x-auto"
            style={{
              gridTemplateColumns: `repeat(${currentLevel.cols}, minmax(0, 1fr))`
            }}
          >
            {Array.from({ length: currentLevel.rows }).map((_, r) =>
              Array.from({ length: currentLevel.cols }).map((_, c) => {
                const key = `${r}-${c}`;
                const isPuzzleCell = Boolean(solutionMap[key]);
                const number = cellNumbers[key];
                const isActive = activeCell.r === r && activeCell.c === c;

                const isInActiveClue = activeClue.direction === 'horizontal'
                  ? (activeClue.startRow === r && c >= activeClue.startCol && c < activeClue.startCol + activeClue.length)
                  : (activeClue.startCol === c && r >= activeClue.startRow && r < activeClue.startRow + activeClue.length);

                if (!isPuzzleCell) {
                  return (
                    <div
                      key={key}
                      className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg bg-slate-950/70"
                    />
                  );
                }

                return (
                  <div
                    key={key}
                    onClick={() => handleSelectCell(r, c)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg sm:rounded-xl relative cursor-pointer flex items-center justify-center font-black text-xs sm:text-base transition-all border ${
                      isActive
                        ? 'bg-amber-300 dark:bg-amber-400 text-slate-950 border-amber-500 shadow-md scale-105 z-10'
                        : isInActiveClue
                          ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-200 border-purple-500'
                          : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 hover:border-purple-500'
                    }`}
                  >
                    {number && (
                      <span className="absolute top-0.5 left-1 text-[8px] sm:text-[9px] font-black text-slate-500 dark:text-slate-400 pointer-events-none">
                        {number}
                      </span>
                    )}

                    <input
                      ref={el => { inputRefs.current[key] = el; }}
                      type="text"
                      maxLength={1}
                      value={userGrid[r] ? userGrid[r][c] || '' : ''}
                      onChange={(e) => {
                        const val = e.target.value.slice(-1).toUpperCase();
                        if (/^[A-ZÑ]$/.test(val)) {
                          handleLetterInput(val, r, c);
                        }
                      }}
                      onKeyDown={(e) => handleKeyDown(e, r, c)}
                      className="w-full h-full text-center uppercase font-black bg-transparent focus:outline-hidden cursor-pointer"
                    />
                  </div>
                );
              })
            )}
          </div>

          {/* Virtual Alphabet for Touch Mobile Devices */}
          <div className="mt-5 w-full max-w-md">
            <span className="text-[10px] font-black uppercase text-slate-400 block text-center mb-1.5">
              Teclado Táctil de Apoyo
            </span>
            <div className="flex flex-wrap justify-center gap-1">
              {'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('').map(letter => (
                <button
                  key={letter}
                  type="button"
                  onClick={() => {
                    const { r, c } = activeCell;
                    handleLetterInput(letter, r, c);
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
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
              <span>Pistas Horizontales</span>
              <span className="text-xs font-bold text-slate-400">
                {currentLevel.clues.filter(c => c.direction === 'horizontal' && solvedWordIds.includes(c.id)).length} / {currentLevel.clues.filter(c => c.direction === 'horizontal').length}
              </span>
            </h3>

            <div className="space-y-2">
              {currentLevel.clues.filter(c => c.direction === 'horizontal').map(clue => {
                const isSelected = activeClueId === clue.id;
                const isSolved = solvedWordIds.includes(clue.id);

                return (
                  <button
                    key={clue.id}
                    type="button"
                    onClick={() => handleSelectClue(clue)}
                    className={`w-full p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-600 shadow-xs'
                        : isSolved
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                      isSolved 
                        ? 'bg-emerald-500 text-white' 
                        : isSelected 
                          ? 'bg-purple-600 text-white' 
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
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
              <span>Pistas Verticales</span>
              <span className="text-xs font-bold text-slate-400">
                {currentLevel.clues.filter(c => c.direction === 'vertical' && solvedWordIds.includes(c.id)).length} / {currentLevel.clues.filter(c => c.direction === 'vertical').length}
              </span>
            </h3>

            <div className="space-y-2">
              {currentLevel.clues.filter(c => c.direction === 'vertical').map(clue => {
                const isSelected = activeClueId === clue.id;
                const isSolved = solvedWordIds.includes(clue.id);

                return (
                  <button
                    key={clue.id}
                    type="button"
                    onClick={() => handleSelectClue(clue)}
                    className={`w-full p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-600 shadow-xs'
                        : isSolved
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                      isSolved 
                        ? 'bg-emerald-500 text-white' 
                        : isSelected 
                          ? 'bg-purple-600 text-white' 
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
                  {currentLevel.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Has completado las {currentLevel.clues.length} palabras de este crucigrama en{' '}
                  <span className="font-bold text-purple-600 dark:text-purple-400">{formatTimer(timerSeconds)}</span>.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
                <div>
                  <span className="text-xs text-slate-400">Puntaje</span>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">100 Pts</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Progreso Crucigramas</span>
                  <p className="text-xl font-black text-slate-800 dark:text-white">
                    {completedLevels.length} de {CROSSWORD_LEVELS.length}
                  </p>
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
                {currentLevelId < CROSSWORD_LEVELS.length ? (
                  <button
                    type="button"
                    onClick={handleNextLevel}
                    className="flex-1 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Siguiente Nivel</span>
                    <ChevronRight size={15} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onBackToHub}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#0052cc] hover:bg-[#0047b3] text-white font-bold text-xs transition-all shadow-md cursor-pointer"
                  >
                    Otros Quizzes
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
