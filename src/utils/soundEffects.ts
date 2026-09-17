/**
 * ViaNova Audio Subsystem - Disabled per user request
 * All audio playback and synthesizers are completely silenced.
 */

class SoundEngine {
  public isMuted(): boolean {
    return true;
  }

  public setMuted(_muted: boolean): void {}

  public toggleMute(): boolean {
    return true;
  }

  public playHover(): void {}
  public playClick(): void {}
  public playSuccess(): void {}
  public playVehicleAccelerate(): void {}
  public playTrafficBeep(_state: 'green' | 'yellow' | 'red'): void {}
}

export const soundEngine = new SoundEngine();
