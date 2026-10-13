import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

const canvas = document.querySelector("#world");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const world = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, .1, 100);
camera.position.set(0, 0.2, 8);
const clock = new THREE.Clock();
const ambient = new THREE.AmbientLight(0x8f6d44, 1.4);
const keyLight = new THREE.PointLight(0xe8bb72, 16, 18, 2);
keyLight.position.set(1.8, 2.7, 4.5);
const rimLight = new THREE.PointLight(0x7e3d2c, 10, 14, 2);
rimLight.position.set(-4, -2, 1);
world.add(ambient, keyLight, rimLight);

const flowerLayer = new THREE.Group();
const particleLayer = new THREE.Group();
world.add(flowerLayer, particleLayer);
const flowers = [];
const petals = [];
const isMobile = matchMedia("(max-width: 719px)").matches;
const quality = innerWidth < 390 ? "medium" : (innerWidth > 1000 ? "high" : "medium");

function material(color, roughness = .56, emissive = 0x000000) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: .05, emissive, emissiveIntensity: .45, side: THREE.DoubleSide });
}

function createFlower(index, position, scale = 1) {
  const root = new THREE.Group();
  root.position.set(...position);
  root.scale.setScalar(scale);
  const bloom = new THREE.Group();
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(.025, .045, 2.25, 7), material(0x5a6540, .9));
  stem.position.y = -1.05;
  root.add(stem);
  const petalMat = material(index % 2 ? 0xc5905f : 0xd6a78b, .48, index % 2 ? 0x2a1208 : 0x28110c);
  const coreMat = material(0xe4b75e, .36, 0x2b1605);
  const petalCount = 6 + (index % 3);
  for (let i = 0; i < petalCount; i += 1) {
    const a = (i / petalCount) * Math.PI * 2;
    const p = new THREE.Mesh(new THREE.SphereGeometry(.42, quality === "high" ? 12 : 8, quality === "high" ? 8 : 6), petalMat);
    p.scale.set(.55, 1.15, .18);
    p.position.set(Math.cos(a) * .3, Math.sin(a) * .23 + .03, Math.sin(a) * .2);
    p.rotation.set(.18, a * .2, a + Math.PI / 2);
    p.userData.baseRotation = p.rotation.z;
    bloom.add(p);
    petals.push({ mesh: p, base: p.position.clone(), phase: Math.random() * 7, strength: .04 + Math.random() * .05 });
  }
  const core = new THREE.Mesh(new THREE.SphereGeometry(.22, 12, 8), coreMat);
  core.position.z = .08;
  bloom.add(core);
  bloom.position.y = .18;
  root.add(bloom);
  root.userData = { bloom, baseY: position[1], phase: Math.random() * 6, index };
  flowerLayer.add(root);
  flowers.push(root);
}

const flowerCount = isMobile ? 5 : 8;
for (let i = 0; i < flowerCount; i += 1) {
  const side = i % 2 ? 1 : -1;
  createFlower(i, [side * (1.5 + (i % 3) * .85), -.4 + (i % 3) * .55, -1.1 - i * .34], .6 + (i % 3) * .12);
}

const particleCount = isMobile ? 120 : 240;
const particleGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i += 1) {
  particlePositions[i * 3] = (Math.random() - .5) * 12;
  particlePositions[i * 3 + 1] = (Math.random() - .5) * 10;
  particlePositions[i * 3 + 2] = (Math.random() - .5) * 8 - 1;
}
particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
const particleMaterial = new THREE.PointsMaterial({ color: 0xd8ab6b, size: isMobile ? .018 : .025, transparent: true, opacity: .68, depthWrite: false, blending: THREE.AdditiveBlending });
particleLayer.add(new THREE.Points(particleGeometry, particleMaterial));

const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
let sceneName = "hero";
let scrollProgress = 0;
let audioStarted = false;
let audioContext;
let drone;

function handlePointer(x, y) {
  pointer.targetX = (x / innerWidth - .5) * 2;
  pointer.targetY = (y / innerHeight - .5) * 2;
}
addEventListener("pointermove", (e) => handlePointer(e.clientX, e.clientY), { passive: true });
addEventListener("touchmove", (e) => { const t = e.touches[0]; if (t) handlePointer(t.clientX, t.clientY); }, { passive: true });
addEventListener("deviceorientation", (e) => { if (e.gamma == null) return; pointer.targetX = Math.max(-1, Math.min(1, e.gamma / 30)); pointer.targetY = Math.max(-1, Math.min(1, (e.beta - 45) / 30)); }, { passive: true });

function animate() {
  const t = clock.getElapsedTime();
  pointer.x += (pointer.targetX - pointer.x) * .045;
  pointer.y += (pointer.targetY - pointer.y) * .045;
  camera.position.x += (pointer.x * .55 - camera.position.x) * .022;
  camera.position.y += (-pointer.y * .32 + .15 - camera.position.y) * .022;
  camera.lookAt(0, .2, -1.2);
  flowerLayer.rotation.y += ((pointer.x * .12 + scrollProgress * .28) - flowerLayer.rotation.y) * .02;
  flowerLayer.rotation.x += ((-pointer.y * .06) - flowerLayer.rotation.x) * .02;
  keyLight.position.x = 1.8 + pointer.x * 2.2;
  keyLight.position.y = 2.7 - pointer.y;
  flowers.forEach((flower, i) => {
    const { bloom, baseY, phase } = flower.userData;
    flower.position.y = baseY + Math.sin(t * .55 + phase) * .055;
    flower.rotation.z = Math.sin(t * .24 + phase) * .04 + pointer.x * .03 * (i % 2 ? 1 : -1);
    bloom.rotation.z = Math.sin(t * .45 + phase) * .025;
  });
  petals.forEach(({ mesh, base, phase, strength }) => {
    mesh.position.x = base.x + Math.sin(t * .6 + phase) * strength + pointer.x * .035;
    mesh.position.y = base.y + Math.cos(t * .55 + phase) * strength + pointer.y * .02;
    mesh.rotation.z = mesh.userData.baseRotation + Math.sin(t * .5 + phase) * .07;
  });
  particleLayer.rotation.y = t * .008 + pointer.x * .12;
  particleLayer.rotation.x = pointer.y * .06;
  renderer.render(world, camera);
  requestAnimationFrame(animate);
}
animate();

function resize() { renderer.setSize(innerWidth, innerHeight); renderer.setPixelRatio(Math.min(devicePixelRatio || 1, innerWidth < 420 ? 1.35 : 1.75)); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }
addEventListener("resize", resize);

const sections = [...document.querySelectorAll(".scene")];
const sceneIndex = document.querySelector("#sceneIndex");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    sceneName = entry.target.dataset.scene;
    sceneIndex.textContent = entry.target.dataset.index;
    document.body.dataset.scene = sceneName;
    const index = Number(entry.target.dataset.index);
    scrollProgress = index / sections.length;
    keyLight.intensity = sceneName === "letter" ? 4 : sceneName === "finale" ? 23 : 13 + index * .25;
    particleMaterial.opacity = sceneName === "letter" ? .22 : sceneName === "messages" ? .34 : .68;
  });
}, { threshold: .42 });
sections.forEach((section) => observer.observe(section));

const beginButton = document.querySelector("#beginButton");
beginButton.addEventListener("click", () => {
  document.documentElement.classList.add("is-entering");
  startSound();
  if (navigator.vibrate) navigator.vibrate(10);
  document.querySelector("#before-us").scrollIntoView({ behavior: "smooth" });
});

function startSound() {
  if (audioStarted) return;
  audioStarted = true;
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  drone = audioContext.createOscillator();
  const gain = audioContext.createGain();
  drone.type = "sine"; drone.frequency.value = 110; gain.gain.value = .018; drone.connect(gain).connect(audioContext.destination); drone.start();
  document.querySelector("#soundToggle").classList.add("is-on");
  document.querySelector("#soundLabel").textContent = "вкл";
}

document.querySelector("#soundToggle").addEventListener("click", () => {
  if (!audioStarted) return startSound();
  const gain = audioContext.createGain();
  if (audioContext.state === "running") audioContext.suspend(); else audioContext.resume();
  document.querySelector("#soundToggle").classList.toggle("is-on");
  document.querySelector("#soundLabel").textContent = audioContext.state === "running" ? "вкл" : "выкл";
});

document.querySelectorAll(".memory-trigger").forEach((button) => button.addEventListener("click", () => openSecret(button.dataset.secret)));
const secretModal = document.querySelector("#secretModal");
function openSecret(text) { document.querySelector("#secretText").textContent = text; secretModal.classList.add("is-visible"); secretModal.setAttribute("aria-hidden", "false"); if (navigator.vibrate) navigator.vibrate(8); }
function closeSecret() { secretModal.classList.remove("is-visible"); secretModal.setAttribute("aria-hidden", "true"); }
document.querySelector(".close-modal").addEventListener("click", closeSecret); secretModal.addEventListener("click", (e) => { if (e.target === secretModal) closeSecret(); });

const toast = document.querySelector("#toast");
function showToast(message) { toast.textContent = message; toast.classList.add("is-visible"); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2600); }

document.querySelectorAll(".map-pin").forEach((pin) => pin.addEventListener("click", () => { document.querySelector("#placeText").textContent = pin.dataset.place; document.querySelector("#placePopover").classList.add("is-visible"); }));
document.querySelector(".close-popover").addEventListener("click", () => document.querySelector("#placePopover").classList.remove("is-visible"));

const filmStrip = document.querySelector("#filmStrip");
let filmStart = null;
filmStrip.addEventListener("pointerdown", (e) => { filmStart = e.clientX; filmStrip.setPointerCapture(e.pointerId); });
filmStrip.addEventListener("pointermove", (e) => { if (filmStart == null) return; const delta = e.clientX - filmStart; filmStrip.style.transform = `translateX(${Math.max(-120, Math.min(120, delta))}px) rotate(-4deg)`; });
filmStrip.addEventListener("pointerup", () => { filmStart = null; filmStrip.style.transform = "rotate(-4deg)"; });

const deskPhoto = document.querySelector(".desk-photo"); let drag = false; let dragStart = 0;
deskPhoto.addEventListener("pointerdown", (e) => { drag = true; dragStart = e.clientX; deskPhoto.setPointerCapture(e.pointerId); });
deskPhoto.addEventListener("pointermove", (e) => { if (!drag) return; const d = e.clientX - dragStart; deskPhoto.style.transform = `translateX(${d}px) rotate(${d / 12 - 4}deg)`; if (Math.abs(d) > 75) showToast("Под фотографией появится ещё одно ваше воспоминание"); });
deskPhoto.addEventListener("pointerup", () => { drag = false; deskPhoto.style.transform = "rotate(-4deg)"; });

const divider = document.querySelector("#compareDivider"); const compare = document.querySelector(".compare-frame"); let comparing = false;
function compareMove(clientX) { const rect = compare.getBoundingClientRect(); const p = Math.max(7, Math.min(93, ((clientX - rect.left) / rect.width) * 100)); divider.style.left = `${p}%`; compare.querySelector(".compare-image--then").style.clipPath = `inset(0 ${100 - p}% 0 0)`; compare.querySelector(".compare-image--now").style.clipPath = `inset(0 0 0 ${p}%)`; }
divider.addEventListener("pointerdown", (e) => { comparing = true; divider.setPointerCapture(e.pointerId); });
compare.addEventListener("pointermove", (e) => { if (comparing) compareMove(e.clientX); }); compare.addEventListener("pointerup", () => { comparing = false; }); compare.addEventListener("pointerleave", () => { comparing = false; });

document.querySelector("#voiceButton").addEventListener("click", () => { startSound(); document.querySelector("#voiceWave").classList.toggle("is-playing"); showToast("Здесь подключится твоё настоящее голосовое сообщение"); });
document.querySelector("#replayButton").addEventListener("click", () => { scrollTo({ top: 0, behavior: "smooth" }); if (navigator.vibrate) navigator.vibrate(10); });

// Небольшая наклонная реакция интерфейсных фото на касание — мобильная версия получает тот же объём, а не JPEG-заглушку.
document.querySelectorAll(".placeholder-photo").forEach((card) => {
  card.addEventListener("pointermove", (e) => { const rect = card.getBoundingClientRect(); const x = ((e.clientX - rect.left) / rect.width - .5) * 7; const y = ((e.clientY - rect.top) / rect.height - .5) * -7; card.style.setProperty("--tilt-x", `${x}deg`); card.style.setProperty("--tilt-y", `${y}deg`); });
  card.addEventListener("pointerleave", () => { card.style.setProperty("--tilt-x", "0deg"); card.style.setProperty("--tilt-y", "0deg"); });
});
