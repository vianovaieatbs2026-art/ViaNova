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
  Layers,
  ChevronRight
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

export interface WordSearchLevel {
  id: number;
  title: string;
  subtitle: string;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  words: WordItem[];
  grid: string[][];
}

// 3 Complete, Fully Verified Word Searches (10 Words each, 0 Collisions)
export const WORD_SEARCH_LEVELS: WordSearchLevel[] = [
  {
    id: 1,
    title: 'Señales y Normas Urbanas',
    subtitle: 'Nivel 1 • Seguridad Vial Esencial',
    difficulty: 'Básico',
    words: [
      { id: 'w1-1', word: 'SEMAFORO', hint: 'Dispositivo luminoso que regula el tránsito con luces verde, amarilla y roja.', legalReference: 'Art. 116 Ley 769 de 2002', start: [0, 1], end: [0, 8], color: '#00AFFF' },
      { id: 'w1-2', word: 'SOAT', hint: 'Seguro Obligatorio de Accidentes de Tránsito que ampara a todas las víctimas.', legalReference: 'Art. 42 Ley 769 de 2002', start: [1, 3], end: [1, 6], color: '#3B82F6' },
      { id: 'w1-3', word: 'PARE', hint: 'Señal reglamentaria octagonal SR-01 de detención total e inequívoca a 0 km/h.', legalReference: 'Art. 109 Ley 769 de 2002', start: [2, 2], end: [2, 5], color: '#EAB308' },
      { id: 'w1-4', word: 'CINTURON', hint: 'Elemento de seguridad pasiva obligatorio en asientos delanteros y traseros.', legalReference: 'Art. 82 Ley 769 de 2002', start: [4, 1], end: [4, 8], color: '#FF6B00' },
      { id: 'w1-5', word: 'VELOCIDAD', hint: 'Límite urbano general de 50 km/h fijado por la Ley Julián Esteban.', legalReference: 'Ley 2251 de 2022', start: [6, 0], end: [6, 8], color: '#A855F7' },
      { id: 'w1-6', word: 'LUCES', hint: 'Sistema de alumbrado reglamentario activo obligatorio para visibilidad en vía.', legalReference: 'Art. 86 Ley 769 de 2002', start: [7, 2], end: [7, 6], color: '#EC4899' },
      { id: 'w1-7', word: 'CEBRA', hint: 'Demarcación vial de líneas blancas longitudinales para cruce peatonal seguro.', legalReference: 'Manual de Señalización Mintransporte', start: [8, 2], end: [8, 6], color: '#06B6D4' },
      { id: 'w1-8', word: 'FRENOS', hint: 'Sistema de detención mecánica e hidráulica clave en la revisión técnico-mecánica.', legalReference: 'Art. 28 Ley 769 de 2002', start: [9, 1], end: [9, 6], color: '#10B981' },
      { id: 'w1-9', word: 'CASCO', hint: 'Protección reglamentaria y certificada (DOT/ECE) para motociclistas.', legalReference: 'Resolución 23385 de 2020', start: [1, 0], end: [5, 0], color: '#F43F5E' },
      { id: 'w1-10', word: 'PEATON', hint: 'Actor vial más vulnerable en la pirámide de movilidad con prelación de paso.', legalReference: 'Art. 105 Ley 769 de 2002', start: [1, 9], end: [6, 9], color: '#00FF88' }
    ],
    grid: [
      ['X', 'S', 'E', 'M', 'A', 'F', 'O', 'R', 'O', 'V'],
      ['C', 'Y', 'U', 'S', 'O', 'A', 'T', 'P', 'T', 'P'],
      ['A', 'P', 'P', 'A', 'R', 'E', 'B', 'S', 'U', 'E'],
      ['S', 'S', 'J', 'T', 'Y', 'Z', 'X', 'E', 'D', 'A'],
      ['C', 'C', 'I', 'N', 'T', 'U', 'R', 'O', 'N', 'T'],
      ['O', 'R', 'V', 'E', 'M', 'I', 'N', 'R', 'B', 'O'],
      ['V', 'E', 'L', 'O', 'C', 'I', 'D', 'A', 'D', 'N'],
      ['O', 'T', 'L', 'U', 'C', 'E', 'S', 'L', 'T', 'D'],
      ['X', 'M', 'C', 'E', 'B', 'R', 'A', 'E', 'W', 'E'],
      ['J', 'F', 'R', 'E', 'N', 'O', 'S', 'U', 'I', 'A']
    ]
  },
  {
    id: 2,
    title: 'Normas y Actores Viales',
    subtitle: 'Nivel 2 • Movilidad y Tránsito',
    difficulty: 'Intermedio',
    words: [
      { id: 'w2-1', word: 'CICLISTA', hint: 'Actor vial vulnerable que debe usar casco y chaleco reflectivo nocturno.', legalReference: 'Ley 1811 de 2016', color: '#00AFFF', start: [0, 2], end: [7, 2] },
      { id: 'w2-2', word: 'GLORIETA', hint: 'Intersección circular donde tiene prelación el vehículo que ya circula dentro.', legalReference: 'Art. 119 Ley 769 de 2002', color: '#10B981', start: [3, 1], end: [3, 8] },
      { id: 'w2-3', word: 'PASAJERO', hint: 'Persona distinta del conductor que se transporta legalmente en un vehículo.', legalReference: 'Art. 2 Ley 769 de 2002', color: '#06B6D4', start: [1, 9], end: [8, 9] },
      { id: 'w2-4', word: 'CALZADA', hint: 'Parte de la vía destinada a la circulación regular de vehículos automotores.', legalReference: 'Art. 2 Ley 769 de 2002', color: '#8B5CF6', start: [0, 2], end: [0, 8] },
      { id: 'w2-5', word: 'CHALECO', hint: 'Prenda reflectiva obligatoria para motociclistas y ciclistas entre 18:00 y 06:00.', legalReference: 'Art. 94 Ley 769 de 2002', color: '#EC4899', start: [0, 0], end: [6, 0] },
      { id: 'w2-6', word: 'CARRIL', hint: 'Faja longitudinal delimitada en la calzada para el tránsito de una fila de vehículos.', legalReference: 'Art. 2 Ley 769 de 2002', color: '#E11D48', start: [4, 3], end: [4, 8] },
      { id: 'w2-7', word: 'ANDEN', hint: 'Zona longitudinal de la vía urbana destinada exclusivamente al tránsito de peatones.', legalReference: 'Art. 2 Ley 769 de 2002', color: '#F59E0B', start: [5, 4], end: [5, 8] },
      { id: 'w2-8', word: 'BERMA', hint: 'Franja lateral contigua a la calzada para emergencias y detención temporal.', legalReference: 'Art. 2 Ley 769 de 2002', color: '#3B82F6', start: [1, 3], end: [1, 7] },
      { id: 'w2-9', word: 'PLACA', hint: 'Identificación metálica oficial e intransferible expedida por el RUNT.', legalReference: 'Art. 43 Ley 769 de 2002', color: '#D97706', start: [6, 3], end: [6, 7] },
      { id: 'w2-10', word: 'TIMON', hint: 'Mando mecánico de dirección del vehículo automotor para maniobrar en la vía.', legalReference: 'Manual de Conducción Segura', color: '#6366F1', start: [2, 4], end: [2, 8] }
    ],
    grid: [
      ['C', 'E', 'C', 'A', 'L', 'Z', 'A', 'D', 'A', 'C'],
      ['H', 'C', 'I', 'B', 'E', 'R', 'M', 'A', 'Q', 'P'],
      ['A', 'T', 'C', 'G', 'T', 'I', 'M', 'O', 'N', 'A'],
      ['L', 'G', 'L', 'O', 'R', 'I', 'E', 'T', 'A', 'S'],
      ['E', 'L', 'I', 'C', 'A', 'R', 'R', 'I', 'L', 'A'],
      ['C', 'E', 'S', 'B', 'A', 'N', 'D', 'E', 'N', 'J'],
      ['O', 'B', 'T', 'P', 'L', 'A', 'C', 'A', 'S', 'E'],
      ['X', 'A', 'A', 'T', 'O', 'W', 'S', 'U', 'J', 'R'],
      ['X', 'G', 'X', 'I', 'W', 'Z', 'P', 'Z', 'D', 'O'],
      ['D', 'N', 'O', 'H', 'S', 'D', 'A', 'E', 'H', 'H']
    ]
  },
  {
    id: 3,
    title: 'Prevención y Carretera',
    subtitle: 'Nivel 3 • Mecánica y Emergencias',
    difficulty: 'Avanzado',
    words: [
      { id: 'w3-1', word: 'EXTINTOR', hint: 'Equipo contra incendios de polvo químico seco exigido en el equipo de carretera.', legalReference: 'Art. 30 Ley 769 de 2002', color: '#EF4444', start: [5, 0], end: [5, 7] },
      { id: 'w3-2', word: 'BOTIQUIN', hint: 'Kit de primeros auxilios obligatorio con gasas, antisépticos y vendajes.', legalReference: 'Art. 30 Ley 769 de 2002', color: '#10B981', start: [7, 0], end: [7, 7] },
      { id: 'w3-3', word: 'REVISION', hint: 'Inspección técnico-mecánica y de gases obligatoria en Centros de Diagnóstico (CDA).', legalReference: 'Art. 50 Ley 769 de 2002', color: '#8B5CF6', start: [0, 8], end: [7, 8] },
      { id: 'w3-4', word: 'REFLEJOS', hint: 'Capacidad de respuesta neuromotora del conductor ante un obstáculo inesperado.', legalReference: 'Resolución 217 de 2014', color: '#EC4899', start: [1, 0], end: [1, 7] },
      { id: 'w3-5', word: 'LLANTAS', hint: 'Neumáticos que deben tener un labrado mínimo de 1.6 mm para evitar hidroplaneo.', legalReference: 'Resolución 567 de 2018', color: '#6366F1', start: [0, 9], end: [6, 9] },
      { id: 'w3-6', word: 'BALIZAS', hint: 'Señales reflectivas triangulares de emergencia colocadas a 30m y 50m del vehículo.', legalReference: 'Art. 30 Ley 769 de 2002', color: '#F59E0B', start: [9, 0], end: [9, 6] },
      { id: 'w3-7', word: 'CRUCETA', hint: 'Llave en cruz metálica para aflojar y apretar pernos de las ruedas.', legalReference: 'Art. 30 Ley 769 de 2002', color: '#E11D48', start: [3, 0], end: [3, 6] },
      { id: 'w3-8', word: 'AIRBAG', hint: 'Bolsa de aire de inflado pirotécnico en milisegundos para protección de colisión.', legalReference: 'Norma Técnica NTC 5550', color: '#00AFFF', start: [2, 0], end: [2, 5] },
      { id: 'w3-9', word: 'GATO', hint: 'Herramienta hidráulica o mecánica para elevación en cambio de rueda pinchada.', legalReference: 'Art. 30 Ley 769 de 2002', color: '#14B8A6', start: [0, 1], end: [0, 4] },
      { id: 'w3-10', word: 'TACO', hint: 'Bloques de seguridad para acuñar las ruedas cuando el vehículo se detiene en pendiente.', legalReference: 'Art. 30 Ley 769 de 2002', color: '#D97706', start: [2, 6], end: [5, 6] }
    ],
    grid: [
      ['I', 'G', 'A', 'T', 'O', 'D', 'S', 'O', 'R', 'L'],
      ['R', 'E', 'F', 'L', 'E', 'J', 'O', 'S', 'E', 'L'],
      ['A', 'I', 'R', 'B', 'A', 'G', 'T', 'M', 'V', 'A'],
      ['C', 'R', 'U', 'C', 'E', 'T', 'A', 'Q', 'I', 'N'],
      ['P', 'Y', 'K', 'O', 'U', 'A', 'C', 'H', 'S', 'T'],
      ['E', 'X', 'T', 'I', 'N', 'T', 'O', 'R', 'I', 'A'],
      ['J', 'W', 'X', 'S', 'X', 'V', 'Z', 'D', 'O', 'S'],
      ['B', 'O', 'T', 'I', 'Q', 'U', 'I', 'N', 'N', 'E'],
      ['B', 'J', 'S', 'K', 'B', 'S', 'P', 'N', 'Q', 'Z'],
      ['B', 'A', 'L', 'I', 'Z', 'A', 'S', 'A', 'B', 'R']
    ]
  }
];

// Fallback constant for backwards compatibility
export const WORDS_DATABASE = WORD_SEARCH_LEVELS[0].words;
export const BASE_GRID = WORD_SEARCH_LEVELS[0].grid;

interface WordSearchGameProps {
  onBackToHub: () => void;
  onRecordScore?: (score: number) => void;
}

export const WordSearchGame: React.FC<WordSearchGameProps> = ({
  onBackToHub,
  onRecordScore
}) => {
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const currentLevel = WORD_SEARCH_LEVELS.find(l => l.id === currentLevelId) || WORD_SEARCH_LEVELS[0];

  const [foundWordIds, setFoundWordIds] = useState<string[]>([]);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [firstTapCell, setFirstTapCell] = useState<[number, number] | null>(null);
  const [dragStartCell, setDragStartCell] = useState<[number, number] | null>(null);
  const [pulsingCell, setPulsingCell] = useState<[number, number] | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [selectedWordDetail, setSelectedWordDetail] = useState<WordItem | null>(currentLevel.words[0]);

  const gridRef = useRef<HTMLDivElement>(null);

  // Switch level cleanly
  const handleSelectLevel = (levelId: number) => {
    soundEngine.playClick();
    setCurrentLevelId(levelId);
    setFoundWordIds([]);
    setSelectedCells([]);
    setFirstTapCell(null);
    setDragStartCell(null);
    setIsDragging(false);
    setPulsingCell(null);
    setTimerSeconds(0);
    setGameFinished(false);
    const target = WORD_SEARCH_LEVELS.find(l => l.id === levelId) || WORD_SEARCH_LEVELS[0];
    setSelectedWordDetail(target.words[0]);
  };

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
    if (foundWordIds.length === currentLevel.words.length && !gameFinished && currentLevel.words.length > 0) {
      setGameFinished(true);
      if (!completedLevels.includes(currentLevelId)) {
        setCompletedLevels(prev => [...prev, currentLevelId]);
      }
      soundEngine.playWordFound();
      setTimeout(() => {
        soundEngine.playComplete();
        soundEngine.playConfettiPop();
      }, 500);
      if (onRecordScore) {
        onRecordScore(100);
      }
    }
  }, [foundWordIds, gameFinished, currentLevel.words.length, currentLevelId, completedLevels, onRecordScore]);

  // Check if cell is in any found word
  const getCellFoundColor = (r: number, c: number): string | null => {
    for (const id of foundWordIds) {
      const item = currentLevel.words.find(w => w.id === id);
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
      return r === sr && c >= Math.min(sc, ec) && c <= Math.max(sc, ec);
    }
    if (sc === ec) {
      return c === sc && r >= Math.min(sr, er) && r <= Math.max(sr, er);
    }
    return false;
  };

  const isCellSelected = (r: number, c: number): boolean => {
    return selectedCells.some(([sr, sc]) => sr === r && sc === c);
  };

  const getLineCells = (start: [number, number], end: [number, number]): [number, number][] => {
    const [r1, c1] = start;
    const [r2, c2] = end;
    const cells: [number, number][] = [];

    if (r1 === r2) {
      const step = c2 >= c1 ? 1 : -1;
      for (let c = c1; c !== c2 + step; c += step) {
        cells.push([r1, c]);
      }
      return cells;
    }

    if (c1 === c2) {
      const step = r2 >= r1 ? 1 : -1;
      for (let r = r1; r !== r2 + step; r += step) {
        cells.push([r, c1]);
      }
      return cells;
    }

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

  const tryMatchWord = (cells: [number, number][]): boolean => {
    if (cells.length < 3) return false;
    const selectedString = cells.map(([r, c]) => currentLevel.grid[r][c]).join('');
    const reversedString = selectedString.split('').reverse().join('');

    let matchedWord: WordItem | null = null;
    for (const w of currentLevel.words) {
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

  const handleCellClickOrTap = (r: number, c: number) => {
    soundEngine.playLetterSelect(0);

    if (!firstTapCell) {
      setFirstTapCell([r, c]);
      setSelectedCells([[r, c]]);
      return;
    }

    if (firstTapCell[0] === r && firstTapCell[1] === c) {
      setFirstTapCell(null);
      setSelectedCells([]);
      return;
    }

    const line = getLineCells(firstTapCell, [r, c]);
    setSelectedCells(line);

    const isMatch = tryMatchWord(line);
    if (!isMatch) {
      soundEngine.playClick();
      setTimeout(() => {
        setSelectedCells([]);
        setFirstTapCell(null);
      }, 400);
    }
  };

  const handlePointerDown = (r: number, c: number) => {
    setIsDragging(true);
    setDragStartCell([r, c]);
    setSelectedCells([[r, c]]);
  };

  const handlePointerEnter = (r: number, c: number) => {
    if (!isDragging || !dragStartCell) return;
    const line = getLineCells(dragStartCell, [r, c]);
    if (line.length !== selectedCells.length) {
      soundEngine.playLetterSelect(line.length);
    }
    setSelectedCells(line);
  };

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
      const [r, c] = selectedCells[0];
      handleCellClickOrTap(r, c);
      return;
    }
    setDragStartCell(null);
  };

  const handleUseHint = () => {
    const remaining = currentLevel.words.filter(w => !foundWordIds.includes(w.id));
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
    setSelectedWordDetail(currentLevel.words[0]);
  };

  const handleNextLevel = () => {
    if (currentLevelId < WORD_SEARCH_LEVELS.length) {
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
                EDUCAPLAY STYLE • 3 SOPAS DE LETRAS
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0052cc] dark:text-sky-300 text-[10px] font-bold">
                {currentLevel.difficulty}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              Sopa de Letras: {currentLevel.title}
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
            <span>{foundWordIds.length}/{currentLevel.words.length} Encontradas</span>
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

      {/* 3 SOPAS DE LETRAS TABS SELECTOR */}
      <div className="bg-slate-100 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-1.5">
        {WORD_SEARCH_LEVELS.map((lvl) => {
          const isActive = lvl.id === currentLevelId;
          const isDone = completedLevels.includes(lvl.id);

          return (
            <button
              key={lvl.id}
              type="button"
              onClick={() => handleSelectLevel(lvl.id)}
              className={`p-3 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-[#0052cc] dark:text-[#00AFFF] shadow-sm font-black border border-blue-200 dark:border-blue-900/60'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                  isActive 
                    ? 'bg-[#0052cc] text-white' 
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
                    {lvl.difficulty} • 10 Palabras
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
            {currentLevel.grid.map((row, r) =>
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
                <span>Palabras por Encontrar ({currentLevel.words.length})</span>
              </h3>
              <span className="text-[11px] font-bold text-slate-400">
                Toca para ver pista
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {currentLevel.words.map((item) => {
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
                  {currentLevel.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Has descubierto las {currentLevel.words.length} palabras de este nivel en{' '}
                  <span className="font-bold text-[#0052cc] dark:text-[#00AFFF]">{formatTimer(timerSeconds)}</span>.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
                <div>
                  <span className="text-xs text-slate-400">Puntaje</span>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">100 Pts</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Progreso Sopas</span>
                  <p className="text-xl font-black text-slate-800 dark:text-white">
                    {completedLevels.length} de {WORD_SEARCH_LEVELS.length}
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
                {currentLevelId < WORD_SEARCH_LEVELS.length ? (
                  <button
                    type="button"
                    onClick={handleNextLevel}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#0052cc] hover:bg-[#0047b3] text-white font-bold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
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
