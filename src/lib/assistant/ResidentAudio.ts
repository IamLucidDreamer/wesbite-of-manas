export class ResidentAudio {
  context: AudioContext | null = null;
  enabled = true;

  init() {
    if (typeof window === 'undefined') return;
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
  }

  playPop() {
    if (!this.context || !this.enabled) return;
    try {
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.context.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.context.currentTime + 0.1);
      gain.gain.setValueAtTime(0.03, this.context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.context.destination);
      osc.start();
      osc.stop(this.context.currentTime + 0.1);
    } catch(e) {}
  }

  playStep() {
    if (!this.context || !this.enabled) return;
    try {
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, this.context.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.context.currentTime + 0.05);
      gain.gain.setValueAtTime(0.01, this.context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.context.destination);
      osc.start();
      osc.stop(this.context.currentTime + 0.05);
    } catch(e) {}
  }
  
  playCurious() {
    if (!this.context || !this.enabled) return;
    try {
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.context.currentTime);
      osc.frequency.linearRampToValueAtTime(600, this.context.currentTime + 0.15);
      gain.gain.setValueAtTime(0, this.context.currentTime);
      gain.gain.linearRampToValueAtTime(0.02, this.context.currentTime + 0.05);
      gain.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.context.destination);
      osc.start();
      osc.stop(this.context.currentTime + 0.15);
    } catch(e) {}
  }
}

export const residentAudio = new ResidentAudio();
