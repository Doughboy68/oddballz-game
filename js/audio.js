/**
 * Audio.js - Web Audio API Synthesizer for Oddballz
 * Generates retro 16-bit sound effects based on Pascal ODDUNIT.PAS Freq array!
 */

export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.musicEnabled = false;
    this.freq = [25, 27, 28, 30, 32, 33, 35, 37, 39, 40, 42, 44, 45, 47, 49, 51, 52, 54, 56];
    this.audioStateBeforeFocusLoss = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  pauseForFocusLoss() {
    this.audioStateBeforeFocusLoss = {
      enabled: this.enabled,
      track: this.currentTrack,
      isPlaying: !!(this.bgAudio && !this.bgAudio.paused && !this.bgAudio._disposed)
    };

    if (this.bgAudio && !this.bgAudio._disposed) {
      try {
        this.bgAudio.pause();
      } catch (e) {}
    }
    if (this.ctx && this.ctx.state === 'running') {
      try {
        this.ctx.suspend();
      } catch (e) {}
    }
  }

  resumeFromFocusGain() {
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        this.ctx.resume();
      } catch (e) {}
    }

    if (!this.enabled || !this.audioStateBeforeFocusLoss) return;

    const { isPlaying, track } = this.audioStateBeforeFocusLoss;
    this.audioStateBeforeFocusLoss = null;

    if (isPlaying && track) {
      if (this.bgAudio && !this.bgAudio._disposed) {
        const playPromise = this.bgAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            if (typeof this.stopMidi === 'function') this.stopMidi();
            this.currentTrack = null;
          });
        }
      } else {
        this.currentTrack = null;
        if (typeof this.playMidiTrack === 'function') this.playMidiTrack(track);
      }
    }
  }

  playSound(type, param = 0) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    switch (type) {
      case 'click': {
        // Color cycle 'F' key click
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.04);
        break;
      }

      case 'drop': {
        // Hex gravity drop thud
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const fIndex = Math.min(Math.max(param, 0), this.freq.length - 1);
        const pitch = (this.freq[fIndex] || 30) * 12;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(pitch, now);
        osc.frequency.exponentialRampToValueAtTime(pitch * 0.5, now + 0.06);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.06);
        break;
      }

      case 'pop': {
        // Ball match pop
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.12);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
        break;
      }

      case 'zip': {
        // Hard drop sweep
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.linearRampToValueAtTime(150, now + 0.05);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }

      case 'levelup': {
        // Level up sweep fanfare matching Pascal 1 to 84 pitch loop
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(1200, now + 0.4);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.4);
        break;
      }

      case 'gameover': {
        // Game over descending tone matching Pascal 84 downto 1 pitch loop
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.6);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.6);
        break;
      }
    }
  }
}
