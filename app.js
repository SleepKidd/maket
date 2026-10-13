import { RELATIONSHIP, SCENES, SECRETS, MESSAGE_SLOTS, PLACE_SLOTS } from "./src/data/story.js";
import { QualityManager, Scheduler } from "./src/core/quality.js";
import { InputManager } from "./src/core/input.js";
import { AudioManager } from "./src/core/audio.js";
import { createBotanicalWorld } from "./src/webgl/world.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const esc = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character]));

const PHOTO_LABELS = {
  "before-us": "до отношений",
  beginning: "самое начало",
  "one-month": "первый месяц",
  "three-months": "три месяца",
  "half-year": "полгода",
  everyday: "обычный день",
  places: "наше место",
  "first-year": "первый год",
  "second-year": "второй год",
  milana: "портрет Миланы",
  us: "наш мир",
  finale: "финал",
};

function photoSlot(item, className = "") {
  const ratio = item.ratio || "4 / 5";
  const category = PHOTO_LABELS[item.category] || item.category || "фотография";
  return `<article class="photo-slot ${className}" style="--ratio:${ratio}" data-photo-slot data-category="${esc(item.category)}" tabindex="0" role="img" aria-label="${esc(item.label)}"><span class="slot-label">${esc(item.label)}</span><span class="slot-meta">${esc(category)}</span></article>`;
}

function photoSlots(items = [], className = "") { return items.map((item) => photoSlot(item, className)).join(""); }

function sceneKicker(scene, right = "") {
  return `<div class="scene-kicker"><span>${esc(scene.chapter || scene.kicker || "MILANA")}</span><span>${esc(right || scene.id.replaceAll("-", " "))}</span></div>`;
}

function sceneCopy(scene, className = "") {
  return `<div class="scene-copy ${className}"><p class="eyebrow">${esc(scene.kicker || scene.chapter || "История")}</p><h2>${esc(scene.title || "")} ${scene.accent ? `<br><em>${esc(scene.accent)}</em>` : ""}</h2>${scene.copy ? `<p>${esc(scene.copy)}</p>` : ""}</div>`;
}

function renderScene(scene) {
  const common = `class="scene ${scene.kind}-scene scene--${scene.id}" id="${scene.id}" data-scene="${scene.id}" data-stage="${scene.stage}" data-index="${scene.index}"`;
  switch (scene.kind) {
    case "prologue":
      return `<section ${common}><div class="hero-copy"><p class="eyebrow">${esc(scene.kicker)}</p><h1 class="hero-title">MILANA<span>— TWO YEARS</span></h1><p class="hero-date">${RELATIONSHIP.startDate}<i>—</i>${RELATIONSHIP.anniversaryDate}</p><p class="hero-days">${RELATIONSHIP.days} DAYS</p><button class="begin-button" id="beginButton" type="button"><span class="button-dot"></span><span>Коснись, чтобы начать</span><span class="button-arrow">↘</span></button><p class="hero-hint">Музыка, свет и живое пространство включатся после касания</p></div><div class="hero-index">01<span>из двух лет</span></div><p class="scene-note">листай историю</p></section>`;
    case "before":
      return `<section ${common}>${sceneKicker(scene, "Когда ещё не было «нас»")}${sceneCopy(scene)}<div class="photo-row">${photoSlots(scene.slots)}</div><p class="scene-note">Расстояние исчезает во время scroll — drag не обязателен</p></section>`;
    case "date":
      return `<section ${common}>${sceneKicker(scene, "начало") }<div class="scene-copy scene-copy--center"><p class="eyebrow">${esc(scene.kicker || scene.chapter || "Тот самый день")}</p><div class="date-number">18<span>.</span>11<span>.</span>24</div><p>${esc(scene.copy)}</p><button class="memory-trigger" type="button" data-secret="${esc(SECRETS[0].text)}">открыть воспоминание ↗</button></div>${photoSlot({ label: "ваше первое важное фото", category: "beginning", ratio: "4 / 5" }, "date-photo")}<p class="scene-note">Дата остаётся в центре, а личный текст появится после архива</p></section>`;
    case "tunnel":
      return `<section ${common}>${sceneKicker(scene, "вертикальный photo tunnel")}${sceneCopy(scene)}<div class="tunnel">${photoSlots(scene.slots)}</div></section>`;
    case "film":
      return `<section ${common}>${sceneKicker(scene, "curved film strip")}${sceneCopy(scene)}<div class="film-track" data-film-track>${photoSlots(scene.slots, "film-frame")}</div><p class="scene-note">Свайп по плёнке работает отдельно от native scroll</p></section>`;
    case "month":
      return `<section ${common}>${sceneKicker(scene, "30 DAYS") }<div class="ghost-number">30</div>${sceneCopy(scene, "month-copy")}<div class="polaroid-stack" data-polaroid-stack>${scene.slots.map((item) => `<div class="polaroid">${photoSlot(item)}</div>`).join("")}</div><button class="inline-action" data-desk-hint type="button">↔ &nbsp; сдвинь верхний кадр</button></section>`;
    case "glass":
      return `<section ${common}>${sceneKicker(scene, "glass / liquid light")}${sceneCopy(scene)}<div class="glass-card"><div class="glass-highlight"></div>${photoSlot(scene.slots?.[0] || { label: "фотография периода", category: "second-year" })}</div><div class="photo-row glass-small-row">${photoSlots((scene.slots || []).slice(1, 4))}</div></section>`;
    case "desk":
      return `<section ${common}>${sceneKicker(scene, "интерактивный стол")}${sceneCopy(scene)}<div class="desk" data-desk><div class="desk-note">«здесь будет ваша<br>настоящая записка»</div><div class="desk-ticket">18<br><small>NOV</small></div>${photoSlot({ label: "перетащи меня", category: "objects", ratio: "4 / 5" }, "desk-photo")}<div class="desk-photo-under">${photoSlot({ label: "что было под ним", category: "objects" })}</div><div class="desk-object">✳</div></div><p class="scene-note">Небольшой drag — не игровая механика, а ощущение настоящего предмета</p></section>`;
    case "gallery":
      return `<section ${common}>${sceneKicker(scene, "без пафоса")}${sceneCopy(scene)}<div class="gallery-grid">${photoSlots(scene.slots)}</div></section>`;
    case "timeline":
      return `<section ${common}>${sceneKicker(scene, "растущая ветвь")}${sceneCopy(scene, "timeline-copy")}<div class="plant-timeline"><div class="plant-stem"></div>${["1 месяц", "3 месяца", "6 месяцев", "1 год", "2 года"].map((label) => `<div class="timeline-node"><span>${label}</span></div>`).join("")}</div><p class="scene-note">Ветка растёт вместе с прогрессом истории</p></section>`;
    case "number":
      return `<section ${common}>${sceneKicker(scene, scene.number === "730" ? "полное цветение" : "первый bloom")}<div class="number-ghost">${scene.number}</div>${sceneCopy(scene, "number-copy")}${scene.slots?.length ? photoSlot(scene.slots[0], "number-photo") : ""}</section>`;
    case "places":
      return `<section ${common}>${sceneKicker(scene, "5–10 точек")}${sceneCopy(scene)}<div class="memory-map" data-map><div class="map-route"></div>${PLACE_SLOTS.map((place, index) => `<button class="map-pin" type="button" data-place="${esc(place)}" aria-label="Открыть ${esc(place)}">0${index + 1}</button>`).join("")}<div class="map-label">ваша карта<br><span>реальные места добавим из архива</span></div></div><div class="place-popover" data-place-popover><button class="close-popover" type="button" aria-label="Закрыть">×</button><span class="eyebrow">точка маршрута</span><p data-place-text>—</p></div></section>`;
    case "messages":
      return `<section ${common}>${sceneKicker(scene, "editorial messages")}${sceneCopy(scene)}<div class="message-backdrop"></div><div class="chat-stack"><span class="chat-time">реальная дата / время</span>${MESSAGE_SLOTS.slice(0, 4).map((text, index) => `<div class="chat-bubble ${index % 2 ? "chat-bubble--me" : "chat-bubble--her"}">${esc(text)}</div>`).join("")}<span class="chat-time">фрагменты добавятся после загрузки переписки</span></div><button class="memory-trigger secret-note" type="button" data-secret="${esc(SECRETS[6].text)}">это я никогда тебе не говорил…</button></section>`;
    case "gallery-stage":
      return `<section ${common}>${sceneKicker(scene, "visual rhythm")}${sceneCopy(scene)}<div class="stage-gallery">${photoSlot(scene.slots[0], "stage-large")}${photoSlot(scene.slots[1], "stage-small")}${photoSlot(scene.slots[2], "stage-small")}${photoSlot(scene.slots[3], "stage-wide")}<div class="video-slot" data-video-slot><span class="play-mark">▶</span></div></div></section>`;
    case "events":
      return `<section ${common}>${sceneKicker(scene, "6–10 событий")}${sceneCopy(scene)}<div class="event-stack">${scene.slots.map((item, index) => `<article class="event-row" data-secret="${esc(SECRETS[index % SECRETS.length].text)}"><span>0${index + 1}</span><strong>${esc(item.label)}</strong><em>дата / история</em><b>↗</b></article>`).join("")}</div></section>`;
    case "silk":
      return `<section ${common}>${sceneKicker(scene, "silk / portrait")}${sceneCopy(scene)}<div class="silk-field"></div><div class="portrait-stack">${photoSlots(scene.slots)}</div></section>`;
    case "love":
      return `<section ${common}>${sceneKicker(scene, "10–15 мыслей")}${sceneCopy(scene)}<div class="love-list">${scene.statements.map((statement, index) => `<span class="love-line love-line-${index}">${esc(statement)}</span>`).join("")}</div><p class="scene-note">Настоящие формулировки появятся из твоих фактов, а не из шаблона</p></section>`;
    case "universe":
      return `<section ${common}>${sceneKicker(scene, "our universe")}${sceneCopy(scene)}<div class="universe-corridor">${photoSlots(scene.slots)}</div></section>`;
    case "compare":
      return `<section ${common}>${sceneKicker(scene, "touch slider")}${sceneCopy(scene)}<div class="compare-frame" data-compare><div class="compare-image compare-image--then">${photoSlot({ label: "самая ранняя совместная", category: "then-now" })}</div><div class="compare-image compare-image--now">${photoSlot({ label: "одна из последних", category: "then-now" })}</div><div class="compare-divider" data-compare-divider tabindex="0" role="slider" aria-label="Сравнить тогда и сейчас" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"><span>↔</span></div></div><div class="compare-caption"><span>тогда</span><strong>730 DAYS</strong><span>сейчас</span></div></section>`;
    case "voice":
      return `<section ${common}>${sceneKicker(scene, "тишина")}${sceneCopy(scene)}<button class="voice-button" id="voiceButton" type="button"><span>▶</span> включить голосовое</button><div class="voice-wave" data-voice-wave>${Array.from({ length: 15 }, () => "<i></i>").join("")}</div></section>`;
    case "letter":
      return `<section ${common}>${sceneKicker(scene, "700–1500 слов")}<div class="letter-wrap"><p class="eyebrow">${esc(scene.kicker)}</p><h2>${esc(scene.title)}</h2><p class="letter-copy">Здесь будет настоящее письмо — не выдуманный текст из генератора, а твои слова: факты, смешные детали, неловкие моменты и всё то, что за два года стало вашим.</p><p class="letter-copy">Когда появится архив, этот экран превратится в длинный спокойный монолог с максимальной читаемостью и почти полной тишиной вокруг.</p><div class="letter-sign">Я люблю тебя.<br><span>И это только первые два года.</span></div><button class="replay-button" id="replayButton" type="button">↻ replay <span>${RELATIONSHIP.startDate} — ∞</span></button></div></section>`;
    case "finale":
      return `<section ${common}>${sceneKicker(scene, "полное цветение")}<div class="finale-number">${RELATIONSHIP.days}</div><p class="finale-subtitle">дней с тобой</p>${photoSlot({ label: "свежая совместная фотография", category: "finale" }, "finale-photo")}<div class="finale-line"><span>Два года.</span><strong>${esc(scene.title)}</strong><small>${esc(scene.accent)}</small></div></section>`;
    case "secret":
      return `<section ${common}>${sceneKicker(scene, "секретный эпилог")}<div class="scene-copy scene-copy--center"><p class="eyebrow">${esc(scene.kicker)}</p><h2>${esc(scene.title)}<br><em>${esc(scene.accent)}</em></h2><p>${esc(scene.copy)}</p><p class="secret-count" data-secret-count>0 / ${SECRETS.length} найдено</p></div></section>`;
    default:
      return `<section ${common}>${sceneCopy(scene)}</section>`;
  }
}

function renderStory() { $("#story").innerHTML = SCENES.map(renderScene).join(""); }

class SceneManager {
  constructor({ world }) {
    this.world = world;
    this.sections = $$(".scene");
    this.current = null;
    this.observer = new IntersectionObserver((entries) => this.onIntersect(entries), { threshold: [0, .2, .55, .85], rootMargin: "100% 0px" });
    this.sections.forEach((section) => this.observer.observe(section));
  }

  onIntersect(entries) {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const scene = visible.target;
    if (scene === this.current) return;
    this.current = scene;
    const stage = Number(scene.dataset.stage || 0);
    $("#sceneIndex").textContent = scene.dataset.index || "00";
    document.body.dataset.scene = scene.dataset.scene || "prologue";
    this.world?.setScene(stage, scene.dataset.scene);
  }

  destroy() { this.observer.disconnect(); }
}

class AssetManager {
  constructor() {
    this.observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) this.hydrate(entry.target); }), { rootMargin: "180% 0px" });
    $$('[data-src]').forEach((element) => this.observer.observe(element));
  }

  hydrate(element) {
    const source = element.dataset.src;
    if (!source || element.dataset.loaded) return;
    element.dataset.loaded = "true";
    if (element.tagName === "IMG") { element.src = source; element.loading = "lazy"; element.decoding = "async"; }
    if (element.tagName === "VIDEO") { element.src = source; element.preload = "metadata"; }
    this.observer.unobserve(element);
  }
}

function setupInteractions({ audio, input }) {
  const toast = $("#toast");
  let toastTimer;
  const showToast = (message) => { toast.textContent = message; toast.classList.add("is-visible"); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2800); };
  const modal = $("#secretModal");
  const secretText = $("#secretText");
  const foundSecrets = new Set();
  const openSecret = (element, text) => {
    const id = element?.dataset.secretId || element?.dataset.category || element?.dataset.place || `secret-${foundSecrets.size}`;
    foundSecrets.add(id);
    secretText.textContent = text;
    modal.classList.add("is-visible");
    modal.setAttribute("aria-hidden", "false");
    $("[data-secret-count]").textContent = `${Math.min(foundSecrets.size, SECRETS.length)} / ${SECRETS.length} найдено`;
    if (navigator.vibrate) navigator.vibrate(8);
  };
  const closeSecret = () => { modal.classList.remove("is-visible"); modal.setAttribute("aria-hidden", "true"); };
  $(".close-modal").addEventListener("click", closeSecret);
  modal.addEventListener("click", (event) => { if (event.target === modal) closeSecret(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeSecret(); });

  $$('[data-secret]').forEach((element, index) => {
    element.dataset.secretId = SECRETS[index % SECRETS.length].id;
    element.addEventListener("click", () => openSecret(element, element.dataset.secret || SECRETS[index % SECRETS.length].text));
  });

  const beginButton = $("#beginButton");
  beginButton.addEventListener("click", async () => {
    document.body.classList.add("started");
    beginButton.textContent = "История началась ↘";
    beginButton.disabled = true;
    beginButton.setAttribute("aria-label", "История началась");
    const played = await audio.start();
    if (!played) showToast("Аудио-слот готов — добавим настоящий трек после получения файла");
    if (navigator.vibrate) navigator.vibrate(10);
    const tiltGranted = await input.requestTilt();
    if (tiltGranted) input.enableTilt();
  });

  $("#soundToggle").addEventListener("click", () => {
    const enabled = audio.toggle();
    $("#soundToggle").setAttribute("aria-pressed", String(enabled));
    $("#soundLabel").textContent = enabled ? "вкл" : "выкл";
    if (!audio.music) showToast("Музыка будет подключена из assets/audio/relationship.mp3");
  });

  const placePopover = $("[data-place-popover]");
  $$('[data-place]').forEach((pin) => pin.addEventListener("click", () => { $("[data-place-text]").textContent = pin.dataset.place; placePopover.classList.add("is-visible"); }));
  $(".close-popover")?.addEventListener("click", () => placePopover.classList.remove("is-visible"));

  const film = $("[data-film-track]");
  if (film) {
    let startX = 0;
    let shift = 0;
    film.addEventListener("pointerdown", (event) => { startX = event.clientX; film.setPointerCapture(event.pointerId); });
    film.addEventListener("pointermove", (event) => { if (!film.hasPointerCapture(event.pointerId)) return; shift = Math.max(-100, Math.min(100, event.clientX - startX)); film.style.setProperty("--film-shift", `${shift}px`); });
    film.addEventListener("pointerup", (event) => { film.releasePointerCapture?.(event.pointerId); film.style.setProperty("--film-shift", "0px"); });
  }

  const deskPhoto = $(".desk-photo");
  if (deskPhoto) {
    let startX = 0;
    deskPhoto.addEventListener("pointerdown", (event) => { startX = event.clientX; deskPhoto.setPointerCapture(event.pointerId); });
    deskPhoto.addEventListener("pointermove", (event) => { if (!deskPhoto.hasPointerCapture(event.pointerId)) return; const delta = Math.max(-95, Math.min(95, event.clientX - startX)); deskPhoto.style.setProperty("--desk-shift", `${delta}px`); });
    deskPhoto.addEventListener("pointerup", (event) => { deskPhoto.releasePointerCapture?.(event.pointerId); deskPhoto.style.setProperty("--desk-shift", "0px"); });
  }

  const compare = $("[data-compare]");
  const divider = $("[data-compare-divider]");
  if (compare && divider) {
    let rect = null;
    let active = false;
    const moveCompare = (clientX) => { if (!rect) return; const percentage = Math.max(7, Math.min(93, ((clientX - rect.left) / rect.width) * 100)); divider.style.left = `${percentage}%`; compare.style.setProperty("--compare", `${percentage}%`); divider.setAttribute("aria-valuenow", String(Math.round(percentage))); };
    divider.addEventListener("pointerdown", (event) => { rect = compare.getBoundingClientRect(); active = true; divider.setPointerCapture(event.pointerId); moveCompare(event.clientX); });
    divider.addEventListener("pointermove", (event) => { if (active) moveCompare(event.clientX); });
    divider.addEventListener("pointerup", () => { active = false; rect = null; });
    divider.addEventListener("keydown", (event) => { if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return; event.preventDefault(); const current = Number(divider.getAttribute("aria-valuenow")); moveCompare((current + (event.key === "ArrowRight" ? 5 : -5)) / 100 * compare.getBoundingClientRect().width + compare.getBoundingClientRect().left); });
  }

  $("#voiceButton")?.addEventListener("click", async () => { const played = await audio.playVoice(); $("[data-voice-wave]").classList.toggle("is-playing", played); if (!played) showToast("Голосовое будет подключено из assets/audio/voice-note.mp3"); });
  $("#replayButton")?.addEventListener("click", () => { window.scrollTo(0, 0); document.body.classList.remove("started"); $("#beginButton").disabled = false; $("#beginButton").textContent = "Коснись, чтобы начать"; foundSecrets.clear(); $("[data-secret-count]").textContent = `0 / ${SECRETS.length} найдено`; });

  const cardRects = new WeakMap();
  $$('[data-photo-slot]').forEach((card) => {
    const reset = () => { card.style.setProperty("--tiltX", "0deg"); card.style.setProperty("--tiltY", "0deg"); cardRects.delete(card); };
    card.addEventListener("pointerenter", () => cardRects.set(card, card.getBoundingClientRect()), { passive: true });
    card.addEventListener("pointerdown", () => cardRects.set(card, card.getBoundingClientRect()), { passive: true });
    card.addEventListener("pointermove", (event) => { const rect = cardRects.get(card); if (!rect) return; const x = ((event.clientX - rect.left) / rect.width - .5) * 6; const y = ((event.clientY - rect.top) / rect.height - .5) * -6; card.style.setProperty("--tiltX", `${x}deg`); card.style.setProperty("--tiltY", `${y}deg`); });
    card.addEventListener("pointerleave", reset, { passive: true });
    card.addEventListener("blur", reset, { passive: true });
  });

  return { showToast };
}

function setupResize(world) {
  let raf = 0;
  let timer = 0;
  let lastWidth = window.innerWidth;
  const schedule = () => { cancelAnimationFrame(raf); clearTimeout(timer); timer = setTimeout(() => { raf = requestAnimationFrame(() => { const width = window.innerWidth; if (Math.abs(width - lastWidth) > 1) { lastWidth = width; world?.resize(); } }); }, 100); };
  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener("orientationchange", () => { clearTimeout(timer); timer = setTimeout(() => { lastWidth = window.innerWidth; world?.resize(); }, 180); }, { passive: true });
}

function setupDebug({ quality, world }) {
  if (!new URLSearchParams(location.search).has("debug")) return () => {};
  const overlay = $("#devOverlay"); overlay.hidden = false;
  let frames = 0; let last = performance.now(); let fps = 0;
  return (now) => { frames += 1; if (now - last > 500) { fps = Math.round(frames * 1000 / (now - last)); frames = 0; last = now; const stats = world?.stats?.() || {}; overlay.textContent = `FPS ${fps} · ${quality.getName()} · calls ${stats.drawCalls || 0} · tris ${stats.triangles || 0}`; } };
}

function boot() {
  renderStory();
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) document.body.classList.add("is-reduced-motion");
  const quality = new QualityManager();
  let world = null;
  try { world = createBotanicalWorld($("#world"), { ...quality.get(), profile: quality.profile }); } catch (error) { console.warn("WebGL fallback:", error); }
  if (!world) document.body.classList.add("is-fallback");
  const input = new InputManager({ onChange: (state) => world?.setPointer(state.x, state.y, state.velocity) });
  const audio = new AudioManager();
  const sceneManager = new SceneManager({ world });
  new AssetManager();
  const { showToast } = setupInteractions({ audio, input });
  setupResize(world);
  const updateDebug = setupDebug({ quality, world });
  const scheduler = new Scheduler({ quality, onFrame: (now, delta) => { input.update(); world?.update(now, delta); updateDebug(now); } });
  scheduler.start();
  window.addEventListener("pagehide", () => { scheduler.stop(); sceneManager.destroy(); input.destroy(); audio.destroy(); world?.dispose(); }, { once: true, passive: true });
  if (!world) showToast("3D отключён браузером — включена лёгкая botanical fallback-сцена");
  window.__MILANA_DEBUG__ = { quality, world, scheduler, sceneManager };
}

boot();
