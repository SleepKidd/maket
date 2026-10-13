import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

// Rounded low-poly petal: a soft silhouette with a real curved surface,
// shared by every flower through InstancedMesh.
function createPetalGeometry() {
  const geometry = new THREE.BufferGeometry();
  const rows = 5;
  const columns = 5;
  const positions = [];
  const uvs = [];
  const indices = [];
  const widths = [0.045, 0.18, 0.31, 0.34, 0.28, 0.13];

  for (let row = 0; row <= rows; row += 1) {
    const t = row / rows;
    const y = (t - 0.5) * 1.18;
    const width = widths[row];
    for (let column = 0; column <= columns; column += 1) {
      const u = column / columns * 2 - 1;
      const edge = Math.max(0, 1 - Math.abs(u) * .95);
      const x = u * width * edge;
      const curl = Math.sin(t * Math.PI) * (.06 + edge * .075) - Math.max(0, t - .68) * .06;
      positions.push(x, y, curl);
      uvs.push(column / columns, t);
    }
  }

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const a = row * (columns + 1) + column;
      const b = a + 1;
      const c = a + columns + 1;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createLeafGeometry() {
  const geometry = new THREE.BufferGeometry();
  const rows = 4;
  const columns = 2;
  const positions = [];
  const uvs = [];
  const indices = [];
  const widths = [0.035, 0.19, 0.3, 0.22, 0.02];

  for (let row = 0; row <= rows; row += 1) {
    const t = row / rows;
    const width = widths[row];
    for (let column = 0; column <= columns; column += 1) {
      const u = column / columns * 2 - 1;
      const edge = Math.max(0, 1 - Math.abs(u));
      positions.push(u * width * edge, (t - .5) * 1.25, Math.sin(t * Math.PI) * (.05 + edge * .06));
      uvs.push(column / columns, t);
    }
  }

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const a = row * (columns + 1) + column;
      const b = a + 1;
      const c = a + columns + 1;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

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
  const heartGroup = new THREE.Group();
  scene.add(rig, foreground, heartGroup);
  rig.add(botany);

  const ambient = new THREE.AmbientLight(0xfff4ea, 1.65);
  const warm = new THREE.PointLight(0xffc7a7, 7, 15, 2);
  warm.position.set(2.5, 2.8, 3.2);
  const green = new THREE.PointLight(0xa7c89d, 4.5, 12, 2);
  green.position.set(-3.5, -1.5, -1);
  scene.add(ambient, warm, green);

  const petalGeometry = createPetalGeometry();
  const leafGeometry = createLeafGeometry();
  const stemGeometry = new THREE.CylinderGeometry(.018, .027, 1.45, 5);
  const centerGeometry = new THREE.SphereGeometry(.12, 8, 6);
  const petalMaterial = new THREE.MeshStandardMaterial({ color: 0xd98f9f, roughness: .54, metalness: .02, emissive: 0x6b3445, emissiveIntensity: .18, side: THREE.DoubleSide });
  const ivoryMaterial = new THREE.MeshStandardMaterial({ color: 0xf3dfcf, roughness: .5, metalness: .02, emissive: 0x8b6257, emissiveIntensity: .12, side: THREE.DoubleSide });
  const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x789276, roughness: .84, metalness: 0, side: THREE.DoubleSide });
  const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x6f8a6c, roughness: .9, metalness: 0 });
  const centerMaterial = new THREE.MeshStandardMaterial({ color: 0xc89162, roughness: .6, metalness: .04, emissive: 0x5c3022, emissiveIntensity: .12 });
  const heartMaterial = new THREE.MeshPhysicalMaterial({ color: 0xc9677f, roughness: .28, metalness: .04, clearcoat: .65, clearcoatRoughness: .18, emissive: 0x5c2237, emissiveIntensity: .12, transparent: true, opacity: .72 });

  const petalInstances = new THREE.InstancedMesh(petalGeometry, petalMaterial, quality.petals);
  const ivoryInstances = new THREE.InstancedMesh(petalGeometry, ivoryMaterial, Math.max(8, Math.floor(quality.petals * .42)));
  const leafInstances = new THREE.InstancedMesh(leafGeometry, leafMaterial, quality.leaves);
  const stemInstances = new THREE.InstancedMesh(stemGeometry, stemMaterial, quality.flowers);
  const centerInstances = new THREE.InstancedMesh(centerGeometry, centerMaterial, Math.max(quality.flowers, 5));
  [petalInstances, ivoryInstances, leafInstances, stemInstances, centerInstances].forEach((mesh) => mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage));
  botany.add(stemInstances, leafInstances, petalInstances, ivoryInstances, centerInstances);

  const heart = new THREE.Mesh(createHeartGeometry(), heartMaterial);
  heartGroup.add(heart);
  heartGroup.position.set(2.1, 1.18, -.8);
  heartGroup.scale.setScalar(.48);
  heart.rotation.z = -.12;

  const dustCount = Math.max(42, Math.floor(quality.petals * .78));
  const dustPositions = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i += 1) {
    dustPositions[i * 3] = (Math.random() - .5) * 9;
    dustPositions[i * 3 + 1] = (Math.random() - .5) * 7;
    dustPositions[i * 3 + 2] = -2 - Math.random() * 5;
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
  const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: 0xc29b86, size: quality.profile === "low" ? .022 : .03, transparent: true, opacity: .5, depthWrite: false }));
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
  const loosePetals = new THREE.Points(looseGeometry, new THREE.PointsMaterial({ color: 0xe4a9b6, size: quality.profile === "low" ? .038 : .052, transparent: true, opacity: .68, depthWrite: false }));
  foreground.add(loosePetals);

  const flowers = Array.from({ length: quality.flowers }, (_, index) => ({
    index,
    x: (index % 2 ? 1 : -1) * (1.05 + (index % 4) * .62),
    y: -.8 + (index % 5) * .4,
    z: -1.1 - index * .35,
    scale: .55 + (index % 3) * .11,
    phase: Math.random() * 9,
    outerPetals: 10 + (index % 3) * 2,
    innerPetals: 6 + (index % 2) * 2,
    open: index === 0 ? 1 : .72,
  }));

  let sceneStage = .05;
  let targetStage = .05;
  let scrollProgress = 0;
  let pointerX = 0;
  let pointerY = 0;
  let active = true;
  let time = 0;
  let frame = 0;
  let width = 1;
  let height = 1;
  const matrix = new THREE.Matrix4();
  const hiddenMatrix = new THREE.Matrix4().makeScale(0, 0, 0);
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
    heartGroup.position.x = width < 720 ? 1.35 : 2.1;
    heartGroup.scale.setScalar(width < 720 ? .37 : .48);
  }

  function writeInstances() {
    let petalIndex = 0;
    let ivoryIndex = 0;
    let leafIndex = 0;
    let stemIndex = 0;
    let centerIndex = 0;

    flowers.forEach((flower, flowerIndex) => {
      const growth = clamp(sceneStage * 1.3 - flowerIndex * .075, .08, 1);
      const breathing = 1 + Math.sin(time * .55 + flower.phase) * .025;
      const opening = clamp(growth * flower.open, .08, 1);
      const centerY = flower.y + .46 * growth + Math.sin(time * .5 + flower.phase) * .04;
      const outerRadius = (.18 + opening * .13) * flower.scale;
      const innerRadius = (.08 + opening * .04) * flower.scale;

      for (let i = 0; i < flower.outerPetals && petalIndex < quality.petals; i += 1) {
        const angle = i / flower.outerPetals * Math.PI * 2 + flower.phase * .08;
        position.set(flower.x + Math.cos(angle) * outerRadius, centerY + Math.sin(angle) * .018, flower.z + Math.sin(angle) * .08);
        euler.set(.52 - opening * .18, Math.sin(angle) * .12 + pointerY * .035, angle + Math.PI / 2 + pointerX * .035);
        quaternion.setFromEuler(euler);
        scale.set(.46 * breathing * flower.scale, .72 * breathing * flower.scale * (.72 + opening * .28), .8 * flower.scale);
        matrix.compose(position, quaternion, scale);
        petalInstances.setMatrixAt(petalIndex++, matrix);
      }

      for (let i = 0; i < flower.innerPetals && ivoryIndex < ivoryInstances.count; i += 1) {
        const angle = i / flower.innerPetals * Math.PI * 2 + .28 + flower.phase * .11;
        position.set(flower.x + Math.cos(angle) * innerRadius, centerY + .075 * opening, flower.z + Math.sin(angle) * .065);
        euler.set(.28 - opening * .1, pointerY * .025, angle + Math.PI / 2);
        quaternion.setFromEuler(euler);
        scale.set(.34 * flower.scale, .54 * flower.scale * (.72 + opening * .28), .7 * flower.scale);
        matrix.compose(position, quaternion, scale);
        ivoryInstances.setMatrixAt(ivoryIndex++, matrix);
      }

      if (centerIndex < centerInstances.count) {
        position.set(flower.x, centerY + .1 * opening, flower.z + .09);
        euler.set(0, pointerY * .04, 0);
        quaternion.setFromEuler(euler);
        scale.setScalar(.82 * flower.scale * opening);
        matrix.compose(position, quaternion, scale);
        centerInstances.setMatrixAt(centerIndex++, matrix);
      }

      if (stemIndex < stemInstances.count) {
        position.set(flower.x + pointerX * .08, flower.y - .2, flower.z);
        euler.set(pointerY * .035, pointerX * .03, Math.sin(time * .22 + flower.phase) * .045);
        quaternion.setFromEuler(euler);
        scale.setScalar(flower.scale * (.55 + growth * .45));
        matrix.compose(position, quaternion, scale);
        stemInstances.setMatrixAt(stemIndex++, matrix);
      }

      const leavesForFlower = Math.min(3, Math.floor(quality.leaves / flowers.length));
      for (let leaf = 0; leaf < leavesForFlower && leafIndex < quality.leaves; leaf += 1) {
        const y = flower.y - .48 + leaf * .32;
        position.set(flower.x + (leaf % 2 ? -.24 : .24), y, flower.z + .02);
        euler.set((leaf % 2 ? -.42 : .42), pointerX * .05, (leaf % 2 ? -.68 : .68) + Math.sin(time * .35 + flower.phase) * .05);
        quaternion.setFromEuler(euler);
        scale.setScalar((.58 + growth * .35) * flower.scale);
        matrix.compose(position, quaternion, scale);
        leafInstances.setMatrixAt(leafIndex++, matrix);
      }
    });

    while (petalIndex < quality.petals) petalInstances.setMatrixAt(petalIndex++, hiddenMatrix);
    while (ivoryIndex < ivoryInstances.count) ivoryInstances.setMatrixAt(ivoryIndex++, hiddenMatrix);
    while (leafIndex < quality.leaves) leafInstances.setMatrixAt(leafIndex++, hiddenMatrix);
    while (stemIndex < stemInstances.count) stemInstances.setMatrixAt(stemIndex++, hiddenMatrix);
    while (centerIndex < centerInstances.count) centerInstances.setMatrixAt(centerIndex++, hiddenMatrix);
    [petalInstances, ivoryInstances, leafInstances, stemInstances, centerInstances].forEach((mesh) => { mesh.instanceMatrix.needsUpdate = true; });
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
    heart.rotation.y += ((scrollProgress * Math.PI * 2 + pointerX * .12) - heart.rotation.y) * .08;
    heart.rotation.x += ((Math.sin(time * .25) * .06 + pointerY * .06) - heart.rotation.x) * .06;
    heart.position.y = Math.sin(time * .32) * .04;
    heartMaterial.opacity += ((.18 + scrollProgress * .62) - heartMaterial.opacity) * .06;
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
    petalMaterial.color.set(isFinal ? 0xde8d9e : sceneId === "messages" ? 0xb77a89 : 0xd98f9f);
    ivoryMaterial.color.set(isFinal ? 0xffe7c7 : 0xf3dfcf);
    warm.intensity = isFinal ? 12 : sceneId === "letter" ? 3.5 : 7;
  }

  function setScrollProgress(value) { scrollProgress = clamp(value, 0, 1); }
  function setActive(value) { active = value; }
  function resize() { updateSize(); }
  function stats() { return { drawCalls: renderer.info.render.calls, triangles: renderer.info.render.triangles, textures: renderer.info.memory.textures }; }
  function dispose() {
    [petalGeometry, leafGeometry, stemGeometry, centerGeometry, heart.geometry, petalMaterial, ivoryMaterial, leafMaterial, stemMaterial, centerMaterial, heartMaterial, dustGeometry, looseGeometry].forEach((resource) => resource.dispose?.());
    renderer.dispose();
  }

  updateSize();
  writeInstances();
  return { update, resize, setPointer, setScene, setScrollProgress, setActive, stats, dispose, renderer };
}
