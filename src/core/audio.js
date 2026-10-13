export class AudioManager {
  constructor({ musicSrc = null, voiceSrc = null, sfx = {} } = {}) {
    this.master = 1;
    this.enabled = localStorage.getItem("milana-sound") !== "off";
    this.music = this.createAudio(musicSrc, true);
    this.voice = this.createAudio(voiceSrc, false);
    this.sfx = Object.fromEntries(Object.entries(sfx).map(([key, value]) => [key, this.createAudio(value, false)]));
    if (this.music) this.music.volume = .23;
    if (this.voice) this.voice.volume = .72;
  }

  createAudio(src, loop) {
    if (!src) return null;
    const audio = new Audio(src);
    audio.preload = "metadata";
    audio.loop = loop;
    audio.setAttribute("playsinline", "true");
    return audio;
  }

  async start() {
    if (!this.enabled || !this.music) return false;
    try { await this.music.play(); return true; } catch { return false; }
  }

  toggle() {
    this.enabled = !this.enabled;
    this.master = this.enabled ? 1 : 0;
    localStorage.setItem("milana-sound", this.enabled ? "on" : "off");
    [this.music, this.voice, ...Object.values(this.sfx)].filter(Boolean).forEach((audio) => { audio.volume = this.master * (audio === this.music ? .23 : .72); });
    return this.enabled;
  }

  async playVoice() {
    if (!this.voice || !this.enabled) return false;
    try { await this.voice.play(); return true; } catch { return false; }
  }

  playSfx(name) {
    const audio = this.sfx[name];
    if (!audio || !this.enabled) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  destroy() { [this.music, this.voice, ...Object.values(this.sfx)].filter(Boolean).forEach((audio) => { audio.pause(); audio.src = ""; }); }
}
