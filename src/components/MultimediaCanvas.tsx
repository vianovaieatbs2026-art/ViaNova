import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glow: string;
  alpha: number;
  pulseSpeed: number;
}

interface GeometricShape {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  sides: number;
  color: string;
}

export const MultimediaCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Neon palette of ViaNova
    const palette = [
      { color: '#00AFFF', glow: 'rgba(0, 175, 255, 0.45)' }, // Electric Blue
      { color: '#00FF88', glow: 'rgba(0, 255, 136, 0.35)' }, // Neon Green
      { color: '#FF6B00', glow: 'rgba(255, 107, 0, 0.35)' },  // Alert Orange
      { color: '#38BDF8', glow: 'rgba(56, 189, 248, 0.3)' }   // Sky Light
    ];

    // Initialize particles
    const particleCount = Math.min(48, Math.max(22, Math.floor(width / 32)));
    const particles: Particle[] = Array.from({ length: particleCount }, () => {
      const pColor = palette[Math.floor(Math.random() * palette.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2.2 + 1.2,
        color: pColor.color,
        glow: pColor.glow,
        alpha: Math.random() * 0.6 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.01
      };
    });

    // Initialize floating geometric shapes
    const shapes: GeometricShape[] = [
      { x: width * 0.15, y: height * 0.25, size: 28, rotation: 0, rotationSpeed: 0.004, sides: 6, color: 'rgba(0, 175, 255, 0.18)' },
      { x: width * 0.85, y: height * 0.35, size: 34, rotation: 0.5, rotationSpeed: -0.003, sides: 4, color: 'rgba(0, 255, 136, 0.14)' },
      { x: width * 0.72, y: height * 0.82, size: 24, rotation: 1.2, rotationSpeed: 0.005, sides: 3, color: 'rgba(255, 107, 0, 0.16)' },
      { x: width * 0.28, y: height * 0.78, size: 30, rotation: 0.8, rotationSpeed: -0.004, sides: 6, color: 'rgba(0, 175, 255, 0.12)' },
    ];

    function drawPolygon(c: CanvasRenderingContext2D, x: number, y: number, radius: number, sides: number, rot: number, strokeColor: string) {
      c.save();
      c.translate(x, y);
      c.rotate(rot);
      c.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides;
        const px = radius * Math.cos(angle);
        const py = radius * Math.sin(angle);
        if (i === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.closePath();
      c.strokeStyle = strokeColor;
      c.lineWidth = 1.5;
      c.stroke();
      c.restore();
    }

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Render rotating geometric shapes
      shapes.forEach((s) => {
        s.rotation += s.rotationSpeed;
        drawPolygon(ctx, s.x, s.y, s.size, s.sides, s.rotation, s.color);
      });

      // Connect close particles with grid lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 135;

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 175, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const dynamicAlpha = p.alpha + Math.sin(tick * p.pulseSpeed) * 0.2;
        const clampedAlpha = Math.max(0.15, Math.min(0.9, dynamicAlpha));

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = clampedAlpha;
        ctx.shadowColor = p.glow;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none w-full h-full z-0 opacity-80"
    />
  );
};
