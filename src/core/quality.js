export class QualityManager {
  constructor() {
    const memory = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const width = window.innerWidth;
    const mobile = matchMedia("(pointer: coarse)").matches || width < 720;
    const weak = memory <= 2 || cores <= 4 || (mobile && dpr > 2.4);
    this.profile = weak ? "low" : (mobile || width < 1200 ? "medium" : "high");
    this.profiles = {
      high: { fps: 60, pixelRatio: Math.min(dpr, 1.65), flowers: 10, petals: 160, leaves: 52, shadows: true, glass: "soft" },
      medium: { fps: 45, pixelRatio: Math.min(dpr, 1.35), flowers: 7, petals: 95, leaves: 32, shadows: false, glass: "simple" },
      low: { fps: 30, pixelRatio: Math.min(dpr, 1.08), flowers: 5, petals: 52, leaves: 20, shadows: false, glass: "flat" },
    };
    this.current = this.profiles[this.profile];
    this.frameSamples = [];
  }

  get() { return this.current; }
  getName() { return this.profile.toUpperCase(); }

  recordFrame(delta) {
    if (delta <= 0 || delta > 200) return;
    this.frameSamples.push(delta);
    if (this.frameSamples.length > 45) this.frameSamples.shift();
    if (this.frameSamples.length === 45) {
      const average = this.frameSamples.reduce((sum, item) => sum + item, 0) / this.frameSamples.length;
      if (average > 31 && this.profile !== "low") this.setProfile("low");
      else if (average > 23 && this.profile === "high") this.setProfile("medium");
    }
  }

  setProfile(profile) {
    if (!this.profiles[profile] || profile === this.profile) return false;
    this.profile = profile;
    this.current = this.profiles[profile];
    return true;
  }
}

export class Scheduler {
  constructor({ quality, onFrame }) {
    this.quality = quality;
    this.onFrame = onFrame;
    this.running = false;
    this.hidden = document.hidden;
    this.last = 0;
    this.raf = 0;
    this.tick = this.tick.bind(this);
    document.addEventListener("visibilitychange", () => {
      this.hidden = document.hidden;
      if (this.hidden) this.stop(); else this.start();
    }, { passive: true });
  }

  start() { if (!this.running && !this.hidden) { this.running = true; this.raf = requestAnimationFrame(this.tick); } }
  stop() { this.running = false; cancelAnimationFrame(this.raf); }
  tick(now) {
    if (!this.running || this.hidden) return;
    const minDelta = 1000 / this.quality.get().fps;
    const delta = now - this.last;
    if (!this.last || delta >= minDelta) {
      this.last = now;
      this.quality.recordFrame(delta);
      this.onFrame(now, Math.min(delta / 1000, .1));
    }
    this.raf = requestAnimationFrame(this.tick);
  }
}
