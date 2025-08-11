
/**
 * Minimal oscillator-based audio engine for SFX.
 *
 * Architecture:
 * - Uses the Web Audio API with a lazily created AudioContext.
 * - Produces simple tones via OscillatorNode + GainNode envelope.
 * - Public API is stable (unlock, play), allowing a later switch to more advanced synthesis without touching call sites.
 *
 * Notes:
 * - unlock() should be called in response to a user gesture to satisfy autoplay policies.
 * - play(name) maps UX events (hover/click/feedback) to short tones.
 */


export type SoundName = "hover" | "unhover" | "click" | "feedback" | "minor" | "major";


export class AudioEngine {
  private ctx: AudioContext | null = null;


  // Map SoundName to sample file (relative to public/)

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




  /**
   * Play a simple oscillator-based SFX (sine/triangle, no noise, no sample).
   */
  private playSfx({
    freq,
    durationMs,
    type = "sine",
    gainPeak = 0.09,
  }: {
    freq: number;
    durationMs: number;
    type?: OscillatorType;
    gainPeak?: number;
  }) {
    this.ensureContext();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const endTime = now + durationMs / 1000;

    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0, now);
    gain.gain.linearRampToValueAtTime(gainPeak, now + 0.012);
    gain.gain.linearRampToValueAtTime(0.0, endTime);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(endTime);
    osc.onended = () => {
      gain.disconnect();
    };
  }

  play(name: SoundName) {
    // Simple, classic oscillator SFX at higher pitch
    switch (name) {
      case "hover":
        this.playSfx({
          freq: 1400,
          durationMs: 38,
          type: "sine",
          gainPeak: 0.09,
        });
        break;
      case "unhover":
        this.playSfx({
          freq: 1200,
          durationMs: 28,
          type: "sine",
          gainPeak: 0.07,
        });
        break;
      case "click":
        this.playSfx({
          freq: 1600,
          durationMs: 44,
          type: "triangle",
          gainPeak: 0.11,
        });
        break;
      case "minor":
        this.playSfx({
          freq: 1350,
          durationMs: 32,
          type: "triangle",
          gainPeak: 0.08,
        });
        break;
      case "major":
        this.playSfx({
          freq: 1700,
          durationMs: 60,
          type: "triangle",
          gainPeak: 0.13,
        });
        break;
      case "feedback":
        this.playSfx({
          freq: 1800,
          durationMs: 70,
          type: "triangle",
          gainPeak: 0.12,
        });
        break;
      default:
        this.playSfx({
          freq: 1400,
          durationMs: 36,
          type: "sine",
          gainPeak: 0.08,
        });
    }
  }
}

export const audioEngine = new AudioEngine();
