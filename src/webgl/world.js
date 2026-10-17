import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));\nconst FLOWER_ASSET = "./assets/3d/source/flower-original-cutout.png?v=transparent-flower-2";

function createHeartGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, -1.05);
  shape.bezierCurveTo(-.26, -.82, -1.2, -.22, -1.08, .42);
  shape.bezierCurveTo(-.98, 1.02, -.28, 1.12, 0, .52);
  shape.bezierCurveTo(.28, 1.12, .98, 1.02, 1.08, .42);
  shape.bezierCurveTo(1.2, -.22, .26, -.82, 0, -1.05);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: .24,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: .065,
    bevelThickness: .055,
    curveSegments: 8,
  });
  geometry.center();
  geometry.computeVertexNormals();
  return geometry;
}

// The archive contains a finished 2800×2800 raster render. The production
// asset is the same flower with the blue field removed as real alpha
// transparency. The plane gives those original pixels a depth position in
// the Three.js composition without inventing a different flower.
function createReferenceFlower(texture) {
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    toneMapped: false,
    transparent: true,
    alphaTest: .015,
    depthWrite: false,
  });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 2.8), material);
  plane.frustumCulled = false;
  return plane;
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
  const referenceFlowerGroup = new THREE.Group();
  const foreground = new THREE.Group();
  const heartGroup = new THREE.Group();
  scene.add(rig, foreground, heartGroup);
  rig.add(referenceFlowerGroup);

  const ambient = new THREE.AmbientLight(0xfff4ea, 1.35);
  const warm = new THREE.PointLight(0xffc7a7, 5, 15, 2);
  warm.position.set(2.5, 2.8, 3.2);
  scene.add(ambient, warm);

  let referenceFlower;
  const referenceTexture = new THREE.TextureLoader().load(
    FLOWER_ASSET,
    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    },
    undefined,
    () => { if (referenceFlower) referenceFlower.visible = false; },
  );
  referenceFlower = createReferenceFlower(referenceTexture);
  referenceFlowerGroup.add(referenceFlower);

  const heartMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xc9677f,
    roughness: .28,
    metalness: .04,
    clearcoat: .65,
    clearcoatRoughness: .18,
    emissive: 0x5c2237,
    emissiveIntensity: .12,
    transparent: true,
    opacity: .72,
  });
  const heart = new THREE.Mesh(createHeartGeometry(), heartMaterial);
  heartGroup.add(heart);
  heart.rotation.z = -.12;

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

  function updateSize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const mobile = width < 720;
    referenceFlowerGroup.position.set(mobile ? 0 : 1.45, mobile ? .7 : .55, -1.55);
    referenceFlowerGroup.scale.setScalar(mobile ? .86 : 1.08);
    heartGroup.position.set(mobile ? 1.12 : 2.1, mobile ? .15 : 1.18, -.8);
    heartGroup.scale.setScalar(mobile ? .34 : .48);
  }

  function update(now, delta) {
    if (!active) return;
    time += delta;
    referenceFlowerGroup.rotation.y += ((pointerX * .055) - referenceFlowerGroup.rotation.y) * .06;
    referenceFlowerGroup.rotation.x += ((-pointerY * .035) - referenceFlowerGroup.rotation.x) * .06;
    camera.position.x += ((pointerX * .18) - camera.position.x) * .025;
    camera.position.y += ((.12 - pointerY * .12) - camera.position.y) * .025;
    camera.lookAt(0, .18, -1.2);
    warm.position.x = 2.5 + pointerX * 1.1;
    warm.position.y = 2.8 - pointerY * .6;

    // One complete scroll through the story equals one full 360° heart turn.
    heart.rotation.y += ((scrollProgress * Math.PI * 2 + pointerX * .12) - heart.rotation.y) * .08;
    heart.rotation.x += ((Math.sin(time * .25) * .06 + pointerY * .06) - heart.rotation.x) * .06;
    heart.position.y = Math.sin(time * .32) * .04;
    heartMaterial.opacity += ((.18 + scrollProgress * .62) - heartMaterial.opacity) * .06;
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
  }

  function setScrollProgress(value) { scrollProgress = clamp(value, 0, 1); }
  function setActive(value) { active = value; }
  function resize() { updateSize(); }
  function stats() { return { drawCalls: renderer.info.render.calls, triangles: renderer.info.render.triangles, textures: renderer.info.memory.textures }; }
  function dispose() {
    referenceTexture.dispose();
    referenceFlower.geometry.dispose();
    referenceFlower.material.dispose();
    heart.geometry.dispose();
    heartMaterial.dispose();
    dustGeometry.dispose();
    dustMaterial.dispose();
    renderer.dispose();
  }

  updateSize();
  return { update, resize, setPointer, setScene, setScrollProgress, setActive, stats, dispose, renderer };
}
