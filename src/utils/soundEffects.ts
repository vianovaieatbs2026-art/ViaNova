/**
 * ViaNova Interactive Web Audio Synthesis Subsystem
 * Uses the Web Audio API to generate pleasant, modern, low-latency UI sound effects
 * without needing external MP3/WAV assets.
 */

class SoundEngine {
  private audioCtx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    // Check localStorage preference
    try {
      const pref = localStorage.getItem('vianova_sound_muted');
      if (pref === 'true') {
        this.muted = true;
      }
    } catch (_) {}
  }

  private getContext(): AudioContext | null {
    if (this.muted) return null;
    if (typeof window === 'undefined') return null;

    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }

    return this.audioCtx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    try {
      localStorage.setItem('vianova_sound_muted', muted ? 'true' : 'false');
    } catch (_) {}
  }

  public toggleMute(): boolean {
    const next = !this.muted;
    this.setMuted(next);
    if (!next) {
      this.playClick();
    }
    return next;
  }

  /** Soft UI click / tap */
  public playClick(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (_) {}
  }

  /** Soft tick for timers */
  public playTick(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch (_) {}
  }

  /** Pleasant ascending chime for correct answer */
  public playSuccess(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.001, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.25);
      });
    } catch (_) {}
  }

  /** Gentle low double-thud for wrong answer */
  public playError(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [311.13, 261.63]; // Eb4, C4

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.1, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.16);
      });
    } catch (_) {}
  }

  /** Streak combo celebration sound */
  public playStreak(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.12, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.26);
      });
    } catch (_) {}
  }

  /** Game finished victory fanfare */
  public playComplete(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const fanfare = [
        { freq: 523.25, time: 0, dur: 0.15 },
        { freq: 523.25, time: 0.15, dur: 0.15 },
        { freq: 523.25, time: 0.3, dur: 0.15 },
        { freq: 659.25, time: 0.45, dur: 0.3 },
        { freq: 783.99, time: 0.75, dur: 0.2 },
        { freq: 1046.50, time: 0.95, dur: 0.5 }
      ];

      fanfare.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, now + n.time);

        gain.gain.setValueAtTime(0.001, now + n.time);
        gain.gain.linearRampToValueAtTime(0.12, now + n.time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur);
      });
    } catch (_) {}
  }

  public playHover(): void {
    this.playClick();
  }

  public playTrafficBeep(state: 'green' | 'yellow' | 'red'): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const freq = state === 'green' ? 880 : state === 'yellow' ? 660 : 440;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (_) {}
  }

  public playVehicleAccelerate(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (_) {}
  }
}

export const soundEngine = new SoundEngine();
