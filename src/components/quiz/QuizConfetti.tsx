import React from 'react';
import { motion } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  shape: 'circle' | 'square' | 'rect';
}

const COLORS = [
  '#0052cc', '#00AFFF', '#00FF88', '#FF6B00', '#F59E0B', '#EC4899', '#8B5CF6'
];

export const QuizConfetti: React.FC = () => {
  const particles: Particle[] = React.useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 500,
      y: -Math.random() * 350 - 50,
      rotation: Math.random() * 720 - 360,
      scale: Math.random() * 0.7 + 0.6,
      color: COLORS[i % COLORS.length],
      shape: i % 3 === 0 ? 'circle' : i % 3 === 1 ? 'square' : 'rect'
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30 flex items-center justify-center">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            x: 0,
            y: 0,
            scale: 0,
            opacity: 1,
            rotate: 0
          }}
          animate={{
            x: p.x,
            y: [p.y * 0.5, p.y, p.y + 180],
            scale: p.scale,
            opacity: [1, 1, 0],
            rotate: p.rotation
          }}
          transition={{
            duration: 2.2,
            ease: [0.25, 1, 0.5, 1],
            delay: Math.random() * 0.2
          }}
          style={{
            backgroundColor: p.color,
            width: p.shape === 'rect' ? 14 : p.shape === 'circle' ? 10 : 8,
            height: p.shape === 'rect' ? 7 : p.shape === 'circle' ? 10 : 8,
            borderRadius: p.shape === 'circle' ? '50%' : 2
          }}
          className="absolute"
        />
      ))}
    </div>
  );
};
