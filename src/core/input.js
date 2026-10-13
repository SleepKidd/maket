export class InputManager {
  constructor({ onChange }) {
    this.onChange = onChange;
    this.state = { x: 0, y: 0, down: false, velocity: 0 };
    this.pending = null;
    this.lastX = 0;
    this.lastY = 0;
    this.lastTime = performance.now();
    this.pointerFine = matchMedia("(pointer: fine)").matches;
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    window.addEventListener("pointermove", this.handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", this.handlePointerDown, { passive: true });
    window.addEventListener("pointerup", this.handlePointerUp, { passive: true });
  }

  handlePointerMove(event) {
    if (!this.pointerFine && event.pointerType === "mouse") return;
    this.pending = { clientX: event.clientX, clientY: event.clientY, time: performance.now() };
  }

  handlePointerDown(event) { this.state.down = true; this.pending = { clientX: event.clientX, clientY: event.clientY, time: performance.now() }; }
  handlePointerUp() { this.state.down = false; }

  update() {
    if (!this.pending) return this.state;
    const { clientX, clientY, time } = this.pending;
    const dt = Math.max(16, time - this.lastTime);
    const vx = (clientX - this.lastX) / dt;
    const vy = (clientY - this.lastY) / dt;
    this.state.x += ((clientX / Math.max(1, window.innerWidth) - .5) * 2 - this.state.x) * .16;
    this.state.y += ((clientY / Math.max(1, window.innerHeight) - .5) * 2 - this.state.y) * .16;
    this.state.velocity = Math.min(1, Math.hypot(vx, vy) * 8);
    this.lastX = clientX; this.lastY = clientY; this.lastTime = time; this.pending = null;
    this.onChange(this.state);
    return this.state;
  }

  async requestTilt() {
    if (!("DeviceOrientationEvent" in window)) return false;
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      try { return (await DeviceOrientationEvent.requestPermission()) === "granted"; } catch { return false; }
    }
    return true;
  }

  enableTilt() {
    window.addEventListener("deviceorientation", (event) => {
      if (event.gamma == null) return;
      this.state.x += ((Math.max(-1, Math.min(1, event.gamma / 28))) - this.state.x) * .08;
      this.state.y += ((Math.max(-1, Math.min(1, (event.beta - 45) / 28))) - this.state.y) * .08;
      this.onChange(this.state);
    }, { passive: true, once: false });
  }

  destroy() {
    window.removeEventListener("pointermove", this.handlePointerMove);
    window.removeEventListener("pointerdown", this.handlePointerDown);
    window.removeEventListener("pointerup", this.handlePointerUp);
  }
}
