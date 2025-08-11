/**
 * Minimal oscillator-based audio engine for SFX.
 *
 * Architecture:
 * - Uses the Web Audio API with a lazily created AudioContext.
 * - Produces simple tones via OscillatorNode + GainNode envelope.
 * - Public API is stable (unlock, play), allowing a later switch to sample playback or
 *   more advanced synthesis without touching call sites.
 *
 * Notes:
 * - unlock() should be called in response to a user gesture to satisfy autoplay policies.
 * - play(name) maps UX events (hover/click/feedback) to short tones.
 */

export type SoundName = "hover" | "unhover" | "click" | "feedback" | "minor" | "major";

export class AudioEngine {
  private ctx: AudioContext | null = null;

  private ensureContext() {
    if (!this.ctx) {
      const w = window as unknown as {
        AudioContext?: typeof AudioContext;
        webkitAudioContext?: typeof AudioContext;
      };
      const Ctor = w.AudioContext || w.webkitAudioContext;
      if (!Ctor) return;
      this.ctx = new Ctor();
    }
  }

  async unlock() {
    this.ensureContext();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") {
      try {
        await this.ctx.resume();
      } catch {
        /* noop */
      }
    }
  }

  private playOsc(frequency: number, durationMs = 90, type: OscillatorType = "sine") {
    this.ensureContext();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;

    // Envelope: quick attack/decay
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.01);
    const endTime = now + durationMs / 1000;
    gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(endTime);
  }

  play(name: SoundName) {
    switch (name) {
      case "hover":
        this.playOsc(520, 70, "sine");
        break;
      case "unhover":
        this.playOsc(380, 60, "sine");
        break;
      case "click":
      case "minor":
        this.playOsc(660, 90, "triangle");
        break;
      case "major":
      case "feedback":
        this.playOsc(880, 120, "square");
        break;
      default:
        this.playOsc(600, 80, "sine");
    }
  }
}

export const audioEngine = new AudioEngine();
