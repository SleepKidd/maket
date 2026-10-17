import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const FLOWER_ASSET = "./assets/3d/source/flower-original-cutout.png?v=botanical-soft-1";

function createReferenceMaterial(texture) {
  return new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    toneMapped: false,
    transparent: true,
    alphaTest: .015,
    depthWrite: false,
    opacity: .46,
  });
}

function createReferenceFlower(geometry, material) {
  const flower = new THREE.Mesh(geometry, material);
  flower.frustumCulled = false;
  return flower;
}

const FLOWER_LAYOUT_DESKTOP = [
  { x: -4.35, y: 2.65, z: -3.35, scale: .48, rotation: -.16, phase: .2 },
  { x: -4.25, y: -.35, z: -1.75, scale: .36, rotation: .13, phase: 1.1 },
  { x: -3.95, y: -2.25, z: -2.8, scale: .42, rotation: -.08, phase: 2.2 },
  { x: 4.2, y: 2.4, z: -2.9, scale: .44, rotation: .09, phase: 3.0 },
  { x: 4.35, y: .15, z: -1.35, scale: .56, rotation: -.12, phase: 4.2 },
  { x: 4.05, y: -2.05, z: -2.45, scale: .40, rotation: .18, phase: 5.1 },
  { x: -.75, y: 3.05, z: -3.8, scale: .28, rotation: -.22, phase: 5.8 },
  { x: .95, y: -2.65, z: -3.55, scale: .32, rotation: .15, phase: 6.4 },
  { x: -1.9, y: 2.15, z: -4.1, scale: .26, rotation: .08, phase: 7.2 },
  { x: 2.1, y: -2.15, z: -4.0, scale: .25, rotation: -.1, phase: 8.1 },
];

const FLOWER_LAYOUT_MOBILE = [
  { x: -1.62, y: 2.15, z: -3.25, scale: .36, rotation: -.14, phase: .2 },
  { x: 1.55, y: 1.78, z: -2.2, scale: .42, rotation: .12, phase: 1.0 },
  { x: -1.52, y: .42, z: -2.55, scale: .28, rotation: .18, phase: 1.8 },
  { x: 1.48, y: -.25, z: -1.65, scale: .34, rotation: -.16, phase: 2.6 },
  { x: -1.45, y: -1.75, z: -2.9, scale: .32, rotation: .09, phase: 3.5 },
  { x: 1.52, y: -1.85, z: -2.1, scale: .30, rotation: -.2, phase: 4.4 },
  { x: -.95, y: 2.95, z: -4.0, scale: .24, rotation: -.08, phase: 5.2 },
  { x: .9, y: -2.85, z: -3.7, scale: .24, rotation: .16, phase: 6.1 },
];

function createFlowerCluster(texture, mobile) {
  const geometry = new THREE.PlaneGeometry(2.8, 2.8);
  const material = createReferenceMaterial(texture);
  const group = new THREE.Group();
  const layout = mobile ? FLOWER_LAYOUT_MOBILE : FLOWER_LAYOUT_DESKTOP;
  const flowers = layout.map((item) => {
    const flower = createReferenceFlower(geometry, material);
    flower.userData.base = item;
    flower.userData.growth = .18;
    group.add(flower);
    return flower;
  });
  group.userData.flowers = flowers;
  group.userData.geometry = geometry;
  group.userData.material = material;
  return group;
}

export function createBotanicalWorld(canvas, quality) {
  const context = canvas.getContext("webgl2", { antialias: false, alpha: true, powerPreference: "high-performance" })
    || canvas.getContext("webgl", { antialias: false, alpha: true, powerPreference: "high-performance" });
  if (!context) return null;

  const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(quality.pixelRatio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(window.innerWidth < 720 ? 38 : 45, 1, .1, 40);
  camera.position.set(0, .15, 7.4);

  const rig = new THREE.Group();
  const botanicalGroup = new THREE.Group();
  const foreground = new THREE.Group();
  scene.add(rig, foreground);
  rig.add(botanicalGroup);

  const ambient = new THREE.AmbientLight(0xfff4ea, 1.35);
  const warm = new THREE.PointLight(0xffc7a7, 5, 15, 2);
  warm.position.set(2.5, 2.8, 3.2);
  scene.add(ambient, warm);

  let referenceTexture;
  let flowerCluster;
  const textureLoader = new THREE.TextureLoader();
  referenceTexture = textureLoader.load(
    FLOWER_ASSET,
    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    },
    undefined,
    () => { if (flowerCluster) flowerCluster.visible = false; },
  );
  flowerCluster = createFlowerCluster(referenceTexture, window.innerWidth < 720);
  botanicalGroup.add(flowerCluster);

  const dustCount = Math.max(34, Math.floor(quality.petals * .48));
  const dustPositions = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i += 1) {
    dustPositions[i * 3] = (Math.random() - .5) * 9;
    dustPositions[i * 3 + 1] = (Math.random() - .5) * 7;
    dustPositions[i * 3 + 2] = -2 - Math.random() * 5;
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
  const dustMaterial = new THREE.PointsMaterial({ color: 0xc29b86, size: quality.profile === "low" ? .02 : .027, transparent: true, opacity: .38, depthWrite: false });
  const dust = new THREE.Points(dustGeometry, dustMaterial);
  foreground.add(dust);

  let scrollProgress = 0;
  let pointerX = 0;
  let pointerY = 0;
  let active = true;
  let time = 0;
  let width = 1;
  let height = 1;
  let mobile = window.innerWidth < 720;

  function applyLayout() {
    mobile = width < 720;
    const layout = mobile ? FLOWER_LAYOUT_MOBILE : FLOWER_LAYOUT_DESKTOP;
    const flowers = flowerCluster.userData.flowers;
    flowers.forEach((flower, index) => {
      const item = layout[index % layout.length];
      flower.userData.base = item;
      flower.userData.growth = Math.max(flower.userData.growth || .18, .18);
    });
  }

  function updateSize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    applyLayout();
  }

  function update(now, delta) {
    if (!active) return;
    time += delta;
    camera.position.x += ((pointerX * .16) - camera.position.x) * .025;
    camera.position.y += ((.12 - pointerY * .1) - camera.position.y) * .025;
    camera.lookAt(0, .18, -1.2);
    warm.position.x = 2.5 + pointerX * 1.1;
    warm.position.y = 2.8 - pointerY * .6;

    const growth = .16 + scrollProgress * .84;
    const flowers = flowerCluster.userData.flowers;
    flowers.forEach((flower, index) => {
      const item = flower.userData.base;
      const sway = Math.sin(time * (.22 + index * .012) + item.phase) * .035;
      const drift = Math.sin(time * .12 + item.phase) * (mobile ? .035 : .07);
      flower.position.set(item.x + drift + pointerX * (.035 + item.scale * .025), item.y + sway + pointerY * .02, item.z);
      flower.rotation.set(-pointerY * .02, pointerX * .035, item.rotation + Math.sin(time * .18 + item.phase) * .018);
      const localGrowth = Math.min(1, growth + index * .025);
      flower.scale.setScalar(item.scale * (.82 + localGrowth * .18));
    });

    botanicalGroup.rotation.y += ((pointerX * .022 + scrollProgress * .06) - botanicalGroup.rotation.y) * .045;
    botanicalGroup.position.y = Math.sin(time * .16) * .025;
    dust.rotation.y = time * .006;
    renderer.render(scene, camera);
  }

  function setPointer(x, y, velocity = 0) {
    pointerX += (x * (.55 + velocity * .2) - pointerX) * .2;
    pointerY += (y * (.45 + velocity * .15) - pointerY) * .2;
  }

  function setScene(stage, sceneId = "") {
    const isFinal = sceneId === "days" || sceneId === "finale";
    warm.intensity = isFinal ? 8 : sceneId === "letter" ? 2.8 : 5;
    scrollProgress = clamp(Math.max(scrollProgress, Number(stage || 0) / 14), 0, 1);
  }

  function setScrollProgress(value) { scrollProgress = clamp(value, 0, 1); }
  function setActive(value) { active = value; }
  function resize() { updateSize(); }
  function stats() { return { drawCalls: renderer.info.render.calls, triangles: renderer.info.render.triangles, textures: renderer.info.memory.textures }; }
  function dispose() {
    referenceTexture.dispose();
    flowerCluster.userData.geometry.dispose();
    flowerCluster.userData.material.dispose();
    dustGeometry.dispose();
    dustMaterial.dispose();
    renderer.dispose();
  }

  updateSize();
  return { update, resize, setPointer, setScene, setScrollProgress, setActive, stats, dispose, renderer };
}
