let THREE;

/* One scene, shared curved petal/leaf meshes, instanced botanical animation. */
const clamp = (v,a,b) => Math.max(a, Math.min(b,v));
const TAU = Math.PI * 2;
function petalGeometry() {
  const positions=[], normals=[], uvs=[], indices=[];
  const rows=9, columns=8;
  for(let j=0;j<=rows;j++){
    const t=j/rows;
    const breadth=Math.pow(Math.sin(Math.PI*Math.pow(t,.82)),.72) * (0.72+.28*t);
    for(let i=0;i<=columns;i++){
      const u=i/columns*2-1;
      positions.push(u*breadth*.48, t*.95, (1-u*u)*Math.sin(t*Math.PI)*.23 - t*t*.24);
      uvs.push(i/columns,t);
    }
  }
  for(let j=0;j<rows;j++) for(let i=0;i<columns;i++){
    const a=j*(columns+1)+i,b=a+columns+1;
    indices.push(a,b,a+1,b,b+1,a+1);
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));
  geo.setAttribute("uv",new THREE.Float32BufferAttribute(uvs,2));
  geo.setIndex(indices);geo.computeVertexNormals();return geo;
}
function leafGeometry() {
  const positions=[],indices=[];
  const rows=8, columns=6;
  for(let j=0;j<=rows;j++){
    const t=j/rows,breadth=Math.sin(Math.PI*t)*.34;
    for(let i=0;i<=columns;i++){
      const u=i/columns*2-1;
      positions.push(u*breadth,t*.85,(1-Math.abs(u))*.1*Math.sin(Math.PI*t));
    }
  }
  for(let j=0;j<rows;j++)for(let i=0;i<columns;i++){
    const a=j*(columns+1)+i,b=a+columns+1;
    indices.push(a,b,a+1,b,b+1,a+1);
  }
  const geo=new THREE.BufferGeometry();geo.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));geo.setIndex(indices);geo.computeVertexNormals();return geo;
}
export async function createBotanicalWorld(canvas, initialQuality){
  try { THREE = await import("https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js"); }
  catch (error) { console.warn("Three.js unavailable, using CSS floral fallback", error); return null; }
  const context=canvas.getContext("webgl2",{alpha:true,antialias:false,stencil:false,powerPreference:"low-power"})||
                canvas.getContext("webgl",{alpha:true,antialias:false,stencil:false,powerPreference:"low-power"});
  if(!context) return null;
  const renderer=new THREE.WebGLRenderer({canvas,context,alpha:true,antialias:false,powerPreference:"low-power"});
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.6;renderer.setClearColor(0xffffff,0);
  let quality={...initialQuality};
  renderer.setPixelRatio(quality.pixelRatio);
  const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(39,1,.1,35);
  const root=new THREE.Group();scene.add(root);
  const sunlight=new THREE.DirectionalLight(0xfff3e3,3.1);sunlight.position.set(-3,6,8);
  const pink=new THREE.DirectionalLight(0xe89aaa,2.2);pink.position.set(4,-1,5);
  const ambient=new THREE.AmbientLight(0xffffff,2);
  scene.add(sunlight,pink,ambient);
  const petalsGeo=petalGeometry(),leavesGeo=leafGeometry();
  const centerGeo=new THREE.IcosahedronGeometry(.12,1);
  const stemGeo=new THREE.CylinderGeometry(.025,.047,1,5);
  const palette=[
    new THREE.MeshStandardMaterial({color:0xe5abb7,roughness:.83,side:THREE.DoubleSide,metalness:0}),
    new THREE.MeshStandardMaterial({color:0xffead9,roughness:.83,side:THREE.DoubleSide,metalness:0}),
    new THREE.MeshStandardMaterial({color:0xc77f9e,roughness:.81,side:THREE.DoubleSide,metalness:0}),
  ];
  const leafMat=new THREE.MeshStandardMaterial({color:0x7a9c86,roughness:.92,side:THREE.DoubleSide});
  const stemMat=new THREE.MeshStandardMaterial({color:0x779985,roughness:.9});
  const middleMat=new THREE.MeshStandardMaterial({color:0xd9af79,roughness:.86});
  const looseMat=new THREE.MeshStandardMaterial({color:0xf1c5d3,roughness:.82,side:THREE.DoubleSide,transparent:true,opacity:.85,depthWrite:false});
  const flowerLimit=12;
  const petalsPerFlower=18;
  const petalMeshes=palette.map((mat)=>new THREE.InstancedMesh(petalsGeo,mat,flowerLimit*petalsPerFlower));
  const leaves=new THREE.InstancedMesh(leavesGeo,leafMat,flowerLimit*3);
  const stems=new THREE.InstancedMesh(stemGeo,stemMat,flowerLimit);
  const centers=new THREE.InstancedMesh(centerGeo,middleMat,flowerLimit);
  const falling=new THREE.InstancedMesh(petalsGeo,looseMat,22);
  [...petalMeshes,leaves,stems,centers,falling].forEach(mesh=>{
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);mesh.frustumCulled=false;root.add(mesh);
  });
  const pointsPositions=new Float32Array(36*3);
  for(let i=0;i<36;i++){
    pointsPositions[i*3]=((i*73)%99)/12-4;
    pointsPositions[i*3+1]=((i*47)%83)/14-2.8;
    pointsPositions[i*3+2]=-2.2-(i%9)*.4;
  }
  const dustGeo=new THREE.BufferGeometry();
  dustGeo.setAttribute("position",new THREE.BufferAttribute(pointsPositions,3));
  const dustMat=new THREE.PointsMaterial({color:0xd3a8a5,size:.027,transparent:true,opacity:.44,depthWrite:false});
  const dust=new THREE.Points(dustGeo,dustMat);root.add(dust);
  const flowers=Array.from({length:flowerLimit},(_,i)=>({
    phase:i*1.37,
    size:[.73,.61,.56,.55,.48,.47,.46,.43,.42,.4,.38,.36][i],
    type:i%3,
    x:0,y:0,z:0,
    petals: i%2?8:9,
  }));
  const fallingSpecs=Array.from({length:22},(_,i)=>({
    x:((i*29)%97)/97*2-1,y:((i*41)%83)/83,z:-.5-(i%5)*.25,phase:i*2.2,speed:.12+(i%5)*.03
  }));
  const vec=new THREE.Vector3(), scale=new THREE.Vector3(), quat=new THREE.Quaternion(), rotation=new THREE.Euler(), matrix=new THREE.Matrix4();
  const axisY=new THREE.Vector3(0,1,0);
  let targetStage=.05,stage=.05,elapsed=0,frame=0,pointerX=0,pointerY=0,active=true;
  let width=1,height=1,isMobile=true,visibleScene="prologue";
  function placeFlowers(){
    isMobile=width<720;
    const mobileCoords=[
      [-.67,1.27,-.6],[.55,1.56,-.85],[.02,.9,-1.2],
      [-.91,.12,-1.35],[.96,.46,-1.9],[-.34,1.96,-2.2],
      [.36,2.19,-2.9],[-1.1,-.45,-2.2],[1.13,-.3,-2.3],
      [-.7,2.49,-3],[.72,2.65,-3.2],[.05,2.75,-3]
    ],desktopCoords=[
      [-2.0,1.15,-.7],[2,1.1,-.8],[-.2,1.8,-1.4],
      [-3,0,-1.3],[3.1,.2,-1.5],[-1.25,-.3,-1.8],
      [1.2,-.2,-2.0],[-2.9,2.25,-2.2],[3,2.25,-2.2],
      [0,-.85,-2.4],[-1,2.5,-3],[1.15,2.7,-3]
    ];
    flowers.forEach((f,i)=>{[f.x,f.y,f.z]=(isMobile?mobileCoords:desktopCoords)[i]});
    camera.fov=isMobile?39:39;
    camera.position.set(0,isMobile?.58:.55,isMobile?7.65:8.1);
    camera.updateProjectionMatrix();
  }
  function resize(){
    const rect=canvas.getBoundingClientRect();
    const w=Math.max(1,Math.round(rect.width)),h=Math.max(1,Math.round(rect.height));
    if(w===width&&h===height)return;
    width=w;height=h;renderer.setSize(width,height,false);
    camera.aspect=width/height;camera.updateProjectionMatrix();
    placeFlowers();
  }
  function place(mesh,index,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0){
    vec.set(x,y,z);scale.set(sx,sy,sz);rotation.set(rx,ry,rz);
    quat.setFromEuler(rotation);matrix.compose(vec,quat,scale);
    mesh.setMatrixAt(index,matrix);
  }
  function writeGeometry(){
    const max=Math.min(flowers.length,Math.max(3,quality.flowers||6));
    const counters=[0,0,0];
    let leafIndex=0,stemIndex=0,coreIndex=0;
    flowers.slice(0,max).forEach((f,i)=>{
      const growth=clamp(stage*1.8-i*.04,.13,1);
      const open=clamp((stage-.01)*1.3-i*.018,.17,1);
      const swing=Math.sin(elapsed*.64+f.phase)*.055+pointerX*.065;
      const centerX=f.x+swing,centerY=f.y+Math.sin(elapsed*.57+f.phase)*.045;
      const radius=f.size*(.58+open*.22);
      const ringCount=2;
      for(let ring=0;ring<ringCount;ring++){
        const n=ring===0?f.petals:f.petals-2;
        for(let p=0;p<n;p++){
          const angle=(p/n)*TAU+ring*.22+i*.47;
          const r=ring===0?radius*.49:radius*.22;
          const size=f.size*(ring===0?.95:.70);
          const rot=angle-Math.PI/2;
          const group=petalMeshes[f.type];
          place(group,counters[f.type]++,centerX+Math.cos(angle)*r,centerY+Math.sin(angle)*r,f.z+(ring===0?.05:.18),
            size*(.87+open*.15),size*(.85+open*.2),size,
            .25+(1-open)*.53,Math.sin(angle)*.18,rot);
        }
      }
      place(centers,coreIndex++,centerX,centerY,f.z+.29,f.size*.78,f.size*.78,f.size*.65);
      place(stems,stemIndex++,f.x,centerY-.67*growth,f.z-.12,.7,1.5*growth,.7,0,0,-swing*.1);
      for(let l=0;l<3;l++){
        const side=l%2?-1:1;
        const lx=f.x+side*.22;
        const ly=centerY-.38-l*.26;
        place(leaves,leafIndex++,lx,ly,f.z+.03,
          f.size*.91,f.size*.95,f.size,
          -.18,side*.17,side*(1.05+Math.sin(elapsed*.56+f.phase)*.05));
      }
    });
    petalMeshes.forEach((mesh,i)=>{
      mesh.count=counters[i];
      mesh.instanceMatrix.needsUpdate=true;
    });
    centers.count=coreIndex;leaves.count=leafIndex;stems.count=stemIndex;
    [centers,leaves,stems].forEach(mesh=>mesh.instanceMatrix.needsUpdate=true);
    const fallCount=quality.profile==="high"?18:quality.profile==="medium"?11:6;
    for(let i=0;i<fallCount;i++){
      const f=fallingSpecs[i];
      const y=((f.y*7-elapsed*f.speed)%7+7)%7;
      const x=f.x*(isMobile?2:5)+Math.sin(elapsed*.4+f.phase)*.34;
      const size=.12+(i%3)*.03;
      place(falling,i,x,y-3,f.z,size,size,size,
        Math.sin(elapsed*.55+f.phase)*.4,elapsed*.25+i,elapsed*.33+f.phase);
    }
    falling.count=fallCount;falling.instanceMatrix.needsUpdate=true;
  }
  function update(_now,delta){
    if(!active)return;
    elapsed+=Math.min(.08,delta);
    stage+=(targetStage-stage)*Math.min(1,delta*2.2);
    const floatX=Math.sin(elapsed*.25)*.07+pointerX*.14;
    const floatY=Math.cos(elapsed*.33)*.05-pointerY*.1;
    root.rotation.y+=(floatX-root.rotation.y)*.06;
    root.rotation.x+=(floatY-root.rotation.x)*.06;
    root.position.y=Math.sin(elapsed*.26)*.035;
    pink.intensity=1.65+stage*.8;
    dust.rotation.y+=delta*.009;
    if(frame++%(quality.profile==="low"?3:2)===0)writeGeometry();
    renderer.render(scene,camera);
  }
  function setScene(progress,id=""){
    targetStage=clamp(progress,0,1);
    visibleScene=id;
    const calm=id==="letter"||id==="voice";
    root.visible=!calm;
    if(calm)renderer.render(scene,camera);
  }
  function setPointer(x,y,velocity=0){
    pointerX+=(clamp(x,-1,1)*(1+velocity*.08)-pointerX)*.14;
    pointerY+=(clamp(y,-1,1)-pointerY)*.14;
  }
  function setQuality(next){
    if(!next)return;
    quality={...quality,...next};
    renderer.setPixelRatio(quality.pixelRatio);
    renderer.setSize(width,height,false);
  }
  function setActive(value){active=Boolean(value)}
  function stats(){return{drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,textures:renderer.info.memory.textures}}
  function dispose(){
    [...petalMeshes,leaves,stems,centers,falling].forEach(mesh=>{mesh.geometry=null;mesh.material=null});
    [petalsGeo,leavesGeo,centerGeo,stemGeo,dustGeo,...palette,leafMat,stemMat,middleMat,looseMat,dustMat].forEach(o=>o.dispose());
    renderer.dispose();
  }
  resize();writeGeometry();
  return {update,resize,setScene,setPointer,setQuality,setActive,stats,dispose,renderer};
}
