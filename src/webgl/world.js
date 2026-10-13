import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function createPetalGeometry() {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array([
    0, -.56, 0,
    -.25, -.2, .035,
    -.2, .24, .09,
    0, .58, .03,
    .2, .24, .09,
    .25, -.2, .035,
    0, .04, .17,
  ]);
  const uvs = new Float32Array([
    .5, 0, .22, .28, .28, .72, .5, 1, .72, .72, .78, .28, .5, .5,
  ]);
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex([0, 1, 6, 1, 2, 6, 2, 3, 6, 3, 4, 6, 4, 5, 6, 5, 0, 6]);
  geometry.computeVertexNormals();
  return geometry;
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
  const botany = new THREE.Group();
  const foreground = new THREE.Group();
  scene.add(rig, foreground);
  rig.add(botany);

  const ambient = new THREE.AmbientLight(0x6c5260, 1.3);
  const warm = new THREE.PointLight(0xc68472, 8, 15, 2);
  warm.position.set(2.5, 2.8, 3.2);
  const wine = new THREE.PointLight(0x651f3b, 6, 12, 2);
  wine.position.set(-3.5, -1.5, -1);
  scene.add(ambient, warm, wine);

  const petalGeometry = createPetalGeometry();
  const leafGeometry = new THREE.PlaneGeometry(.38, .72, 1, 2);
  const petalMaterial = new THREE.MeshStandardMaterial({ color: 0xd8a2a0, roughness: .54, metalness: .02, emissive: 0x2a0a17, emissiveIntensity: .32, side: THREE.DoubleSide });
  const creamMaterial = new THREE.MeshStandardMaterial({ color: 0xeadcc9, roughness: .5, metalness: .02, emissive: 0x2d1716, emissiveIntensity: .24, side: THREE.DoubleSide });
  const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x334332, roughness: .84, metalness: 0, side: THREE.DoubleSide });
  const petalInstances = new THREE.InstancedMesh(petalGeometry, petalMaterial, quality.petals);
  const creamInstances = new THREE.InstancedMesh(petalGeometry, creamMaterial, Math.max(8, Math.floor(quality.petals * .45)));
  const leafInstances = new THREE.InstancedMesh(leafGeometry, leafMaterial, quality.leaves);
  petalInstances.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  creamInstances.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  leafInstances.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  botany.add(petalInstances, creamInstances, leafInstances);

  const stemPositions = new Float32Array(quality.flowers * 6);
  const stemGeometry = new THREE.BufferGeometry();
  stemGeometry.setAttribute("position", new THREE.BufferAttribute(stemPositions, 3));
  const stems = new THREE.LineSegments(stemGeometry, new THREE.LineBasicMaterial({ color: 0x3c5135, transparent: true, opacity: .82 }));
  botany.add(stems);

  const dustCount = Math.max(42, Math.floor(quality.petals * .78));
  const dustPositions = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i += 1) {
    dustPositions[i * 3] = (Math.random() - .5) * 9;
    dustPositions[i * 3 + 1] = (Math.random() - .5) * 7;
    dustPositions[i * 3 + 2] = -2 - Math.random() * 5;
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
  const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: 0xd8c0a6, size: quality.profile === "low" ? .022 : .03, transparent: true, opacity: .5, depthWrite: false }));
  foreground.add(dust);

  const looseCount = Math.max(8, Math.floor(quality.petals * .28));
  const looseGeometry = new THREE.BufferGeometry();
  const loosePositions = new Float32Array(looseCount * 3);
  const looseSeeds = [];
  for (let i = 0; i < looseCount; i += 1) {
    loosePositions[i * 3] = (Math.random() - .5) * 7;
    loosePositions[i * 3 + 1] = (Math.random() - .5) * 6;
    loosePositions[i * 3 + 2] = 1 - Math.random() * 6;
    looseSeeds.push({ phase: Math.random() * 10, speed: .1 + Math.random() * .18 });
  }
  looseGeometry.setAttribute("position", new THREE.BufferAttribute(loosePositions, 3));
  const loosePetals = new THREE.Points(looseGeometry, new THREE.PointsMaterial({ color: 0xe2b9ae, size: quality.profile === "low" ? .038 : .052, transparent: true, opacity: .68, depthWrite: false }));
  foreground.add(loosePetals);

  const flowers = Array.from({ length: quality.flowers }, (_, index) => ({
    index,
    x: (index % 2 ? 1 : -1) * (1.05 + (index % 4) * .62),
    y: -.8 + (index % 5) * .4,
    z: -1.1 - index * .35,
    scale: .55 + (index % 3) * .11,
    phase: Math.random() * 9,
    petals: 8 + (index % 3),
    open: index === 0 ? 1 : .7,
  }));
  let sceneStage = .05;
  let targetStage = .05;
  let pointerX = 0;
  let pointerY = 0;
  let active = true;
  let time = 0;
  let frame = 0;
  let width = 1;
  let height = 1;
  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const euler = new THREE.Euler();

  function updateSize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function writeInstances() {
    let petalIndex = 0;
    let creamIndex = 0;
    let leafIndex = 0;
    flowers.forEach((flower, flowerIndex) => {
      const growth = clamp(sceneStage * 1.3 - flowerIndex * .075, .08, 1);
      const breathing = 1 + Math.sin(time * .55 + flower.phase) * .025;
      const opening = clamp(growth * flower.open, .08, 1);
      for (let i = 0; i < flower.petals && petalIndex < quality.petals; i += 1) {
        const angle = i / flower.petals * Math.PI * 2;
        const radius = .28 * opening;
        position.set(flower.x + Math.cos(angle) * radius, flower.y + .46 * growth + Math.sin(time * .5 + flower.phase) * .04, flower.z + Math.sin(angle) * .16);
        euler.set(.16 + (1 - opening) * .35, angle * .12 + pointerY * .08, angle + Math.PI / 2 + pointerX * .06);
        quaternion.setFromEuler(euler);
        scale.set(.42 * breathing * (0.78 + opening * .22), .7 * breathing * (0.72 + opening * .28), .17);
        matrix.compose(position, quaternion, scale);
        petalInstances.setMatrixAt(petalIndex++, matrix);
      }
      if (flowerIndex % 2 === 0 && creamIndex < creamInstances.count) {
        position.set(flower.x, flower.y + .46 * growth, flower.z + .09);
        euler.set(0, pointerY * .04, 0);
        quaternion.setFromEuler(euler);
        scale.set(.23 * opening, .23 * opening, .23 * opening);
        matrix.compose(position, quaternion, scale);
        creamInstances.setMatrixAt(creamIndex++, matrix);
      }
      const stemOffset = flowerIndex * 6;
      stemPositions[stemOffset] = flower.x;
      stemPositions[stemOffset + 1] = flower.y - .85;
      stemPositions[stemOffset + 2] = flower.z;
      stemPositions[stemOffset + 3] = flower.x + pointerX * .08 + Math.sin(time * .22 + flower.phase) * .07;
      stemPositions[stemOffset + 4] = flower.y + .46 * growth;
      stemPositions[stemOffset + 5] = flower.z;
      const leavesForFlower = Math.min(3, Math.floor(quality.leaves / flowers.length));
      for (let leaf = 0; leaf < leavesForFlower && leafIndex < quality.leaves; leaf += 1) {
        const y = flower.y - .45 + leaf * .32;
        position.set(flower.x + (leaf % 2 ? -.24 : .24), y, flower.z + .02);
        euler.set((leaf % 2 ? -.26 : .26), pointerX * .05, (leaf % 2 ? -.65 : .65) + Math.sin(time * .35 + flower.phase) * .05);
        quaternion.setFromEuler(euler);
        scale.setScalar((.65 + growth * .32) * flower.scale);
        matrix.compose(position, quaternion, scale);
        leafInstances.setMatrixAt(leafIndex++, matrix);
      }
    });
    while (petalIndex < quality.petals) { petalInstances.setMatrixAt(petalIndex++, new THREE.Matrix4().makeScale(0, 0, 0)); }
    while (creamIndex < creamInstances.count) { creamInstances.setMatrixAt(creamIndex++, new THREE.Matrix4().makeScale(0, 0, 0)); }
    while (leafIndex < quality.leaves) { leafInstances.setMatrixAt(leafIndex++, new THREE.Matrix4().makeScale(0, 0, 0)); }
    petalInstances.instanceMatrix.needsUpdate = true;
    creamInstances.instanceMatrix.needsUpdate = true;
    leafInstances.instanceMatrix.needsUpdate = true;
    stemGeometry.attributes.position.needsUpdate = true;
    stemGeometry.computeBoundingSphere();
  }

  function updateLoosePetals() {
    const attribute = looseGeometry.attributes.position;
    for (let i = 0; i < looseCount; i += 1) {
      const seed = looseSeeds[i];
      const yIndex = i * 3 + 1;
      const xIndex = i * 3;
      attribute.array[yIndex] += seed.speed * .003;
      attribute.array[xIndex] += Math.sin(time * .7 + seed.phase) * .0009;
      if (attribute.array[yIndex] > 3.7) attribute.array[yIndex] = -3.7;
    }
    attribute.needsUpdate = true;
  }

  function update(now, delta) {
    if (!active) return;
    time += delta;
    sceneStage += (targetStage - sceneStage) * Math.min(1, delta * 2.5);
    pointerX *= .985;
    pointerY *= .985;
    rig.rotation.y += ((pointerX * .09) - rig.rotation.y) * .08;
    rig.rotation.x += ((-pointerY * .06) - rig.rotation.x) * .08;
    camera.position.x += ((pointerX * .24) - camera.position.x) * .025;
    camera.position.y += ((.12 - pointerY * .16) - camera.position.y) * .025;
    camera.lookAt(0, .18, -1.2);
    warm.position.x = 2.5 + pointerX * 1.4;
    warm.position.y = 2.8 - pointerY * .8;
    if (frame++ % (quality.profile === "high" ? 1 : 2) === 0) writeInstances();
    updateLoosePetals();
    dust.rotation.y = time * .006;
    loosePetals.rotation.y = Math.sin(time * .12) * .08;
    renderer.render(scene, camera);
  }

  function setPointer(x, y, velocity = 0) {
    pointerX += (x * (.55 + velocity * .2) - pointerX) * .2;
    pointerY += (y * (.45 + velocity * .15) - pointerY) * .2;
  }

  function setScene(stage, sceneId = "") {
    targetStage = clamp(stage, .03, 1);
    const isFinal = sceneId === "days" || sceneId === "finale";
    petalMaterial.color.set(isFinal ? 0xe2b5aa : sceneId === "messages" ? 0x8e5060 : 0xd8a2a0);
    creamMaterial.color.set(isFinal ? 0xf1e2c7 : 0xeadcc9);
    warm.intensity = isFinal ? 12 : sceneId === "letter" ? 3.5 : 8;
  }

  function setActive(value) { active = value; }
  function resize() { updateSize(); }
  function stats() { return { drawCalls: renderer.info.render.calls, triangles: renderer.info.render.triangles, textures: renderer.info.memory.textures }; }
  function dispose() {
    [petalGeometry, leafGeometry, petalMaterial, creamMaterial, leafMaterial, stemGeometry, dustGeometry, looseGeometry].forEach((resource) => resource.dispose?.());
    renderer.dispose();
  }

  updateSize();
  writeInstances();
  return { update, resize, setPointer, setScene, setActive, stats, dispose, renderer };
}
