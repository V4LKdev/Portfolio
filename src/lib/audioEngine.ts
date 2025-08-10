/**
 * audioEngine.ts
 *
 * Centralized AudioContext + master gain controller for SFX only.
 * Simple unlock and volume control without fades.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private unlocked = false;

  private ensureContext() {
    if (!this.ctx) {
      const Ctor: typeof AudioContext =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!Ctor) throw new Error("Web Audio not supported");
      this.ctx = new Ctor();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0; // start silent until unlock
      this.masterGain.connect(this.ctx.destination);
    }
  }

  getContext(): AudioContext {
    this.ensureContext();
    return this.ctx!;
  }

  getMasterGain(): GainNode {
    this.ensureContext();
    return this.masterGain!;
  }

  isUnlocked() {
    return this.unlocked;
  }

  async unlock() {
    try {
      this.ensureContext();
      if (!this.ctx) return;
      if (this.unlocked && this.ctx.state === "running") return;
      await this.ctx.resume();
      this.unlocked = true;
    } catch {
      // ignore
    }
  }

  setMasterVolume(volume: number) {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.getMasterGain().gain.setValueAtTime(volume, now);
  }
}

export const audioEngine = new AudioEngine();
