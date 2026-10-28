// Original implementation. No code from the desktop TopMod project is used.
export const APP_VERSION = '0.5.65';
export const FORMAT_VERSION = 1;
export const add = (a,b) => a.map((x,i)=>x+b[i]);
export const sub = (a,b) => a.map((x,i)=>x-b[i]);
export const mul = (a,s) => a.map(x=>x*s);
export const dot = (a,b) => a.reduce((s,x,i)=>s+x*b[i],0);
export const cross = (a,b) => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export const length = a => Math.hypot(...a);
export function normal(mesh,face) {
  const p=face.vertices.map(id=>mesh.vertices[id]);
  const n=cross(sub(p[1],p[0]),sub(p[2],p[0]));
  const l=length(n);
  if(l<1e-10) throw new Error('Fläche ist degeneriert.');
  return mul(n,1/l);
}
const positive = (x,name,max=1000) => {
  if(typeof x!=='number'||!Number.isFinite(x)||x<0.01||x>max) throw new Error(`${name}: erlaubt sind 0,01 bis ${max}.`);
  return x;
};
const extrusionDistance = x => {
  if(typeof x!=='number'||!Number.isFinite(x)||Math.abs(x)<0.01||Math.abs(x)>1000)throw new Error('Extrusionslänge: erlaubt sind −1000 bis −0,01 oder 0,01 bis 1000. Positiv = außen, negativ = innen.');
  return x;
};
export function cube(step) {
  const {width,height,depth}=step.params;
  const w=positive(width,'Breite')/2,h=positive(height,'Höhe')/2,d=positive(depth,'Tiefe')/2;
  const points=[[-w,-h,-d],[w,-h,-d],[w,h,-d],[-w,h,-d],[-w,-h,d],[w,-h,d],[w,h,d],[-w,h,d]];
  const v=i=>`${step.id}/v${i}`;
  const faces=[['back',[1,0,3,2]],['front',[4,5,6,7]],['left',[0,4,7,3]],['right',[5,1,2,6]],['bottom',[0,1,5,4]],['top',[3,7,6,2]]];
  return {vertices:Object.fromEntries(points.map((p,i)=>[v(i),p])),faces:faces.map(([name,ids])=>({id:`${step.id}/${name}`,vertices:ids.map(v)}))};
}
export const PRIMITIVE_NAMES={cube:'Quader',tetrahedron:'Tetraeder',octahedron:'Oktaeder',icosahedron:'Ikosaeder',prism:'Prisma',dodecahedron:'Dodekaeder',sphere:'Kugel',torus:'Torus',soccerball:'Fußball'};
function validatePrism(params){
  positive(params.size,'Seitenlänge');positive(params.height,'Höhe');
  if(!Number.isInteger(params.sides)||params.sides<3||params.sides>128)throw new Error('Prisma: Seitenzahl muss ganzzahlig zwischen 3 und 128 liegen.');
}
function prism(step){
  validatePrism(step.params);const {sides:n,size,height}=step.params,r=size/(2*Math.sin(Math.PI/n));
  const prefix=`${step.id}/prism/${n}`,v=(ring,i)=>`${prefix}/v/${ring}/${i}`,vertices={},faces=[];
  for(let i=0;i<n;i++){const a=2*Math.PI*i/n;vertices[v(0,i)]=[r*Math.cos(a),-height/2,r*Math.sin(a)];vertices[v(1,i)]=[r*Math.cos(a),height/2,r*Math.sin(a)];}
  faces.push({id:`${prefix}/bottom`,vertices:Array.from({length:n},(_,i)=>v(0,i))},{id:`${prefix}/top`,vertices:Array.from({length:n},(_,i)=>v(1,n-1-i))});
  for(let i=0;i<n;i++){const j=(i+1)%n;faces.push({id:`${prefix}/side/${i}`,vertices:[v(0,i),v(1,i),v(1,j),v(0,j)]});}
  const mesh={vertices,faces};validateMesh(mesh);return mesh;
}
function validateRoundPrimitive(params){
  positive(params.radius,'Radius');
  if(!Number.isInteger(params.segments)||params.segments<3||params.segments>128)throw new Error('Umfangssegmente: ganze Zahl von 3 bis 128.');
  const min=params.kind==='sphere'?2:3;
  if(!Number.isInteger(params.rings)||params.rings<min||params.rings>128)throw new Error(`Querschnitts-/Höhenabschnitte: ganze Zahl von ${min} bis 128.`);
  if(params.kind==='torus'){
    positive(params.tubeRadius,'Rohr-Radius');
    if(params.tubeRadius>=params.radius)throw new Error('Torus: Rohr-Radius muss kleiner als Ringradius sein, damit die Öffnung frei bleibt.');
  }
}
function spherePrimitive(step){
  validateRoundPrimitive(step.params);const {radius:r,segments:n,rings:m}=step.params,prefix=`${step.id}/sphere/${n}/${m}`,v=(i,j)=>`${prefix}/v/${i}/${j}`,north=`${prefix}/north`,south=`${prefix}/south`,vertices={[north]:[0,r,0],[south]:[0,-r,0]},faces=[];
  for(let i=1;i<m;i++)for(let j=0;j<n;j++){const a=Math.PI*i/m,b=2*Math.PI*j/n;vertices[v(i,j)]=[r*Math.sin(a)*Math.cos(b),r*Math.cos(a),r*Math.sin(a)*Math.sin(b)];}
  for(let j=0;j<n;j++){const k=(j+1)%n;faces.push({id:`${prefix}/top/${j}`,vertices:[north,v(1,k),v(1,j)]});for(let i=1;i<m-1;i++)faces.push({id:`${prefix}/band/${i}/${j}`,vertices:[v(i,j),v(i,k),v(i+1,k),v(i+1,j)]});faces.push({id:`${prefix}/bottom/${j}`,vertices:[south,v(m-1,j),v(m-1,k)]});}
  const mesh={vertices,faces};validateMesh(mesh);return mesh;
}
function torusPrimitive(step){
  validateRoundPrimitive(step.params);const {radius:R,tubeRadius:r,segments:n,rings:m}=step.params,prefix=`${step.id}/torus/${n}/${m}`,v=(i,j)=>`${prefix}/v/${i}/${j}`,vertices={},faces=[];
  for(let i=0;i<n;i++)for(let j=0;j<m;j++){const a=2*Math.PI*i/n,b=2*Math.PI*j/m,d=R+r*Math.cos(b);vertices[v(i,j)]=[d*Math.cos(a),r*Math.sin(b),d*Math.sin(a)];}
  for(let i=0;i<n;i++)for(let j=0;j<m;j++)faces.push({id:`${prefix}/face/${i}/${j}`,vertices:[v(i,j),v(i,(j+1)%m),v((i+1)%n,(j+1)%m),v((i+1)%n,j)]});
  const mesh={vertices,faces};validateMesh(mesh);return mesh;
}
function polyhedronPrimitive(step){
  const {kind,size}=step.params;positive(size,'Kantenlänge');
  const seed=primitive({id:'sseed',params:{kind:'icosahedron',size:3}});
  const mesh=kind==='dodecahedron'?dual(seed,{id:'sderived',params:{scale:1}}):truncate(seed,{id:'sderived',params:{amount:1/3}});
  const first=mesh.faces[0].vertices,edge=length(sub(mesh.vertices[first[0]],mesh.vertices[first[1]])),scale=size/edge,ids=Object.keys(mesh.vertices).sort(),renamed=new Map(ids.map((v,i)=>[v,`${step.id}/${kind}/v${i}`]));
  const result={vertices:Object.fromEntries(ids.map(v=>[renamed.get(v),mul(mesh.vertices[v],scale)])),faces:[...mesh.faces].sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0).map((f,i)=>({id:`${step.id}/${kind}/f${i}`,vertices:f.vertices.map(v=>renamed.get(v))}))};
  validateMesh(result);return result;
}
export function primitive(step) {
  if(step.params.kind==='prism')return prism(step);
  if(step.params.kind==='sphere')return spherePrimitive(step);
  if(step.params.kind==='torus')return torusPrimitive(step);
  if(['dodecahedron','soccerball'].includes(step.params.kind))return polyhedronPrimitive(step);
  const {kind,size}=step.params;positive(size,'Kantenlänge');
  let points;
  if(kind==='tetrahedron')points=[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]];
  else if(kind==='octahedron')points=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
  else if(kind==='icosahedron'){
    const phi=(1+Math.sqrt(5))/2;points=[];
    for(const a of [-1,1])for(const b of [-phi,phi])points.push([0,a,b],[a,b,0],[b,0,a]);
  }else throw new Error('Unbekannter Grundkörper.');
  // Each triangular supporting plane of these three convex solids is one face.
  // Enumerate by vertex ancestry so size changes preserve references.
  const edge=Math.min(...points.flatMap((a,i)=>points.slice(i+1).map(b=>length(sub(a,b)))));
  const v=i=>`${step.id}/${kind}/v${i}`,faces=[];
  for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++)for(let k=j+1;k<points.length;k++){
    const n=cross(sub(points[j],points[i]),sub(points[k],points[i]));if(length(n)<1e-10)continue;
    const distances=points.filter((_,q)=>q!==i&&q!==j&&q!==k).map(p=>dot(n,sub(p,points[i])));
    if(!distances.every(d=>d<-1e-9)&&!distances.every(d=>d>1e-9))continue;
    const ids=dot(n,points[i])>0?[i,j,k]:[i,k,j];
    faces.push({id:`${step.id}/${kind}/f${i}-${j}-${k}`,vertices:ids.map(v)});
  }
  const mesh={vertices:Object.fromEntries(points.map((p,i)=>[v(i),mul(p,size/edge)])),faces};
  validateMesh(mesh);return mesh;
}
export function extrude(mesh,step) {
  const distance=extrusionDistance(step.params.distance);
  validateExtrudeTransform(step.params);
  const face=mesh.faces.find(f=>f.id===step.target);
  if(!face) throw new Error('Bezugsfläche fehlt. Fläche neu zuordnen oder vorherigen Schritt aktivieren.');
  const n=normal(mesh,face),vertices={...mesh.vertices};
  const cap=face.vertices.map((v,i)=>{
    const id=`${step.id}/v${i}`;
    vertices[id]=add(vertices[v],mul(n,distance));
    return id;
  });
  const sides=face.vertices.map((a,i)=>{
    const j=(i+1)%cap.length;
    return {id:`${step.id}/side/${i}`,vertices:[a,face.vertices[j],cap[j],cap[i]]};
  });
  const result={vertices,faces:[...mesh.faces.filter(f=>f.id!==face.id),...sides,{id:`${step.id}/cap`,vertices:cap}]};
  return (step.params.scale??1)!==1||(step.params.angle??0)!==0?transformFace(result,{target:`${step.id}/cap`,params:{scale:step.params.scale??1,angle:step.params.angle??0}}):result;
}
function validateExtrudeTransform(params){validateFaceTransform({scale:params.scale===undefined?1:params.scale,angle:params.angle===undefined?0:params.angle});}
export function packFaceGroups(faces){const blocks=[];for(let i=0;i<faces.length;i+=32)blocks.push(faces.slice(i,i+32));const groups=[];for(let i=0;i<blocks.length;i+=32)groups.push(blocks.slice(i,i+32));return groups;}
function validateGroupExtrude(params){
  extrusionDistance(params.distance);validateExtrudeTransform(params);
  const groups=params.groups;
  if(!Array.isArray(groups)||!groups.length||groups.length>32||groups.some(g=>!Array.isArray(g)||!g.length||g.length>32||g.some(b=>!Array.isArray(b)||!b.length||b.length>32||b.some(id=>typeof id!=='string'||!id.length||id.length>160))))throw new Error('Ungültige Flächengruppe für Extrusion.');
  const ids=groups.flat(2);if(ids.length>32000||new Set(ids).size!==ids.length)throw new Error('Extrusion benötigt eindeutige Flächen (maximal 32.000).');
}
export function extrudeGroup(mesh,step){
  validateGroupExtrude(step.params);validateMesh(mesh);const ids=step.params.groups.flat(2),byFace=new Map(mesh.faces.map(f=>[f.id,f]));
  if(ids.some(id=>!byFace.has(id)))throw new Error('Extrusionsfläche fehlt. Gruppe vor diesem Schritt neu auswählen und zuordnen.');
  const corners=ids.reduce((n,id)=>n+byFace.get(id).vertices.length,0);
  if(mesh.faces.length+corners>SUBDIVISION_FACE_LIMIT||Object.keys(mesh.vertices).length+corners>64000)throw new Error('Gruppenextrusion überschreitet 32.000 Flächen oder 64.000 Punkte.');
  let result=mesh;for(const id of ids)result=extrude(result,{id:`${step.id}/batch/${ancestryHash(JSON.stringify(id))}`,target:id,params:{distance:step.params.distance,...(step.params.scale!==undefined?{scale:step.params.scale}:{}),...(step.params.angle!==undefined?{angle:step.params.angle}:{})}});
  validateMesh(result);return result;
}
function validateRegionExtrude(params){
  validateGroupExtrude(params);
  const d=[params.nx,params.ny,params.nz];if(d.some(v=>typeof v!=='number'||!Number.isFinite(v)||Math.abs(v)>1000)||length(d)<1e-8)throw new Error('Regionsextrusion: eine Richtung X/Y/Z ungleich null angeben (±1000).');
}
export function regionExtrudeCaps(step){return step.params.groups.flat(2).map(id=>`${step.id}/region/cap/${ancestryHash(JSON.stringify(id))}`);}
export function regionDirection(mesh,ids){
  const selected=new Set(ids);let sum=[0,0,0];
  for(const f of mesh.faces)if(selected.has(f.id)){const p=f.vertices.map(v=>mesh.vertices[v]);for(let i=0;i<p.length;i++)sum=add(sum,cross(sub(p[i],p[0]),sub(p[(i+1)%p.length],p[0])));}
  if(length(sum)<1e-8)throw new Error('Keine gemeinsame Extrusionsrichtung. Eine offene Flächenregion auswählen.');return mul(sum,1/length(sum));
}
export function extrudeRegion(mesh,step){
  validateRegionExtrude(step.params);validateMesh(mesh);
  const selected=new Set(step.params.groups.flat(2)),patch=mesh.faces.filter(f=>selected.has(f.id));
  if(patch.length!==selected.size)throw new Error('Extrusionsfläche fehlt. Region vor diesem Schritt neu zuordnen.');
  if(faceComponents(patch).length!==1)throw new Error('Regionsextrusion benötigt über Kanten zusammenhängende Flächen.');
  const direction=[step.params.nx,step.params.ny,step.params.nz],delta=mul(direction,step.params.distance/length(direction));
  if(patch.some(f=>dot(normal(mesh,f),mul(direction,1/length(direction)))<=1e-8))throw new Error('Extrusionsrichtung muss aus allen ausgewählten Flächen herauszeigen. Region verkleinern oder Richtung ändern.');
  const edges=new Map();for(const f of patch)for(let i=0;i<f.vertices.length;i++){const a=f.vertices[i],b=f.vertices[(i+1)%f.vertices.length],key=JSON.stringify([a,b].sort());if(!edges.has(key))edges.set(key,[]);edges.get(key).push({a,b,key});}
  const boundary=[...edges.values()].filter(es=>es.length===1).map(es=>es[0]),incoming=new Set(),outgoing=new Set();
  if(!boundary.length)throw new Error('Regionsextrusion benötigt einen offenen Rand.');
  for(const {a,b} of boundary){if(outgoing.has(a)||incoming.has(b))throw new Error('Regionsrand verzweigt sich oder berührt sich an einem Punkt. Auswahl ändern.');outgoing.add(a);incoming.add(b);}
  if(mesh.faces.length+boundary.length>SUBDIVISION_FACE_LIMIT||Object.keys(mesh.vertices).length+new Set(patch.flatMap(f=>f.vertices)).size>64000)throw new Error('Regionsextrusion überschreitet 32.000 Flächen oder 64.000 Punkte.');
  const vertices={...mesh.vertices},ids=new Map(),generated=new Set(mesh.faces.map(f=>f.id));
  for(const v of new Set(patch.flatMap(f=>f.vertices))){const id=`${step.id}/region/v/${ancestryHash(JSON.stringify(v))}`;if(Object.hasOwn(vertices,id))throw new Error('Kollision der Regionspunkte.');ids.set(v,id);vertices[id]=add(mesh.vertices[v],delta);}
  const identify=(kind,source)=>{const id=`${step.id}/region/${kind}/${ancestryHash(JSON.stringify(source))}`;if(generated.has(id))throw new Error('Kollision der Regionsflächen.');generated.add(id);return id;};
  const caps=patch.map(f=>({id:identify('cap',f.id),vertices:f.vertices.map(v=>ids.get(v))})),sides=boundary.sort((a,b)=>a.key.localeCompare(b.key)).map(({a,b,key})=>({id:identify('side',key),vertices:[a,b,ids.get(b),ids.get(a)]}));
  const result=pruneMesh({vertices},[...mesh.faces.filter(f=>!selected.has(f.id)),...sides,...caps]);validateMesh(result);return result;
}
export function groupExtrudeCaps(step){return step.params.groups.flat(2).map(id=>`${step.id}/batch/${ancestryHash(JSON.stringify(id))}/cap`);}
function validatePartGroups(params){try{validateGroupExtrude({groups:params.groups,distance:1});}catch{throw new Error('Eine gültige eindeutige Auswahl für Trennen/Löschen angeben.');}}
function faceComponents(faces){
  const edges=new Map(),neighbors=new Map(faces.map(f=>[f.id,new Set()])),byFace=new Map(faces.map(f=>[f.id,f]));
  for(const f of faces)for(let i=0;i<f.vertices.length;i++){const key=JSON.stringify([f.vertices[i],f.vertices[(i+1)%f.vertices.length]].sort());if(!edges.has(key))edges.set(key,[]);edges.get(key).push(f.id);}
  for(const ids of edges.values())for(const a of ids)for(const b of ids)if(a!==b)neighbors.get(a).add(b);
  const seen=new Set(),parts=[];for(const f of faces){if(seen.has(f.id))continue;const stack=[f.id],part=[];seen.add(f.id);while(stack.length){const id=stack.pop();part.push(byFace.get(id));for(const next of neighbors.get(id))if(!seen.has(next)){seen.add(next);stack.push(next);}}parts.push(part);}return parts;
}
const pruneMesh=(mesh,faces)=>{const used=new Set(faces.flatMap(f=>f.vertices));return {vertices:Object.fromEntries(Object.entries(mesh.vertices).filter(([id])=>used.has(id))),faces};};
export function removeParts(mesh,step){
  validatePartGroups(step.params);validateMesh(mesh);const seeds=new Set(step.params.groups.flat(2));if([...seeds].some(v=>!Object.hasOwn(mesh.vertices,v)))throw new Error('Bezugspunkt des Körperteils fehlt. Auswahl neu zuordnen.');
  const parts=faceComponents(mesh.faces),keep=parts.filter(part=>!part.some(f=>f.vertices.some(v=>seeds.has(v))));
  if(keep.length===parts.length)throw new Error('Kein zusammenhängender Körperteil ausgewählt.');if(!keep.length)throw new Error('Mindestens ein Körperteil muss erhalten bleiben. Zuerst trennen oder die Auswahl verkleinern.');
  const result=pruneMesh(mesh,keep.flat());validateMesh(result);return result;
}
export function splitFaceBand(mesh,step){
  validatePartGroups(step.params);validateMesh(mesh);
  const selected=new Set(step.params.groups.flat(2)),existing=new Set(mesh.faces.map(f=>f.id));if([...selected].some(id=>!existing.has(id)))throw new Error('Fläche des Trennrings fehlt. Ring vor dem Schritt neu zuordnen.');
  const components=faceComponents(mesh.faces),affected=components.filter(part=>part.some(f=>selected.has(f.id)));
  if(affected.length!==1)throw new Error('Den Flächenring auf genau einem Körper auswählen. Andere Körper werden unverändert erhalten.');
  const source=affected[0],sourceIds=new Set(source.map(f=>f.id)),untouched=mesh.faces.filter(f=>!sourceIds.has(f.id));
  const kept=source.filter(f=>!selected.has(f.id)),parts=faceComponents(kept);if(!parts.length)throw new Error('Mindestens eine Fläche des betroffenen Körpers muss erhalten bleiben.');
  const faces=[...untouched],owners=new Map(),ids=new Set(existing);
  for(let partIndex=0;partIndex<parts.length;partIndex++){
    const part=parts[partIndex],edges=new Map();for(const f of part)for(let i=0;i<f.vertices.length;i++){const a=f.vertices[i],b=f.vertices[(i+1)%f.vertices.length],key=JSON.stringify([a,b].sort());if(!edges.has(key))edges.set(key,[]);edges.get(key).push({a,b});}
    const used=new Set(part.flatMap(f=>f.vertices));for(const v of used){if(owners.has(v)&&owners.get(v)!==partIndex)throw new Error('Die Teile berühren sich noch an Punkten. Einen vollständigen Flächenstreifen auswählen.');owners.set(v,partIndex);}
    const boundary=[...edges.values()].filter(e=>e.length===1).map(e=>e[0]),next=new Map(),incoming=new Set();
    for(const {a,b} of boundary){if(next.has(b)||incoming.has(a))throw new Error('Trennrand verzweigt sich. Vollständigen Flächenring auswählen.');next.set(b,a);incoming.add(a);}
    if(!boundary.length||[...next.keys()].some(v=>!incoming.has(v)))throw new Error('Kein geschlossener Schnittendrand gefunden.');
    faces.push(...part);const remaining=new Set([...next.keys()].sort());
    while(remaining.size){
    const start=remaining.values().next().value,ring=[];let v=start;do{if(!remaining.has(v)||!next.has(v))throw new Error('Ungültiger Schnittendrand.');ring.push(v);remaining.delete(v);v=next.get(v);}while(v!==start);
    let ordered=null,n=null;for(let i=0;i<ring.length;i++){const r=[...ring.slice(i),...ring.slice(0,i)];try{n=normal(mesh,{vertices:r});ordered=r;break;}catch{}}
    if(!ordered)throw new Error('Schnittende ist degeneriert.');const points=ordered.map(id=>mesh.vertices[id]),scale=Math.max(...points.map(p=>length(sub(p,points[0])))),tol=Math.max(1e-9,scale*1e-7);
    if(points.some(p=>Math.abs(dot(n,sub(p,points[0])))>tol))throw new Error('Schnittenden müssen eben sein. Anderen Flächenring wählen.');
    for(let i=0;i<points.length;i++){const a=points[i],edge=sub(points[(i+1)%points.length],a),inward=cross(n,edge);if(points.some(p=>dot(inward,sub(p,a)) < -tol*length(edge)))throw new Error('Schnittenden müssen konvex sein.');}
    const id=`${step.id}/cut/cap/${ancestryHash(JSON.stringify([...ring].sort()))}`;if(ids.has(id))throw new Error('Kollision der Schnittflächenreferenzen.');ids.add(id);faces.push({id,vertices:ordered});
    }
  }
  if(faces.length>SUBDIVISION_FACE_LIMIT)throw new Error('Trennen überschreitet 32.000 Flächen.');const result=pruneMesh(mesh,faces);validateMesh(result);return result;
}
const center = (mesh,face) => mul(face.vertices.map(v=>mesh.vertices[v]).reduce(add,[0,0,0]),1/face.vertices.length);
function validateFaceTransform(params) {
  if(typeof params.scale!=='number'||!Number.isFinite(params.scale)||params.scale<.05||params.scale>10)throw new Error('Skalierung: erlaubt sind Faktoren von 0,05 bis 10.');
  if(typeof params.angle!=='number'||!Number.isFinite(params.angle)||params.angle< -180||params.angle>180)throw new Error('Drehwinkel: erlaubt sind −180 bis 180 Grad.');
}
export function transformFace(mesh,step) {
  validateFaceTransform(step.params);
  const face=mesh?.faces.find(f=>f.id===step.target);
  if(!face)throw new Error('Bezugsfläche fehlt. Fläche neu zuordnen oder vorherigen Schritt aktivieren.');
  const {scale,angle}=step.params,vertices={...mesh.vertices};
  if(scale!==1||angle!==0){
    const pivot=center(mesh,face),axis=normal(mesh,face),radians=angle*Math.PI/180,c=Math.cos(radians),s=Math.sin(radians);
    // Rodrigues rotation around the input face normal. Shared boundary vertices
    // move once; connectivity and all vertex/face identifiers remain unchanged.
    for(const id of face.vertices){
      const offset=mul(sub(mesh.vertices[id],pivot),scale);
      vertices[id]=add(pivot,add(add(mul(offset,c),mul(cross(axis,offset),s)),mul(axis,dot(axis,offset)*(1-c))));
    }
  }
  const next={vertices,faces:mesh.faces};validateMesh(next);return next;
}
export function bridgePair(mesh,targets) {
  if(!mesh||!Array.isArray(targets)||targets.length!==2||targets[0]===targets[1]) throw new Error('Zwei unterschiedliche Flächen auswählen.');
  const faces=targets.map(id=>mesh.faces.find(f=>f.id===id));
  if(faces.some(f=>!f)) throw new Error('Bezugsfläche der Brücke fehlt. Das Flächenpaar neu zuordnen.');
  if(faces[0].vertices.length!==faces[1].vertices.length||![3,4].includes(faces[0].vertices.length)) throw new Error('Gerade Brücken benötigen zwei Dreiecke oder zwei Vierecke. Unterschiedliche Eckenzahlen werden noch nicht unterstützt.');
  if(faces[0].vertices.some(id=>faces[1].vertices.includes(id))) throw new Error('Die Flächen dürfen keine gemeinsamen Eckpunkte besitzen.');
  const [a,b]=faces,delta=sub(center(mesh,b),center(mesh,a)),distance=length(delta);
  if(distance<0.01) throw new Error('Die Flächen liegen zu dicht beieinander.');
  const na=normal(mesh,a),nb=normal(mesh,b),ca=center(mesh,a),cb=center(mesh,b);
  if(dot(na,nb)>-0.9) throw new Error('Die Flächen müssen mit ihren Außenseiten annähernd parallel zueinander zeigen. Seitlicher Versatz ist erlaubt.');
  const gapA=Math.min(...b.vertices.map(id=>dot(sub(mesh.vertices[id],ca),na)));
  const gapB=Math.min(...a.vertices.map(id=>dot(sub(mesh.vertices[id],cb),nb)));
  if(gapA<0.01-1e-9||gapB<0.01-1e-9) throw new Error('Die Flächenebenen müssen mit positivem Abstand aufeinander zu zeigen. Koplanare oder voneinander wegzeigende Flächen sind nicht geeignet.');
  return faces;
}
export function mixedBridgePair(mesh,targets) {
  if(!mesh||!Array.isArray(targets)||targets.length!==2||targets[0]===targets[1]) throw new Error('Zwei unterschiedliche Flächen auswählen.');
  const faces=targets.map(id=>mesh.faces.find(f=>f.id===id));
  if(faces.some(f=>!f)) throw new Error('Bezugsfläche der Brücke fehlt. Das Flächenpaar neu zuordnen.');
  if(![3,4].includes(faces[0].vertices.length)||![3,4].includes(faces[1].vertices.length)||faces[0].vertices.length===faces[1].vertices.length) throw new Error('Gemischte Brücken benötigen ein Dreieck und ein Viereck.');
  if(faces[0].vertices.some(id=>faces[1].vertices.includes(id))) throw new Error('Die Flächen dürfen keine gemeinsamen Eckpunkte besitzen.');
  const [a,b]=faces,delta=sub(center(mesh,b),center(mesh,a)),distance=length(delta);
  if(distance<0.01) throw new Error('Die Flächen liegen zu dicht beieinander.');
  const na=normal(mesh,a),nb=normal(mesh,b),ca=center(mesh,a),cb=center(mesh,b);
  if(dot(na,nb)>-0.9) throw new Error('Die Flächen müssen mit ihren Außenseiten annähernd parallel zueinander zeigen. Seitlicher Versatz ist erlaubt.');
  const gapA=Math.min(...b.vertices.map(id=>dot(sub(mesh.vertices[id],ca),na)));
  const gapB=Math.min(...a.vertices.map(id=>dot(sub(mesh.vertices[id],cb),nb)));
  if(gapA<0.01-1e-9||gapB<0.01-1e-9) throw new Error('Die Flächenebenen müssen mit positivem Abstand aufeinander zu zeigen. Koplanare oder voneinander wegzeigende Flächen sind nicht geeignet.');
  return faces;
}
// Ear clipping in the polygon's dominant (Newell) projection. For a warped
// polygon the chosen diagonals define a piecewise planar cutting surface.
function triangulateCutFace(mesh,face,eps){
  const ring=face.vertices.map(v=>mesh.vertices[v]),area=ring.reduce((sum,v,i)=>add(sum,cross(sub(v,ring[0]),sub(ring[(i+1)%ring.length],ring[0]))),[0,0,0]);
  if(length(area)<eps*eps)throw new Error('Schnittfläche ist entartet und lässt sich nicht triangulieren.');
  const n=mul(area,1/length(area)),indices=ring.map((_,i)=>i),out=[];let work=0;
  const turn=(a,b,c)=>dot(cross(sub(b,a),sub(c,a)),n);
  // Reject projected self-crossings instead of silently choosing a folded patch.
  const drop=n.map(Math.abs).indexOf(Math.max(...n.map(Math.abs))),axes=[0,1,2].filter(k=>k!==drop),xy=ring.map(p=>axes.map(k=>p[k])),orient=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
  for(let i=0;i<ring.length;i++)for(let j=i+1;j<ring.length;j++){
    if(++work>1500000)throw new Error('Fläche zu komplex für automatische Triangulierung.');
    if(j===i+1||(i===0&&j===ring.length-1))continue;
    const a=xy[i],b=xy[(i+1)%ring.length],c=xy[j],d=xy[(j+1)%ring.length];
    if(orient(a,b,c)*orient(a,b,d)<-(eps**4)&&orient(c,d,a)*orient(c,d,b)<-(eps**4))throw new Error('Schnittfläche überschneidet sich in der Projektion.');
  }
  while(indices.length>3){let found=false;
    for(let i=0;i<indices.length;i++){
      if(++work>1500000)throw new Error('Fläche zu komplex für automatische Triangulierung.');
      const ia=indices[(i+indices.length-1)%indices.length],ib=indices[i],ic=indices[(i+1)%indices.length],a=ring[ia],b=ring[ib],c=ring[ic];if(turn(a,b,c)<=eps*eps)continue;
      if(indices.some(j=>{if(++work>1500000)throw new Error('Fläche zu komplex für automatische Triangulierung.');return j!==ia&&j!==ib&&j!==ic&&turn(a,b,ring[j])>=-eps*eps&&turn(b,c,ring[j])>=-eps*eps&&turn(c,a,ring[j])>=-eps*eps;}))continue;
      out.push([ia,ib,ic].map(j=>face.vertices[j]));indices.splice(i,1);found=true;break;
    }
    if(!found)throw new Error('Fläche lässt sich nicht eindeutig triangulieren.');
  }
  if(turn(...indices.map(j=>ring[j]))<=eps*eps)throw new Error('Triangulierung erzeugt eine entartete Fläche.');out.push(indices.map(j=>face.vertices[j]));return out;
}
// Bounded BSP solid difference. All working polygons are convex and oriented.
function solidDifference(mesh,cutter,step){
  validateMesh(mesh);validateMesh(cutter);
  const bounds=viewBounds([...Object.values(mesh.vertices),...Object.values(cutter.vertices)]),eps=Math.max(1e-8,bounds.radius*1e-8);let work=0;
  const tick=()=>{if(++work>1500000)throw new Error('Volumenschnitt zu komplex. Gröberes Netz oder einfacheren Schnitt verwenden.');};
  const plane=vs=>{for(let i=1;i<vs.length-1;i++){const n=cross(sub(vs[i],vs[0]),sub(vs[i+1],vs[0]));if(length(n)>eps*eps){const unit=mul(n,1/length(n));return {n:unit,w:dot(unit,vs[0])};}}return null;};
  const polygon=(vs,source)=>{const p=plane(vs);return p?{vs,source,plane:p}:null;};
  const flip=p=>({vs:[...p.vs].reverse(),source:p.source,plane:{n:mul(p.plane.n,-1),w:-p.plane.w}});
  const split=(cut,p,cf,cb,front,back)=>{tick();const types=p.vs.map(v=>{const d=dot(cut.n,v)-cut.w;return d>eps?1:d<-eps?2:0;}),type=types.reduce((a,b)=>a|b,0);
    if(type===0){(dot(cut.n,p.plane.n)>0?cf:cb).push(p);return;}if(type===1){front.push(p);return;}if(type===2){back.push(p);return;}
    const f=[],b=[];for(let i=0;i<p.vs.length;i++){const j=(i+1)%p.vs.length,a=p.vs[i],v=p.vs[j],ta=types[i],tb=types[j];if(ta!==2)f.push(a);if(ta!==1)b.push(a);if((ta|tb)===3){const t=(cut.w-dot(cut.n,a))/dot(cut.n,sub(v,a)),q=add(a,mul(sub(v,a),t));f.push(q);b.push(q);}}
    const fp=polygon(f,p.source),bp=polygon(b,p.source);if(fp)front.push(fp);if(bp)back.push(bp);
  };
  class Node{
    constructor(polys=[],depth=0){if(depth>400)throw new Error('Volumenschnitt benötigt ein einfacheres Netz.');this.depth=depth;this.polys=[];this.front=null;this.back=null;this.plane=null;if(polys.length)this.build(polys);}
    build(polys){if(!polys.length)return;tick();if(!this.plane)this.plane=polys[Math.floor(polys.length/2)].plane;const f=[],b=[];for(const p of polys)split(this.plane,p,this.polys,this.polys,f,b);if(f.length){if(!this.front)this.front=new Node([],this.depth+1);this.front.build(f);}if(b.length){if(!this.back)this.back=new Node([],this.depth+1);this.back.build(b);}}
    invert(){this.polys=this.polys.map(flip);if(this.plane)this.plane={n:mul(this.plane.n,-1),w:-this.plane.w};if(this.front)this.front.invert();if(this.back)this.back.invert();[this.front,this.back]=[this.back,this.front];}
    clip(polys){if(!this.plane)return polys;let f=[],b=[];for(const p of polys)split(this.plane,p,f,b,f,b);if(this.front)f=this.front.clip(f);if(this.back)b=this.back.clip(b);else b=[];return [...f,...b];}
    clipTo(other){this.polys=other.clip(this.polys);if(this.front)this.front.clipTo(other);if(this.back)this.back.clipTo(other);}
    all(){return [...this.polys,...(this.front?this.front.all():[]),...(this.back?this.back.all():[])];}
  }
  const triangles=input=>input.faces.flatMap(face=>{
    const ring=face.vertices.map(v=>input.vertices[v]),area=ring.reduce((sum,v,i)=>add(sum,cross(sub(v,ring[0]),sub(ring[(i+1)%ring.length],ring[0]))),[0,0,0]);if(length(area)<eps*eps)throw new Error('Volumenschnitt: degenerierte Fläche.');const n=mul(area,1/length(area)),scale=Math.max(...ring.map(v=>length(sub(v,ring[0]))));
    if(ring.some(v=>Math.abs(dot(n,sub(v,ring[0])))>Math.max(eps*4,scale*1e-6))){if(step.triangulateInput)return triangulateCutFace(input,face,eps).map(ids=>polygon(ids.map(id=>input.vertices[id]),face.id));throw new Error('Volumenschnitt benötigt ebene Flächen. Nicht ebene Flächen vorher triangulieren.');}
    const indices=ring.map((_,i)=>i),out=[];let guard=0;
    while(indices.length>3){let found=false;for(let i=0;i<indices.length;i++){const ia=indices[(i+indices.length-1)%indices.length],ib=indices[i],ic=indices[(i+1)%indices.length],a=ring[ia],b=ring[ib],c=ring[ic],area=dot(cross(sub(b,a),sub(c,a)),n);if(area<=eps*eps)continue;
      const inside=q=>dot(cross(sub(b,a),sub(q,a)),n)>=-eps*eps&&dot(cross(sub(c,b),sub(q,b)),n)>=-eps*eps&&dot(cross(sub(a,c),sub(q,c)),n)>=-eps*eps;
      if(indices.some(j=>j!==ia&&j!==ib&&j!==ic&&inside(ring[j])))continue;out.push(polygon([a,b,c],face.id));indices.splice(i,1);found=true;break;}
      if(!found||++guard>ring.length)throw new Error('Fläche lässt sich nicht eindeutig triangulieren. Schnitt nicht angewendet.');
    }const last=polygon(indices.map(i=>ring[i]),face.id);if(last)out.push(last);return out;
  });
  const a=new Node(triangles(mesh)),b=new Node(triangles(cutter));a.invert();a.clipTo(b);b.clipTo(a);b.invert();b.clipTo(a);b.invert();a.build(b.all());a.invert();const polys=a.all();
  if(!polys.length)throw new Error('Der Schnitt würde das ganze Modell entfernen.');if(polys.length>32000)throw new Error('Volumenschnitt überschreitet 32.000 Flächen.');
  const vertices={},buckets=new Map(),origin=bounds.center;
  const register=(p,preferred)=>{const cell=p.map((v,i)=>Math.round((v-origin[i])/eps)),key=cell.join(',');for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)for(let z=-1;z<=1;z++){const list=buckets.get([cell[0]+x,cell[1]+y,cell[2]+z].join(','))||[];for(const id of list)if(length(sub(vertices[id],p))<=eps*2)return id;}
    const id=preferred||`${step.id}/solid/v/${ancestryHash(key)}`;if(Object.hasOwn(vertices,id))throw new Error('Kollision der Schnittpunkte.');vertices[id]=p;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(id);return id;};
  for(const [id,p] of Object.entries(mesh.vertices))register(p,id);
  let faces=polys.map(p=>({source:p.source,vertices:p.vs.map(v=>register(v))}));
  const used=new Set(faces.flatMap(f=>f.vertices));for(const id of Object.keys(vertices))if(!used.has(id))delete vertices[id];
  if(used.size>64000||used.size*faces.reduce((n,f)=>n+f.vertices.length,0)>12000000)throw new Error('Schnittnetz zu komplex für sichere Kantenverbindung.');
  // Split all T-junctions so both incident faces share identical edge chains.
  const points=Object.entries(vertices);faces=faces.map(f=>{let ring=[];for(let i=0;i<f.vertices.length;i++){const a=f.vertices[i],b=f.vertices[(i+1)%f.vertices.length],pa=vertices[a],edge=sub(vertices[b],pa),span2=dot(edge,edge);if(span2<=eps*eps)continue;const extra=[];for(const [id,p] of points){if(id===a||id===b)continue;const t=dot(sub(p,pa),edge)/span2;if(t>eps/Math.sqrt(span2)&&t<1-eps/Math.sqrt(span2)&&length(sub(p,add(pa,mul(edge,t))))<=eps*3)extra.push({id,t});}extra.sort((a,b)=>a.t-b.t);ring.push(a,...extra.map(x=>x.id));}
    ring=ring.filter((v,i)=>v!==ring[(i+ring.length-1)%ring.length]);if(new Set(ring).size!==ring.length)throw new Error('Schnitt erzeugt einen mehrdeutigen Rand. Position oder Lochgröße leicht ändern.');
    let ordered=null;for(let i=0;i<ring.length;i++){const r=[...ring.slice(i),...ring.slice(0,i)];try{normal({vertices},{vertices:r});ordered=r;break;}catch{}}if(!ordered)return null;return {source:f.source,vertices:ordered};}).filter(Boolean);
  const occurrences=new Map();faces=faces.map(f=>{const index=occurrences.get(f.source)||0;occurrences.set(f.source,index+1);return {id:`${step.id}/solid/f/${ancestryHash(JSON.stringify([f.source,index]))}`,vertices:f.vertices};});
  const result=pruneMesh({vertices},faces);validateMesh(result);return result;
}
function convexCutter(points,prefix){
  const vertices=Object.fromEntries(points.map((p,i)=>[`${prefix}/v${i}`,p])),ids=Object.keys(vertices),planes=new Map(),span=viewBounds(points).radius,eps=Math.max(1e-8,span*1e-8);
  for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++)for(let k=j+1;k<points.length;k++){let n=cross(sub(points[j],points[i]),sub(points[k],points[i]));if(length(n)<eps*eps)continue;n=mul(n,1/length(n));let d=dot(n,points[i]),dist=points.map(p=>dot(n,p)-d);if(dist.every(x=>x<=eps)){}else if(dist.every(x=>x>=-eps)){n=mul(n,-1);d=-d;dist=dist.map(x=>-x);}else continue;
    const on=ids.filter((_,q)=>Math.abs(dist[q])<=eps),key=[...on].sort().join('|');if(planes.has(key))continue;const c=mul(on.map(id=>vertices[id]).reduce(add,[0,0,0]),1/on.length),axis=mul(sub(vertices[on[0]],c),1/length(sub(vertices[on[0]],c))),other=cross(n,axis);on.sort((a,b)=>Math.atan2(dot(sub(vertices[a],c),other),dot(sub(vertices[a],c),axis))-Math.atan2(dot(sub(vertices[b],c),other),dot(sub(vertices[b],c),axis)));planes.set(key,{id:`${prefix}/face/${ancestryHash(key)}`,vertices:on});
  }const result={vertices,faces:[...planes.values()]};validateMesh(result);return result;
}
function validatePunchParams(params){
  validatePartGroups(params);if(params.groups.flat(2).length>128)throw new Error('Loch stanzen: höchstens 128 Startflächen pro Schritt wählen.');
}
// Nearest inward ray hit only: never skip an intervening wall to find an easier exit.
export function punchPlan(mesh,ids){
  validatePunchParams({groups:packFaceGroups(ids)});validateMesh(mesh);
  const byId=new Map(mesh.faces.map(f=>[f.id,f]));if(ids.some(id=>!byId.has(id)))throw new Error('Stanzfläche fehlt. Startflächen vor dem Schritt neu zuordnen.');
  const radius=viewBounds(Object.values(mesh.vertices)).radius,eps=Math.max(1e-8,radius*1e-8),extension=Math.max(1e-5,radius*1e-5);
  const originals=mesh.faces.map(f=>{const p=f.vertices.map(v=>mesh.vertices[v]),area=p.reduce((sum,v,i)=>add(sum,cross(sub(v,p[0]),sub(p[(i+1)%p.length],p[0]))),[0,0,0]);if(length(area)<eps*eps)throw new Error('Loch stanzen benötigt nicht entartete Flächen.');const n=mul(area,1/length(area)),planar=p.every(v=>Math.abs(dot(n,sub(v,p[0])))<=eps*4);return {f,p,n,planar};}),sources=new Map(originals.map(d=>[d.f.id,d]));
  const data=originals.flatMap(d=>d.planar?[d]:triangulateCutFace(mesh,d.f,eps).map(ids=>{const f={id:d.f.id,vertices:ids},p=ids.map(v=>mesh.vertices[v]);return {f,p,n:normal(mesh,f),planar:true};}));
  const inside=(point,d)=>{const drop=d.n.map(Math.abs).indexOf(Math.max(...d.n.map(Math.abs))),axes=[0,1,2].filter(k=>k!==drop),[x,y]=axes.map(k=>point[k]);let hit=false;
    for(let i=0,j=d.p.length-1;i<d.p.length;j=i++){
      const a=d.p[j],b=d.p[i],edge=sub(b,a),span=dot(edge,edge);if(span>eps*eps){const t=dot(sub(point,a),edge)/span;if(t>=-eps&&t<=1+eps&&length(sub(point,add(a,mul(edge,Math.max(0,Math.min(1,t))))))<=eps*4)return true;}
      const [ax,ay]=axes.map(k=>a[k]),[bx,by]=axes.map(k=>b[k]);if((ay>y)!==(by>y)&&x<(bx-ax)*(y-ay)/(by-ay)+ax)hit=!hit;
    }return hit;
  };
  const convex=d=>!d.p.some((a,i)=>d.p.some(p=>dot(cross(sub(d.p[(i+1)%d.p.length],a),sub(p,a)),d.n)<-eps*length(sub(d.p[(i+1)%d.p.length],a))));
  const rayHits=(origin,direction,sourceId)=>{const hits=[];for(const target of data){if(target.f.id===sourceId)continue;const denom=dot(direction,target.n);if(Math.abs(denom)<1e-8)continue;const distance=dot(sub(target.p[0],origin),target.n)/denom;if(distance<=eps*8)continue;if(inside(add(origin,mul(direction,distance)),target))hits.push({target,distance});}return hits.sort((a,b)=>a.distance-b.distance||a.target.f.id.localeCompare(b.target.f.id));};
  const components=faceComponents(mesh.faces),componentVertices=new Map();for(const part of components){const points=[...new Set(part.flatMap(f=>f.vertices))].map(v=>mesh.vertices[v]);for(const f of part)componentVertices.set(f.id,points);}
  const cuts=[],skipped=[],seen=new Set();
  for(const id of [...ids].sort()){
    try{
      const source=sources.get(id);if(source.p.length>16)throw new Error('Startfläche benötigt 3–16 Ecken.');if(source.p.some((a,i)=>source.p.some(p=>dot(cross(sub(source.p[(i+1)%source.p.length],a),sub(p,a)),source.n)<-eps*length(sub(source.p[(i+1)%source.p.length],a)))))throw new Error('Startfläche muss konvex sein.');
      const origin=center(mesh,source.f),direction=mul(source.n,-1),hits=rayHits(origin,direction,id);
      if(!hits.length)throw new Error('Keine gegenüberliegende Fläche gefunden.');hits.sort((a,b)=>a.distance-b.distance||a.target.f.id.localeCompare(b.target.f.id));const nearest=hits[0].distance;
      let match=null;
      for(const hit of hits){if(hit.distance>nearest+eps*8)break;const t=hit.target;if(!source.planar||!sources.get(t.f.id).planar||t.p.length>64)continue;if(dot(source.n,t.n)>-1+1e-7)continue;
        const exit=source.p.map(p=>add(p,mul(direction,dot(sub(t.p[0],p),t.n)/dot(direction,t.n))));
        if(!exit.every(p=>inside(p,t)))continue;
        // Convex exit ensures the complete footprint, not just its corners, fits.
        if(t.p.some((a,i)=>t.p.some(p=>dot(cross(sub(t.p[(i+1)%t.p.length],a),sub(p,a)),t.n)<-eps*length(sub(t.p[(i+1)%t.p.length],a)))))continue;
        // Large batches of exactly matching end contours can avoid repeated
        // whole-model BSP cuts and preserve existing face references.
        let mapped=null;if(ids.length>32&&[3,4].includes(source.p.length)&&t.p.length===source.p.length){
          for(let offset=0;offset<t.p.length;offset++){const order=source.p.map((_,i)=>t.f.vertices[(offset-i+t.p.length)%t.p.length]);if(order.every((v,i)=>length(sub(mesh.vertices[v],exit[i]))<=eps*8)){mapped=order;break;}}
        }
        match=mapped?{target:t,distance:hit.distance,exit:mapped.map(v=>mesh.vertices[v]),mapped,general:true,contour:true}:{target:t,distance:hit.distance,exit};break;
      }
      if(!match){
        // Only broaden the match at the nearest surface, never behind it.
        const probes=[origin,...source.p.map(p=>add(origin,mul(sub(p,origin),.5)))],required=Math.ceil(probes.length*.6),checked=new Set();
        for(const hit of hits){
          if(hit.distance>nearest+eps*8)break;const t=sources.get(hit.target.f.id);if(checked.has(t.f.id))continue;checked.add(t.f.id);
          if(t.p.length>64||dot(source.n,t.n)>-Math.cos(25*Math.PI/180)||!convex(t))continue;
          const axis=sub(center(mesh,t.f),origin);if(dot(axis,source.n)>=-eps||dot(axis,t.n)<=eps)continue;
          const support=probes.filter(p=>{const h=rayHits(p,direction,id);return h.length&&h.some(x=>x.distance<=h[0].distance+eps*8&&x.target.f.id===t.f.id);}).length;if(support<required)continue;
          const exit=source.p.map(p=>add(p,mul(direction,dot(sub(t.p[0],p),t.n)/dot(direction,t.n))));
          if(t.planar&&exit.every(p=>inside(p,t))){match={target:t,distance:hit.distance,exit,general:true};break;}
          // Similar triangle/quad outlines may taper or shift slightly. Pair
          // their complete boundaries rather than demanding exact containment.
          if(![3,4].includes(source.p.length)||t.p.length!==source.p.length)continue;
          const edgeLength=d=>d.p.reduce((sum,p,i)=>sum+length(sub(p,d.p[(i+1)%d.p.length])),0)/d.p.length,sa=edgeLength(source),ta=edgeLength(t),ratio=sa/ta;
          if(ratio<.5||ratio>2)continue;const projected=t.p.map(p=>sub(p,mul(direction,dot(sub(p,origin),source.n)/dot(direction,source.n))));let best=Infinity,bestOffset=0;
          for(let offset=0;offset<t.p.length;offset++){let worst=0;for(let i=0;i<source.p.length;i++){const q=projected[(offset-i+t.p.length)%t.p.length],p=sub(source.p[i],mul(source.n,dot(sub(source.p[i],origin),source.n)));worst=Math.max(worst,length(sub(p,q)));}if(worst<best){best=worst;bestOffset=offset;}}
          if(best>.5*Math.min(sa,ta))continue;
          match={target:t,distance:hit.distance,exit:source.p.map((_,i)=>t.p[(bestOffset-i+t.p.length)%t.p.length]),mapped:source.p.map((_,i)=>t.f.vertices[(bestOffset-i+t.p.length)%t.p.length]),general:true,contour:true};break;
        }
      }
      if(!match)throw new Error('Keine eindeutige passende Gegenfläche: mehrere Innenstrahlen, ähnliche Kontur und höchstens 25° Neigungsabweichung erforderlich.');
      const points=match.general?[...source.p.map((p,i)=>add(p,mul(sub(p,match.exit[i]),extension/length(sub(p,match.exit[i]))))),...match.exit.map((p,i)=>add(p,mul(sub(p,source.p[i]),extension/length(sub(p,source.p[i])))))]:[...source.p.map(p=>add(p,mul(source.n,extension))),...match.exit.map(p=>add(p,mul(direction,extension)))];
      const check=match.general?convexCutter(points,'spunchguard'):null;
      if(componentVertices.get(id).every(p=>check?check.faces.every(f=>dot(normal(check,f),sub(p,check.vertices[f.vertices[0]]))<=eps*4):(()=>{const t=dot(sub(p,origin),direction);return t>=-extension&&t<=match.distance+extension&&inside(sub(p,mul(direction,t)),source);})()))throw new Error('Die ganze Fläche würde den gesamten betroffenen Körper entfernen. Eine kleinere Teilfläche wählen.');
      const signature=JSON.stringify(points.map(p=>p.map(v=>Math.round(v/(eps*4)))).sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2]));
      if(seen.has(signature))continue;seen.add(signature);cuts.push({source:id,target:match.target.f.id,points,...(match.contour?{mapped:match.mapped}: {})});
    }catch(e){skipped.push({source:id,message:e.message});}
  }
  return {cuts,skipped};
}
function punchContour(mesh,cut,step){
  const a=mesh.faces.find(f=>f.id===cut.source),b=mesh.faces.find(f=>f.id===cut.target);if(!a||!b)throw new Error('Überlappende Stanzziele. Diese Flächen einzeln stanzen.');
  if(a.vertices.some(v=>b.vertices.includes(v)))throw new Error('Stanzenden dürfen keine gemeinsamen Punkte haben.');
  let faces=mesh.faces.filter(f=>f.id!==a.id&&f.id!==b.id);const centerline=mul(add(center(mesh,a),center(mesh,b)),.5),prefix=`${step.id}/punch/${ancestryHash(cut.source)}/wall/`;
  for(let i=0;i<a.vertices.length;i++){
    const j=(i+1)%a.vertices.length,ring=[a.vertices[i],a.vertices[j],cut.mapped[j],cut.mapped[i]],p=ring.map(v=>mesh.vertices[v]),mid=mul(p.reduce(add,[0,0,0]),.25),inward=sub(centerline,mid);
    if(dot(cross(sub(p[1],p[0]),sub(p[2],p[0])),inward)<=1e-12||dot(cross(sub(p[2],p[0]),sub(p[3],p[0])),inward)<=1e-12)throw new Error('Stanzkontur klappt um. Andere Flächen wählen.');
    const key=JSON.stringify([...ring].sort()),old=faces.find(f=>f.id.startsWith(step.id+'/punch/')&&f.id.includes('/wall/')&&JSON.stringify([...f.vertices].sort())===key);
    if(old)faces=faces.filter(f=>f!==old);else faces.push({id:prefix+i,vertices:ring});
  }
  if(faces.length>32000)throw new Error('Stanzung überschreitet 32.000 Flächen.');const out=pruneMesh(mesh,faces);validateMesh(out);return out;
}
export function punchFaces(mesh,step){
  validatePunchParams(step.params);const plan=punchPlan(mesh,step.params.groups.flat(2));if(!plan.cuts.length)throw new Error('Keine passende Stanzfläche: '+plan.skipped[0]?.message);
  let out=mesh;for(const cut of [...plan.cuts].sort((a,b)=>Number(Boolean(b.mapped))-Number(Boolean(a.mapped)))){try{if(cut.mapped){out=punchContour(out,cut,step);continue;}out=solidDifference(out,convexCutter(cut.points,`${step.id}/punchcutter/${ancestryHash(cut.source)}`),{id:`${step.id}/punch/${ancestryHash(cut.source)}`,triangulateInput:true});}catch(e){throw new Error('Loch stanzen: '+e.message);}}
  return out;
}
function validateBooleanTunnel(params){if(typeof params.size!=='number'||!Number.isFinite(params.size)||params.size<.05||params.size>.95)throw new Error('Lochgröße: 0,05–0,95.');}
export function booleanTunnel(mesh,step){
  validateBooleanTunnel(step.params);validateMesh(mesh);if(!Array.isArray(step.targets)||step.targets.length!==2||step.targets[0]===step.targets[1])throw new Error('Zwei unterschiedliche Durchbruchsflächen wählen.');
  const pair=step.targets.map(id=>mesh.faces.find(f=>f.id===id));if(pair.some(f=>!f))throw new Error('Durchbruchsfläche fehlt. Flächenpaar neu zuordnen.');
  if(pair.some(f=>f.vertices.length<3||f.vertices.length>16))throw new Error('Durchbruchsflächen mit 3–16 Ecken wählen.');stellate(mesh,{id:step.id,params:{height:0,faces:step.targets}});
  const normals=pair.map(f=>normal(mesh,f)),centers=pair.map(f=>center(mesh,f)),axis=sub(centers[1],centers[0]);if(dot(axis,normals[0])>=-1e-8||dot(axis,normals[1])<=1e-8)throw new Error('Die Außenflächen müssen den Durchbruch nach innen begrenzen.');
  const extension=Math.max(1e-5,viewBounds(Object.values(mesh.vertices)).radius*1e-5),points=pair.flatMap((f,i)=>f.vertices.map(v=>add(add(centers[i],mul(sub(mesh.vertices[v],centers[i]),step.params.size)),mul(normals[i],extension))));
  return solidDifference(mesh,convexCutter(points,`${step.id}/cutter`),step);
}
function validatePlaneCut(params){if(params.side!==undefined&&!['positive','negative','both'].includes(params.side))throw new Error('Schnittseite: positive, negative oder both.');for(const k of ['nx','ny','nz','position'])if(typeof params[k]!=='number'||!Number.isFinite(params[k])||Math.abs(params[k])>1000)throw new Error('Schnittebene: endliche Werte zwischen -1000 und 1000 angeben.');if(Math.hypot(params.nx,params.ny,params.nz)<1e-8)throw new Error('Schnittrichtung darf nicht Null sein.');}
export function planeCut(mesh,step){
  validatePlaneCut(step.params);validateMesh(mesh);
  if(step.params.side==='negative')return planeCut(mesh,{...step,params:{...step.params,side:'positive',nx:-step.params.nx,ny:-step.params.ny,nz:-step.params.nz,position:-step.params.position}});
  if(step.params.side==='both'){
    const a=planeCut(mesh,{...step,params:{...step.params,side:'positive'}}),b=planeCut(mesh,{...step,id:`${step.id}_opposite`,params:{...step.params,side:'negative'}}),ids=new Map(Object.keys(b.vertices).map(id=>[id,`${step.id}/opposite/v/${ancestryHash(id)}`]));
    const vertices={...a.vertices,...Object.fromEntries(Object.entries(b.vertices).map(([id,p])=>[ids.get(id),p]))},faces=[...a.faces,...b.faces.map(f=>({id:f.id,vertices:f.vertices.map(id=>ids.get(id))}))];
    if(faces.length>32000||Object.keys(vertices).length>64000)throw new Error('Beidseitiger Schnitt überschreitet die Netzgrenzen.');const result={vertices,faces};validateMesh(result);return result;
  }
  const raw=[step.params.nx,step.params.ny,step.params.nz],n=mul(raw,1/length(raw)),helper=Math.abs(n[0])<.8?[1,0,0]:[0,1,0],u=cross(n,helper),unit=mul(u,1/length(u)),v=cross(n,unit),p=step.params.position,points=Object.values(mesh.vertices),d=points.map(x=>dot(n,x));
  if(Math.max(...d)<=p+1e-8)throw new Error('Die Schnittebene würde das ganze Modell entfernen.');if(Math.min(...d)>=p-1e-8)throw new Error('Die Schnittebene trifft das Modell nicht.');
  const scale=Math.max(1,...points.map(x=>Math.abs(dot(unit,x))),...points.map(x=>Math.abs(dot(v,x))),...d.map(x=>Math.abs(x))) * 4+Math.abs(p)+1,origin=mul(n,p),box=[];
  for(const z of [-scale,0])for(const x of [-scale,scale])for(const y of [-scale,scale])box.push(add(add(origin,mul(n,z)),add(mul(unit,x),mul(v,y))));
  return solidDifference(mesh,convexCutter(box,`${step.id}/plane`),step);
}
function validateTunnelParams(params){
  if(typeof params.size!=='number'||!Number.isFinite(params.size)||params.size<.05||params.size>.95)throw new Error('Lochgröße: Faktor 0,05 bis 0,95 angeben.');
  if(!Number.isInteger(params.offset)||params.offset<0||params.offset>3)throw new Error('Durchbruch: Zuordnung 0–3 angeben.');
}
export function tunnel(mesh,step){
  validateTunnelParams(step.params);validateMesh(mesh);
  if(!Array.isArray(step.targets)||step.targets.length!==2||step.targets[0]===step.targets[1])throw new Error('Zwei unterschiedliche Durchbruchsflächen auswählen.');
  const pair=step.targets.map(id=>mesh.faces.find(f=>f.id===id));if(pair.some(f=>!f))throw new Error('Durchbruchsfläche fehlt. Vor dem Schritt neu zuordnen.');
  const [a,b]=pair;if(pair.some(f=>f.vertices.length!==4)||a.vertices.some(v=>b.vertices.includes(v)))throw new Error('Durchbruch benötigt zwei Vierecke ohne gemeinsame Eckpunkte.');
  const na=normal(mesh,a),nb=normal(mesh,b),ca=center(mesh,a),cb=center(mesh,b),axis=sub(cb,ca);
  if(dot(na,nb)>-1+1e-6||dot(axis,na)>-.01)throw new Error('Durchbruch benötigt gegenüberliegende parallele Außenflächen durch den Körper.');
  const span=viewBounds(Object.values(mesh.vertices)).radius,tol=Math.max(1e-9,span*1e-8);
  if(meshTopology(mesh).components!==1)throw new Error('Durchbruch benötigt eine zusammenhängende konvexe Außenhülle.');
  for(const f of mesh.faces){const n=normal(mesh,f),p=mesh.vertices[f.vertices[0]];if(f.vertices.some(v=>Math.abs(dot(n,sub(mesh.vertices[v],p)))>tol)||Object.values(mesh.vertices).some(v=>dot(n,sub(v,p))>tol))throw new Error('Durchbruch unterstützt zunächst konvexe Außenhüllen mit ebenen Flächen.');}
  stellate(mesh,{id:step.id,params:{height:0,faces:step.targets}});
  if(mesh.faces.length+14>SUBDIVISION_FACE_LIMIT||Object.keys(mesh.vertices).length+8>64000)throw new Error('Durchbruch überschreitet 32.000 Flächen oder 64.000 Punkte.');
  const vertices={...mesh.vertices},faces=mesh.faces.filter(f=>!step.targets.includes(f.id)),provenance=new Map();
  const identify=(kind,source)=>{const key=JSON.stringify(source),id=`${step.id}/tunnel/${kind}/${ancestryHash(key)}`;if(Object.hasOwn(mesh.vertices,id)||mesh.faces.some(f=>f.id===id)||(provenance.has(id)&&provenance.get(id)!==key))throw new Error('Kollision der Durchbruchsreferenzen.');provenance.set(id,key);return id;};
  const rings=pair.map(f=>{const c=center(mesh,f);return f.vertices.map((v,i)=>{const id=identify('v',[f.id,v]);vertices[id]=add(c,mul(sub(vertices[v],c),step.params.size));return id;});});
  pair.forEach((f,r)=>{for(let i=0;i<4;i++){const j=(i+1)%4;faces.push({id:identify('rim',[f.id,f.vertices[i]]),vertices:[f.vertices[i],f.vertices[j],rings[r][j],rings[r][i]]});}});
  const A=rings[0],B=Array.from({length:4},(_,i)=>rings[1][(step.params.offset-i+4)%4]);
  // Verify every interpolated section before building an inward-facing tube.
  const reference=dot(cross(sub(vertices[A[1]],vertices[A[0]]),sub(vertices[A[2]],vertices[A[0]])),axis);
  for(let k=0;k<=64;k++){const t=k/64,p=A.map((id,i)=>add(mul(vertices[id],1-t),mul(vertices[B[i]],t)));for(let i=0;i<4;i++){const n=cross(sub(p[(i+1)%4],p[i]),sub(p[(i+2)%4],p[(i+1)%4]));if(dot(n,axis)/reference<=1e-8)throw new Error('Durchbruch-Zuordnung klappt um. Andere Zuordnung wählen.');}}
  for(let i=0;i<4;i++){const j=(i+1)%4;for(const [side,ring] of [[0,[A[i],A[j],B[j]]],[1,[A[i],B[j],B[i]]]])faces.push({id:identify('wall',[a.id,a.vertices[i],side]),vertices:ring});}
  const result={vertices,faces};validateMesh(result);return result;
}
function validateGeneralTunnelParams(params){
  if(typeof params.size!=='number'||!Number.isFinite(params.size)||params.size<.05||params.size>.95)throw new Error('Lochgröße: Faktor 0,05 bis 0,95 angeben.');
  if(!Number.isInteger(params.offset)||params.offset<0||params.offset>15)throw new Error('Durchbruch: Zuordnung 0–15 angeben.');
}
export function generalTunnel(mesh,step){
  validateGeneralTunnelParams(step.params);validateMesh(mesh);
  if(!Array.isArray(step.targets)||step.targets.length!==2||step.targets[0]===step.targets[1])throw new Error('Zwei unterschiedliche Durchbruchsflächen auswählen.');
  const pair=step.targets.map(id=>mesh.faces.find(f=>f.id===id));if(pair.some(f=>!f))throw new Error('Durchbruchsfläche fehlt. Vor dem Schritt neu zuordnen.');
  const [a,b]=pair;if(pair.some(f=>f.vertices.length<3||f.vertices.length>16))throw new Error('Durchbruch unterstützt Flächen mit 3–16 Ecken.');if(step.params.offset>=b.vertices.length)throw new Error('Zuordnung passt nicht zur zweiten Fläche.');
  const na=normal(mesh,a),nb=normal(mesh,b),ca=center(mesh,a),cb=center(mesh,b),axis=sub(cb,ca);
  if(dot(axis,na)>=-1e-8||dot(axis,nb)<=1e-8)throw new Error('Die Flächen müssen einen Innenraum zwischen sich einschließen.');
  const span=viewBounds(Object.values(mesh.vertices)).radius,tol=Math.max(1e-9,span*1e-8);
  if(meshTopology(mesh).components!==1)throw new Error('Durchbruch benötigt eine zusammenhängende konvexe Außenhülle.');
  for(const f of mesh.faces){const n=normal(mesh,f),p=mesh.vertices[f.vertices[0]];if(f.vertices.some(v=>Math.abs(dot(n,sub(mesh.vertices[v],p)))>tol)||Object.values(mesh.vertices).some(v=>dot(n,sub(v,p))>tol))throw new Error('Durchbruch unterstützt zunächst konvexe Außenhüllen mit ebenen Flächen.');}
  stellate(mesh,{id:step.id,params:{height:0,faces:step.targets}});
  if(mesh.faces.length+2*(a.vertices.length+b.vertices.length)-2>SUBDIVISION_FACE_LIMIT||Object.keys(mesh.vertices).length+a.vertices.length+b.vertices.length>64000)throw new Error('Durchbruch überschreitet 32.000 Flächen oder 64.000 Punkte.');
  const vertices={...mesh.vertices},faces=mesh.faces.filter(f=>!step.targets.includes(f.id)),provenance=new Map();
  const identify=(kind,source)=>{const key=JSON.stringify(source),id=`${step.id}/tunnel_general/${kind}/${ancestryHash(key)}`;if(Object.hasOwn(mesh.vertices,id)||mesh.faces.some(f=>f.id===id)||(provenance.has(id)&&provenance.get(id)!==key))throw new Error('Kollision der Durchbruchsreferenzen.');provenance.set(id,key);return id;};
  const rings=pair.map(f=>{const c=center(mesh,f);return f.vertices.map((v,i)=>{const id=identify('v',[f.id,v]);vertices[id]=add(c,mul(sub(vertices[v],c),step.params.size));return id;});});
  pair.forEach((f,r)=>{for(let i=0;i<f.vertices.length;i++){const j=(i+1)%f.vertices.length;faces.push({id:identify('rim',[f.id,f.vertices[i]]),vertices:[f.vertices[i],f.vertices[j],rings[r][j],rings[r][i]]});}});
  const A=rings[0],n=A.length,m=rings[1].length,B=Array.from({length:m},(_,i)=>rings[1][(step.params.offset-i+m)%m]),axis2=dot(axis,axis),dp=new Map([['0,0',{cost:0,triangles:[]}]]);
  if(n===m){
    const ring=t=>A.map((id,i)=>add(mul(vertices[id],1-t),mul(vertices[B[i]],t)));
    // Projected corner area is quadratic. Check its exact minimum, including
    // between samples, so fixed rails cannot collapse or reverse orientation.
    for(let i=0;i<n;i++){
      const area=t=>{const p=ring(t);return dot(cross(sub(p[(i+1)%n],p[i]),sub(p[(i+2)%n],p[(i+1)%n])),axis);};
      const reference=area(0);if(Math.abs(reference)<1e-10)throw new Error('Durchbruch hat eine degenerierte Querschnittsecke.');
      const end=area(1)/reference,mid=area(.5)/reference,qa=2*(end+1-2*mid),qb=end-1-qa,t=qa>0?-qb/(2*qa):-1;
      if(Math.min(1,end,t>0&&t<1?area(t)/reference:1)<=1e-8)throw new Error('Durchbruch-Zuordnung lässt den Tunnel zusammenfallen oder umklappen. Andere Zuordnung wählen.');
    }
    for(let i=0;i<n;i++){const j=(i+1)%n;for(const [part,tri] of [[0,[A[i],A[j],B[j]]],[1,[A[i],B[j],B[i]]]]){
      const p=tri.map(v=>vertices[v]),normal=cross(sub(p[1],p[0]),sub(p[2],p[0])),mid=mul(p.reduce(add,[0,0,0]),1/3),base=add(ca,mul(axis,dot(sub(mid,ca),axis)/axis2));
      if(length(normal)<1e-10||dot(normal,sub(mid,base))>=-1e-10)throw new Error('Durchbruch-Zuordnung klappt eine Tunnelwand um. Andere Zuordnung wählen.');
      faces.push({id:identify('wall',[a.id,b.id,2*i+part]),vertices:tri});
    }}
    const result={vertices,faces};validateMesh(result);return result;
  }
  for(let i=0;i<=n;i++)for(let j=0;j<=m;j++){
    const state=dp.get(`${i},${j}`);if(!state)continue;
    for(const advance of [0,1]){const ni=i+(advance===0?1:0),nj=j+(advance===1?1:0);if(ni>n||nj>m||Math.abs(ni/n-nj/m)>.51)continue;
      const tri=advance===0?[A[i%n],A[ni%n],B[j%m]]:[A[i%n],B[nj%m],B[j%m]],p=tri.map(v=>vertices[v]),normal=cross(sub(p[1],p[0]),sub(p[2],p[0])),mid=mul(p.reduce(add,[0,0,0]),1/3),base=add(ca,mul(axis,dot(sub(mid,ca),axis)/axis2));
      if(length(normal)<1e-10||dot(normal,sub(mid,base))>=-1e-10)continue;
      const cost=state.cost+p.reduce((sum,v,k)=>sum+dot(sub(v,p[(k+1)%3]),sub(v,p[(k+1)%3])),0),key=`${ni},${nj}`,old=dp.get(key);if(!old||cost<old.cost)dp.set(key,{cost,triangles:[...state.triangles,tri]});
    }
  }
  const best=dp.get(`${n},${m}`);if(!best)throw new Error('Keine stabile Tunnelwand für diese Zuordnung. Andere Zuordnung oder kleinere Lochgröße wählen.');
  best.triangles.forEach((ring,i)=>faces.push({id:identify('wall',[a.id,b.id,i]),vertices:ring}));
  const result={vertices,faces};validateMesh(result);return result;
}
export function bestGeneralTunnelOffset(mesh,targets,size=.5){const count=mesh.faces.find(f=>f.id===targets?.[1])?.vertices.length||0;let best=null;for(let offset=0;offset<Math.min(count,16);offset++){try{const out=generalTunnel(mesh,{id:'sbesttunnel',targets,params:{size,offset}}),cost=out.faces.filter(f=>f.id.includes('/tunnel_general/wall/')).reduce((sum,f)=>sum+f.vertices.reduce((s,v,i)=>s+length(sub(out.vertices[v],out.vertices[f.vertices[(i+1)%3]])),0),0);if(!best||cost<best.cost)best={offset,cost};}catch{}}if(!best)throw new Error('Kein stabiler Durchbruch möglich: ebene konvexe Flächen einer konvexen Außenhülle auswählen.');return best.offset;}
export function bestTunnelOffset(mesh,targets,size=.5){let best=null;for(let offset=0;offset<4;offset++){try{const out=tunnel(mesh,{id:'sbesttunnel',targets,params:{size,offset}}),cost=out.faces.filter(f=>f.id.includes('/tunnel/wall/')).reduce((sum,f)=>sum+f.vertices.reduce((s,v,i)=>s+length(sub(out.vertices[v],out.vertices[f.vertices[(i+1)%3]])),0),0);if(!best||cost<best.cost)best={offset,cost};}catch{}}if(!best)throw new Error('Kein gerader Durchbruch möglich: zwei gegenüberliegende Vierecke einer konvexen Außenhülle auswählen.');return best.offset;}
function validateMixedParams(params){if(!Number.isInteger(params.offset)||params.offset<0||params.offset>3)throw new Error('Gemischte Brücke: Zuordnung 0–3 angeben.');}
export function mixedBridge(mesh,step){
  validateMixedParams(step.params);if(mesh.faces.length+5>SUBDIVISION_FACE_LIMIT)throw new Error('Gemischte Brücke überschreitet 32.000 Flächen.');const pair=mixedBridgePair(mesh,step.targets),a=pair.find(f=>f.vertices.length===3),b=pair.find(f=>f.vertices.length===4);
  stellate(mesh,{id:step.id,params:{height:0,faces:step.targets}});
  const A=a.vertices,B=Array.from({length:4},(_,i)=>b.vertices[(step.params.offset-i+4)%4]),ca=center(mesh,a),cb=center(mesh,b),axis=sub(cb,ca),axis2=dot(axis,axis),dp=new Map([['0,0',{cost:0,triangles:[]}]]);
  for(let i=0;i<=3;i++)for(let j=0;j<=4;j++){
    const state=dp.get(`${i},${j}`);if(!state)continue;
    for(const advance of [0,1]){const ni=i+(advance===0?1:0),nj=j+(advance===1?1:0);if(ni>3||nj>4||Math.abs(ni/3-nj/4)>.51)continue;
      const tri=advance===0?[A[i%3],A[ni%3],B[j%4]]:[A[i%3],B[nj%4],B[j%4]],points=tri.map(v=>mesh.vertices[v]),n=cross(sub(points[1],points[0]),sub(points[2],points[0])),mid=mul(points.reduce(add,[0,0,0]),1/3),base=add(ca,mul(axis,dot(sub(mid,ca),axis)/axis2));
      if(length(n)<1e-10||dot(n,sub(mid,base))<=1e-10)continue;
      const cost=state.cost+points.reduce((sum,p,k)=>sum+dot(sub(p,points[(k+1)%3]),sub(p,points[(k+1)%3])),0),key=`${ni},${nj}`,old=dp.get(key);
      if(!old||cost<old.cost)dp.set(key,{cost,triangles:[...state.triangles,tri]});
    }
  }
  const best=dp.get('3,4');if(!best)throw new Error('Keine stabile Dreieck–Viereck-Zuordnung. Andere Zuordnung oder Endflächen wählen.');
  const faces=mesh.faces.filter(f=>!step.targets.includes(f.id));best.triangles.forEach((vertices,i)=>faces.push({id:`${step.id}/mixed/side/${i}`,vertices}));const result={vertices:{...mesh.vertices},faces};validateMesh(result);return result;
}
export function bestMixedBridgeOffset(mesh,targets){let best=null;for(let offset=0;offset<4;offset++){try{const out=mixedBridge(mesh,{id:'sbestmixed',targets,params:{offset}}),cost=out.faces.filter(f=>f.id.startsWith('sbestmixed/')).reduce((sum,f)=>sum+f.vertices.reduce((n,v,i)=>n+length(sub(out.vertices[v],out.vertices[f.vertices[(i+1)%3]])),0),0);if(!best||cost<best.cost)best={offset,cost};}catch{}}if(!best)throw new Error('Keine stabile gerade Brücke zwischen diesen Flächen gefunden.');return best.offset;}
export function bestBridgeOffset(mesh,targets) {
  const [a,b]=bridgePair(mesh,targets);
  const n=a.vertices.length;
  const costs=Array.from({length:n},(_,offset)=>a.vertices.reduce((sum,id,i)=>sum+length(sub(mesh.vertices[id],mesh.vertices[b.vertices[(offset-i+n)%n]]))**2,0));
  return costs.indexOf(Math.min(...costs));
}
export function bridge(mesh,step) {
  validateBridgeWalls(step.params);
  const [a,b]=bridgePair(mesh,step.targets),{offset,segments}=step.params;
  const n=a.vertices.length;
  if(n!==(step.type==='triangle_bridge'?3:4))throw new Error('Der Brückentyp passt nicht zu den Endflächen. Das Flächenpaar neu zuordnen.');
  if(!Number.isInteger(offset)||offset<0||offset>=n||!Number.isInteger(segments)||segments<1||segments>16) throw new Error(`Eckpunkt-Zuordnung 0–${n-1} und Segmente 1–16 angeben.`);
  const mapped=a.vertices.map((_,i)=>b.vertices[(offset-i+n)%n]);
  const interpolate=t=>a.vertices.map((id,i)=>add(mul(mesh.vertices[id],1-t),mul(mesh.vertices[mapped[i]],t)));
  const axis=sub(center(mesh,b),center(mesh,a));
  const reference=dot(cross(sub(mesh.vertices[a.vertices[1]],mesh.vertices[a.vertices[0]]),sub(mesh.vertices[a.vertices[2]],mesh.vertices[a.vertices[0]])),axis);
  if(n===3){
    // Projected triangle area is quadratic in t. Check its exact minimum so
    // a collapse between the sampled sections cannot slip through.
    const area=t=>{const p=interpolate(t);return dot(cross(sub(p[1],p[0]),sub(p[2],p[0])),axis)/reference;};
    const end=area(1),mid=area(.5),qa=2*(end+1-2*mid),qb=end-1-qa,t=qa>0?-qb/(2*qa):-1;
    if(Math.min(1,end,t>0&&t<1?area(t):1)<=1e-8)throw new Error('Diese Eckpunkt-Zuordnung lässt die Brücke zusammenfallen oder umklappen. Andere Zuordnung wählen.');
  }
  // Check between rings as well: a 180-degree correspondence can collapse mid-span.
  for(let k=0;k<=32;k++) {
    const ring=interpolate(k/32);
    for(let i=0;i<n;i++) {
      const area=dot(cross(sub(ring[(i+1)%n],ring[i]),sub(ring[(i+2)%n],ring[(i+1)%n])),axis);
      if(!Number.isFinite(area)||area/reference<=1e-8) throw new Error('Diese Eckpunkt-Zuordnung lässt die Brücke zusammenfallen oder umklappen. Andere Zuordnung wählen.');
    }
  }
  return loftBridge(mesh,step,a,b,mapped,interpolate);
}
function loftBridge(mesh,step,a,b,mapped,interpolate,checkOutline=true) {
  validateBridgeWalls(step.params);
  const {segments}=step.params,n=a.vertices.length;
  for(let i=0;i<n;i++) {
    const j=(i+1)%n,outline=[a.vertices[i],a.vertices[j],mapped[j],mapped[i]];
    if(checkOutline&&mesh.faces.some(f=>!step.targets.includes(f.id)&&outline.every(v=>f.vertices.includes(v)))) throw new Error('Die Brücke würde mit einer vorhandenen Fläche zusammenfallen. Weiter außen liegende Armsegmente auswählen.');
  }
  const vertices={...mesh.vertices},rings=[a.vertices],faces=mesh.faces.filter(f=>!step.targets.includes(f.id));
  for(let r=1;r<segments;r++) {
    const points=interpolate(r/segments),ids=points.map((p,i)=>{const id=`${step.id}/ring/${r}/v${i}`;vertices[id]=p;return id;});rings.push(ids);
  }
  rings.push(mapped);
  for(let r=0;r<segments;r++) for(let i=0;i<n;i++) {
    const j=(i+1)%n,lo=rings[r],hi=rings[r+1];
    const triangles=[{id:`${step.id}/side/${r}/${i}/0`,vertices:[lo[i],lo[j],hi[j]]},{id:`${step.id}/side/${r}/${i}/1`,vertices:[lo[i],hi[j],hi[i]]}];
    if(triangles.some(t=>mesh.faces.some(f=>!step.targets.includes(f.id)&&t.vertices.every(v=>f.vertices.includes(v))))) throw new Error('Die Brücke würde mit einer vorhandenen Fläche zusammenfallen. Weiter außen liegende Armsegmente auswählen.');
    if(step.params.wallFaces==='quads'&&n===4)faces.push({id:`${step.id}/side/${r}/${i}/quad`,vertices:[lo[i],lo[j],hi[j],hi[i]]});else faces.push(...triangles);
  }
  const next={vertices,faces};validateMesh(next);return next;
}
function validateBridgeWalls(p){if(p.wallFaces!==undefined&&!['triangles','quads'].includes(p.wallFaces))throw new Error('Brückenwand: Dreiecke oder Vierecke wählen.');}
function curvedBridgeParams(p,corners=4) {
  validateBridgeWalls(p);
  if(!Number.isInteger(p.offset)||p.offset<0||p.offset>=corners||!Number.isInteger(p.segments)||p.segments<3||p.segments>32)throw new Error(`Gekrümmte Brücke: Zuordnung 0–${corners-1} und Segmente 3–32 angeben.`);
  for(const key of ['bendA','bendB'])if(typeof p[key]!=='number'||!Number.isFinite(p[key])||p[key]<.05||p[key]>2)throw new Error('Krümmung A/B: erlaubt sind Faktoren von 0,05 bis 2.');
  if(p.bow!==undefined&&(!Array.isArray(p.bow)||p.bow.length!==3||p.bow.some(v=>typeof v!=='number'||!Number.isFinite(v)||Math.abs(v)>4)))throw new Error('Kurvenmitte: drei endliche Faktoren zwischen −4 und 4 angeben.');
  if(p.twist!==undefined&&(typeof p.twist!=='number'||!Number.isFinite(p.twist)||Math.abs(p.twist)>180))throw new Error('Verdrehung: -180 bis 180 Grad angeben.');
  if(p.pathPoints!==undefined&&(!Array.isArray(p.pathPoints)||p.pathPoints.length>3||p.pathPoints.some(q=>!q||typeof q.t!=='number'||!Number.isFinite(q.t)||![.25,.375,.75].includes(q.t)||!Array.isArray(q.offset)||q.offset.length!==3||q.offset.some(v=>typeof v!=='number'||!Number.isFinite(v)||Math.abs(v)>4))||new Set(p.pathPoints.map(q=>q.t)).size!==p.pathPoints.length))throw new Error('Bis zu drei zusätzliche Pfadpunkte mit X/Y/Z-Faktoren von -4 bis 4 angeben.');
}
const unit=v=>{const n=length(v);if(!Number.isFinite(n)||n<1e-10)throw new Error('Kurvenverlauf oder Querschnitt ist degeneriert. Krümmung oder Flächenpaar ändern.');return mul(v,1/n);};
const rotateAxis=(v,axis,angle)=>add(add(mul(v,Math.cos(angle)),mul(cross(axis,v),Math.sin(angle))),mul(axis,dot(axis,v)*(1-Math.cos(angle))));
function prepareMixedCurve(mesh,targets,prefix='smixedpreview'){
  if(mesh?._mixedCurvePrepared)return mesh;
  const pair=targets?.map(id=>mesh?.faces.find(f=>f.id===id));if(!pair||pair.length!==2||pair.some(f=>!f))return mesh;
  if(pair[0].vertices.length===pair[1].vertices.length)return mesh;
  if(!pair.every(f=>[3,4].includes(f.vertices.length))||pair[0].vertices.some(v=>pair[1].vertices.includes(v)))throw new Error('Gemischte Kurve benötigt ein getrenntes Dreieck und Viereck.');
  stellate(mesh,{id:prefix,params:{height:0,faces:targets}});
  const vertices={...mesh.vertices},edges=new Map(),edgeKey=(a,b)=>JSON.stringify([a,b].sort());
  for(const f of pair)for(let i=0;i<f.vertices.length;i++){
    const a=f.vertices[i],b=f.vertices[(i+1)%f.vertices.length],[lo,hi]=[a,b].sort(),count=12/f.vertices.length,ring=[lo];
    for(let j=1;j<count;j++){const id=`${prefix}/mixedcurve/v/${ancestryHash(JSON.stringify([lo,hi,count,j]))}`;if(Object.hasOwn(vertices,id))throw new Error('Kollision der gemischten Kurvenpunkte.');vertices[id]=add(mesh.vertices[lo],mul(sub(mesh.vertices[hi],mesh.vertices[lo]),j/count));ring.push(id);}ring.push(hi);edges.set(edgeKey(a,b),ring);
  }
  const faces=mesh.faces.map(f=>{const ring=[];let changed=false;for(let i=0;i<f.vertices.length;i++){const a=f.vertices[i],b=f.vertices[(i+1)%f.vertices.length],part=edges.get(edgeKey(a,b));if(!part){ring.push(a);continue;}changed=true;ring.push(...(part[0]===a?part:[...part].reverse()).slice(0,-1));}if(!changed)return f;
    // Start at a real corner's incoming segment so the first three vertices
    // still define a normal despite the deliberately collinear edge samples.
    let out=null;for(let i=0;i<ring.length;i++){const r=[...ring.slice(i),...ring.slice(0,i)];try{normal({vertices},{vertices:r});out=r;break;}catch{}}if(!out)throw new Error('Gemischter Kurvenrand ist degeneriert.');return {id:f.id,vertices:out};});
  const result={vertices,faces,_mixedCurvePrepared:true};validateMesh(result);return result;
}
export function curvedBridgePair(mesh,targets) {
  mesh=prepareMixedCurve(mesh,targets);
  if(!mesh||!Array.isArray(targets)||targets.length!==2||targets[0]===targets[1])throw new Error('Zwei unterschiedliche Flächen auswählen.');
  const [a,b]=targets.map(id=>mesh.faces.find(f=>f.id===id));
  if(!a||!b)throw new Error('Bezugsfläche der Brücke fehlt. Das Flächenpaar neu zuordnen.');
  if(a.vertices.length!==b.vertices.length||!(mesh._mixedCurvePrepared?a.vertices.length===12:[3,4].includes(a.vertices.length)))throw new Error('Gekrümmte Brücken benötigen zwei ebene, konvexe Dreiecke oder zwei Vierecke. Unterschiedliche Eckenzahlen werden noch nicht unterstützt.');
  if(a.vertices.some(id=>b.vertices.includes(id)))throw new Error('Die Flächen dürfen keine gemeinsamen Eckpunkte besitzen.');
  const ca=center(mesh,a),cb=center(mesh,b),na=normal(mesh,a),nb=normal(mesh,b),distance=length(sub(cb,ca));
  if(distance<.01)throw new Error('Die Flächen liegen zu dicht beieinander.');
  for(const [face,pivot,n] of [[a,ca,na],[b,cb,nb]]) {
    const radius=Math.max(...face.vertices.map(id=>length(sub(mesh.vertices[id],pivot))));
    if(face.vertices.some(id=>Math.abs(dot(sub(mesh.vertices[id],pivot),n))>1e-6*radius))throw new Error('Gekrümmte Brücken benötigen ebene Endflächen. Andere Flächen wählen.');
    const corners=face.vertices.length;
    for(let i=0;i<corners;i++){
      const p=face.vertices.map(id=>mesh.vertices[id]);
      if(mesh._mixedCurvePrepared?dot(cross(sub(p[(i+1)%corners],p[i]),sub(p[(i+2)%corners],p[(i+1)%corners])),n)<-1e-10*radius*radius:dot(cross(sub(p[(i+1)%corners],p[i]),sub(p[(i+2)%corners],p[(i+1)%corners])),n)<=1e-10*radius*radius)throw new Error('Endflächen müssen konvexe, nicht zusammengefallene Dreiecke oder Vierecke sein.');
    }
  }
  return {a,b,ca,cb,na,nb,distance};
}
function curvePath({ca,cb,na,nb,distance},{bendA,bendB,bow,pathPoints}) {
  const p1=add(ca,mul(na,distance*bendA)),p2=add(cb,mul(nb,distance*bendB));
  const shift=bow?.some(v=>v!==0)?mul(bow,distance):null;
  const point=t=>{const u=1-t,p=add(add(mul(ca,u*u*u),mul(p1,3*u*u*t)),add(mul(p2,3*u*t*t),mul(cb,t*t*t)));return shift?add(p,mul(shift,16*t*t*u*u)):p;};
  const velocity=t=>{const u=1-t,v=add(add(mul(sub(p1,ca),3*u*u),mul(sub(p2,p1),6*u*t)),mul(sub(cb,p2),3*t*t));return shift?add(v,mul(shift,32*t*u*(1-2*t))):v;};
  if(!pathPoints?.length)return {p1,p2,point,velocity};
  const knots=[0,.5,1,...pathPoints.map(q=>q.t)].sort((a,b)=>a-b);
  const extra=(t,derivative)=>pathPoints.reduce((sum,q)=>{
    const i=knots.indexOf(q.t),left=knots[i-1],right=knots[i+1];if(t<=left||t>=right)return sum;
    const rising=t<=q.t,width=rising?q.t-left:right-q.t,u=rising?(t-left)/width:(right-t)/width,weight=derivative?(rising?1:-1)*6*u*(1-u)/width:u*u*(3-2*u);
    return add(sum,mul(q.offset,distance*weight));
  },[0,0,0]);
  return {p1,p2,point:t=>add(point(t),extra(t,false)),velocity:t=>add(velocity(t),extra(t,true))};
}
export function curvedBridgePreview(mesh,targets,params) {
  mesh=prepareMixedCurve(mesh,targets);
  const pair=curvedBridgePair(mesh,targets);curvedBridgeParams(params,pair.a.vertices.length);const path=curvePath(pair,params);
  return {...pair,points:Array.from({length:65},(_,i)=>path.point(i/64)),handles:{a:path.p1,b:path.p2,mid:path.point(.5),...Object.fromEntries((params.pathPoints||[]).map(q=>[`p:${q.t}`,path.point(q.t)]))}};
}
export function closestCurvedBridgeOffset(mesh,targets) {
  mesh=prepareMixedCurve(mesh,targets);
  const {a,b}=curvedBridgePair(mesh,targets);
  const n=a.vertices.length;
  const costs=Array.from({length:n},(_,offset)=>a.vertices.reduce((sum,id,i)=>sum+length(sub(mesh.vertices[id],mesh.vertices[b.vertices[(offset-i+n)%n]]))**2,0));
  return costs.indexOf(Math.min(...costs));
}
export function screenPlaneDelta(dx,dy,{yaw,pitch,roll,scale}) {
  if(![dx,dy,yaw,pitch,roll,scale].every(Number.isFinite)||scale<=0)throw new Error('Ungültige Ansicht für die Kurvenbearbeitung.');
  const x=dx/scale,y=-dy/scale,xr=x*Math.cos(roll)+y*Math.sin(roll),yr=-x*Math.sin(roll)+y*Math.cos(roll);
  const yp=yr*Math.cos(pitch),zp=-yr*Math.sin(pitch);
  return [xr*Math.cos(yaw)-zp*Math.sin(yaw),yp,xr*Math.sin(yaw)+zp*Math.cos(yaw)];
}
export function dragCurveHandle(params,preview,handle,dx,dy,view) {
  const delta=screenPlaneDelta(dx,dy,view),next={...params};
  if(handle==='mid')next.bow=(params.bow||[0,0,0]).map((v,i)=>Math.max(-4,Math.min(4,v+delta[i]/preview.distance)));
  else if(handle.startsWith('p:')){const t=Number(handle.slice(2));if(!params.pathPoints?.some(q=>q.t===t))throw new Error('Pfadpunkt fehlt.');next.pathPoints=params.pathPoints.map(q=>q.t===t?{t,offset:q.offset.map((v,i)=>Math.max(-4,Math.min(4,v+delta[i]/preview.distance)))}:{t:q.t,offset:[...q.offset]});}
  else if(handle==='a'||handle==='b'){
    const n=handle==='a'?preview.na:preview.nb,right=screenPlaneDelta(view.scale,0,view),up=screenPlaneDelta(0,-view.scale,view),projection=dot(n,right)**2+dot(n,up)**2;
    if(projection>.02){const key=handle==='a'?'bendA':'bendB';next[key]=Math.max(.05,Math.min(2,params[key]+dot(delta,n)/(preview.distance*projection)));}
  }else throw new Error('Unbekannter Kurvengriff.');
  return next;
}
function curvedBridgeData(mesh,step) {
  const pair=curvedBridgePair(mesh,step.targets),{a,b,ca,cb,na,nb,distance}=pair;
  const n=a.vertices.length;curvedBridgeParams(step.params,n);
  if(mesh._mixedCurvePrepared&&step.type&&step.type!=='mixed_curve_bridge')throw new Error('Gemischte Kurve benötigt einen eigenen Brückenschritt.');
  if(step.type==='mixed_curve_bridge'&&!mesh._mixedCurvePrepared)throw new Error('Gemischte Kurve benötigt Dreieck und Viereck.');
  if(step.type&&['curved_bridge','spline_bridge','triangle_curved_bridge','triangle_spline_bridge','multi_spline_bridge','triangle_multi_spline_bridge','twist_spline_bridge','triangle_twist_spline_bridge'].includes(step.type)&&n!==(step.type.startsWith('triangle_')?3:4))throw new Error('Der Brückentyp passt nicht zu den Endflächen. Das Flächenpaar neu zuordnen.');
  const {offset}=step.params,mapped=a.vertices.map((_,i)=>b.vertices[(offset-i+n)%n]);
  const {point,velocity}=curvePath(pair,step.params);
  const tangent=t=>{
    const v=velocity(t);
    if(length(v)<distance*1e-8)throw new Error('Kurve hat einen Stillstand oder eine Spitze. Krümmung oder Flächenpaar ändern.');
    return unit(v);
  };
  const count=256,axes=[unit(sub(mesh.vertices[a.vertices[1]],mesh.vertices[a.vertices[0]]))];
  const startY=cross(na,axes[0]),endZ=mul(nb,-1),endX=unit(sub(mesh.vertices[mapped[1]],mesh.vertices[mapped[0]])),endY=cross(endZ,endX);
  let previous=na;
  // Rotation-minimizing transport avoids collapsing sections on U-shaped paths.
  for(let k=1;k<=count;k++){
    const next=tangent(k/count),axis=cross(previous,next),s=length(axis),c=Math.max(-1,Math.min(1,dot(previous,next)));
    if(c<-.99)throw new Error('Kurve knickt um oder hat eine Spitze. Krümmung oder Flächenpaar ändern.');
    const x=s<1e-12?axes[k-1]:rotateAxis(axes[k-1],mul(axis,1/s),Math.atan2(s,c));
    axes.push(unit(sub(x,mul(next,dot(x,next)))));previous=next;
  }
  const twist=Math.atan2(dot(cross(axes[count],endX),endZ),dot(axes[count],endX));
  const xy=(ids,pivot,x,y)=>ids.map(id=>{const v=sub(mesh.vertices[id],pivot);return [dot(v,x),dot(v,y)];});
  const xyA=xy(a.vertices,ca,axes[0],startY),xyB=xy(mapped,cb,endX,endY);
  const ring=t=>{
    if(t===0)return a.vertices.map(id=>mesh.vertices[id]);if(t===1)return mapped.map(id=>mesh.vertices[id]);
    const at=t*count,k=Math.min(count-1,Math.floor(at)),mix=at-k,z=tangent(t),pivot=point(t);
    let x=add(mul(axes[k],1-mix),mul(axes[k+1],mix));x=unit(sub(x,mul(z,dot(x,z))));x=rotateAxis(x,z,twist*t);if(step.params.twist)x=rotateAxis(x,z,step.params.twist*Math.PI/180*16*t*t*(1-t)*(1-t));
    const y=cross(z,x);
    return xyA.map((v,i)=>add(pivot,add(mul(x,v[0]*(1-t)+xyB[i][0]*t),mul(y,v[1]*(1-t)+xyB[i][1]*t))));
  };
  let prior=ring(0),cost=0;
  for(let k=0;k<=count;k++){
    const t=k/count,r=ring(t),z=tangent(t);
    for(let i=0;i<n;i++){
      const edge=sub(r[(i+1)%n],r[i]),next=sub(r[(i+2)%n],r[(i+1)%n]);
      if(mesh._mixedCurvePrepared?(length(edge)<1e-10||dot(cross(edge,next),z)<-1e-9*length(edge)*length(next)):dot(cross(edge,next),z)<=1e-9*length(edge)*length(next))throw new Error('Querschnitt fällt zusammen. Andere Eckpunkt-Zuordnung wählen.');
      if(k){const rail=sub(r[i],prior[i]);cost+=length(rail);if(dot(rail,tangent((k-.5)/count))<=1e-8*length(rail))throw new Error('Krümmung ist für diesen Querschnitt zu eng. Krümmung A/B oder Endflächen ändern.');}
    }
    prior=r;
  }
  // Also check the actual coarse triangles, not only the dense curve samples.
  for(let k=0;k<step.params.segments;k++){
    const lo=ring(k/step.params.segments),hi=ring((k+1)/step.params.segments),mid=ring((k+.5)/step.params.segments),z=tangent((k+.5)/step.params.segments);
    for(let i=0;i<n;i++){
      const j=(i+1)%n,out=cross(sub(mid[j],mid[i]),z);
      for(const tri of [[lo[i],lo[j],hi[j]],[lo[i],hi[j],hi[i]]]){
        const n=cross(sub(tri[1],tri[0]),sub(tri[2],tri[0]));
        if(dot(n,out)<=1e-8*length(n)*length(out)){const error=new Error('Brückensegmente klappen um. Mehr Segmente oder andere Krümmung/Zuordnung wählen.');error.code='CURVE_SEGMENTS_FOLD';throw error;}
      }
    }
  }
  return {a,b,mapped,ring,cost};
}
export function bestCurvedBridgeOffset(mesh,targets,params={segments:8,bendA:.5,bendB:.5}) {
  mesh=prepareMixedCurve(mesh,targets);
  let best=null,failure;
  const n=curvedBridgePair(mesh,targets).a.vertices.length;
  for(let offset=0;offset<n;offset++)try{
    const data=curvedBridgeData(mesh,{targets,params:{...params,offset}});
    if(!best||data.cost<best.cost-1e-9)best={offset,cost:data.cost};
  }catch(e){failure??=e;}
  if(!best)throw failure;return best.offset;
}
export function curvedBridgeSections(mesh,targets,params){mesh=prepareMixedCurve(mesh,targets);const data=curvedBridgeData(mesh,{targets,params});return Array.from({length:9},(_,i)=>data.ring(i/8));}
export function curvedBridge(mesh,step) {
  mesh=prepareMixedCurve(mesh,step.targets,step.id);
  if(mesh._mixedCurvePrepared&&(mesh.faces.length-2+24*step.params.segments>32000||Object.keys(mesh.vertices).length+12*(step.params.segments-1)>64000))throw new Error('Gemischte Kurve überschreitet 32.000 Flächen oder 64.000 Punkte.');
  const {a,b,mapped,ring}=curvedBridgeData(mesh,step);
  return loftBridge(mesh,step,a,b,mapped,ring,false);
}
export async function autoCurvedBridgeParams(mesh,targets,{stepId='sautocurve',preferred,signal,onProgress=()=>{}}={}) {
  mesh=prepareMixedCurve(mesh,targets,stepId);
  const n=curvedBridgePair(mesh,targets).a.vertices.length;
  const checkCancelled=()=>{if(signal?.aborted){const error=new Error('Automatische Brückensuche abgebrochen.');error.name='AbortError';throw error;}};
  checkCancelled();
  const values=[.05,.1,.25,.5,.75,1,1.25,1.5,1.75,2],pairs=[],seen=new Set();
  const include=(a,b)=>{const key=JSON.stringify([a,b]);if(!seen.has(key)){seen.add(key);pairs.push([a,b]);}};
  if(preferred)try{curvedBridgeParams(preferred,n);include(preferred.bendA,preferred.bendB);}catch{}
  include(.5,.5);include(1,1);include(1.5,1.5);
  // Search the full grid independently at A and B, preferring compact paths.
  const grid=values.flatMap(a=>values.map(b=>[a,b]));grid.sort((a,b)=>(a[0]+a[1]+.1*Math.abs(a[0]-a[1]))-(b[0]+b[1]+.1*Math.abs(b[0]-b[1])));
  for(const [a,b] of grid)include(a,b);
  const segments=[...new Set([preferred?.segments,8,16,24,32].filter(n=>Number.isInteger(n)&&n>=3&&n<=32))];
  let tested=0;
  for(const [bendA,bendB] of pairs){
    let best=null;
    for(let offset=0;offset<n;offset++){
      checkCancelled();
      for(const count of segments){
        const params={bendA,bendB,segments:count,offset,...(preferred?.wallFaces?{wallFaces:preferred.wallFaces}:{}),...(preferred?.bow?{bow:[...preferred.bow]}:{}),...(preferred?.pathPoints?{pathPoints:structuredClone(preferred.pathPoints)}:{}),...(preferred?.twist!==undefined?{twist:preferred.twist}:{})};
        try{
          const data=curvedBridgeData(mesh,{targets,params});
          // Accept only a fully generated and validated mesh, using the same
          // geometry checks as manual editing. Never relax checks to find a seed.
          loftBridge(mesh,{id:stepId,targets,params},data.a,data.b,data.mapped,data.ring,false);
          if(!best||data.cost<best.cost-1e-9)best={params,cost:data.cost};
          break;
        }catch(error){
          // Only coarse triangle failure can improve with more segments.
          if(error.code!=='CURVE_SEGMENTS_FOLD')break;
        }
      }
      onProgress({tested:++tested,total:pairs.length*n});checkCancelled();
      // Yield periodically so the browser stays interactive and cancellation works.
      if(tested%8===0){await new Promise(resolve=>setTimeout(resolve,0));checkCancelled();}
    }
    if(best)return best.params;
  }
  const error=new Error('Im geprüften Bereich wurde kein gültiger Verlauf gefunden. Endflächen verkleinern, andere Flächen wählen oder die Krümmung manuell ändern.');error.code='NO_CURVED_BRIDGE_SOLUTION';throw error;
}
export const SUBDIVISION_FACE_LIMIT=32000;
// Compact ancestry-derived identifiers keep downstream references independent of array order.
function ancestryHash(value) {
  const h=[2166136261,2246822507,3266489909,668265263];
  for(let i=0;i<value.length;i++) for(let j=0;j<4;j++) h[j]=Math.imul(h[j]^value.charCodeAt(i),[16777619,2246822519,3266489917,668265263][j]);
  return h.map(x=>(x>>>0).toString(16).padStart(8,'0')).join('');
}
function validateManualParams(params){
  if(params.removed!==undefined){validatePartGroups({groups:params.removed});if(params.removed.flat(2).length>128)throw new Error('Manuelle Reparatur: höchstens 128 Flächen entfernen.');}
  if(params.patches!==undefined&&(!Array.isArray(params.patches)||params.patches.length>32||params.patches.some(r=>!Array.isArray(r)||r.length<3||r.length>32||new Set(r).size!==r.length||r.some(v=>typeof v!=='string'||!v.length||v.length>160))))throw new Error('Manuelle Reparatur: bis 32 neue Flächen mit jeweils 3–32 unterschiedlichen Eckpunkten.');
}
export function meshBoundary(mesh){
  validateMesh(mesh,{allowOpen:true});const edges=new Map();for(const f of mesh.faces)for(let i=0;i<f.vertices.length;i++){const a=f.vertices[i],b=f.vertices[(i+1)%f.vertices.length],k=JSON.stringify([a,b].sort());if(!edges.has(k))edges.set(k,[]);edges.get(k).push([a,b]);}return [...edges.values()].filter(e=>e.length===1).map(e=>e[0]);
}
export function manualPatch(mesh,step,{allowOpen=false}={}){
  validateManualParams(step.params);validateMesh(mesh);const removed=new Set(step.params.removed?.flat(2)||[]),source=new Set(mesh.faces.map(f=>f.id));if([...removed].some(id=>!source.has(id)))throw new Error('Entfernte Bezugsfläche fehlt. Reparatur neu bearbeiten.');
  const faces=mesh.faces.filter(f=>!removed.has(f.id)),eps=Math.max(1e-8,viewBounds(Object.values(mesh.vertices)).radius*1e-8),key=(a,b)=>JSON.stringify([a,b].sort()),usedIds=new Set(source);
  if(!faces.length)throw new Error('Mindestens eine bestehende Fläche erhalten; zum Rückholen letzten Eingriff zurücknehmen.');
  for(const path of step.params.patches||[]){
    if(path.some(v=>!Object.hasOwn(mesh.vertices,v)))throw new Error('Eckpunkt der neuen Fläche fehlt. Reparatur neu bearbeiten.');if(faces.some(f=>f.vertices.length===path.length&&f.vertices.every(v=>path.includes(v))))throw new Error('Eine Fläche mit diesen Eckpunkten existiert bereits.');let ring=[...path];const edges=new Map();
    for(const f of faces)for(let i=0;i<f.vertices.length;i++){const a=f.vertices[i],b=f.vertices[(i+1)%f.vertices.length],k=key(a,b);if(!edges.has(k))edges.set(k,[]);edges.get(k).push([a,b]);}
    const directions=[];for(let i=0;i<ring.length;i++){const a=ring[i],b=ring[(i+1)%ring.length],owners=edges.get(key(a,b))||[];if(owners.length>1)throw new Error('Diese Kante hat bereits zwei Flächen. Nur offene Ränder verbinden.');if(owners.length)directions.push(owners[0][0]===a);}
    if(!directions.length)throw new Error('Die neue Fläche muss mindestens eine vorhandene offene Randkante verwenden.');if(directions.some(v=>v!==directions[0]))throw new Error('Eckpunktreihenfolge passt nicht zu den offenen Rändern. Punkte entlang der Fläche wählen.');if(directions[0])ring.reverse();
    triangulateCutFace(mesh,{vertices:ring},eps);const p=ring.map(v=>mesh.vertices[v]),area=p.reduce((sum,v,i)=>add(sum,cross(sub(v,p[0]),sub(p[(i+1)%p.length],p[0]))),[0,0,0]);
    const first=ring.findIndex((v,i)=>dot(cross(sub(mesh.vertices[ring[(i+1)%ring.length]],mesh.vertices[v]),sub(mesh.vertices[ring[(i+2)%ring.length]],mesh.vertices[v])),area)>eps**4);if(first<0)throw new Error('Neue Fläche ist entartet.');ring=[...ring.slice(first),...ring.slice(0,first)];
    const canonical=ring.indexOf([...ring].sort()[0]),ancestry=[...ring.slice(canonical),...ring.slice(0,canonical)],id=`${step.id}/manual/f/${ancestryHash(JSON.stringify(ancestry))}`;if(usedIds.has(id))throw new Error('Neue Fläche existiert bereits.');usedIds.add(id);faces.push({id,vertices:ring});
  }
  if(faces.length>32000)throw new Error('Reparatur überschreitet 32.000 Flächen.');let out={vertices:mesh.vertices,faces};validateMesh(out,{allowOpen});
  if(!allowOpen){out=pruneMesh(out,faces);const edges=new Map(),fans=new Map();for(const f of out.faces)for(let i=0;i<f.vertices.length;i++){const a=f.vertices[i],b=f.vertices[(i+1)%f.vertices.length],k=key(a,b);if(!edges.has(k))edges.set(k,[]);edges.get(k).push(f.id);if(!fans.has(a))fans.set(a,new Map());fans.get(a).set(f.id,key(f.vertices[(i+f.vertices.length-1)%f.vertices.length],a));}for(const fan of fans.values()){const start=fan.keys().next().value,seen=new Set();let next=start;while(fan.has(next)&&!seen.has(next)){seen.add(next);next=edges.get(fan.get(next)).find(f=>f!==next);}if(next!==start||seen.size!==fan.size)throw new Error('Reparatur erzeugt nur punktweise verbundene Flächenfächer.');}}
  return out;
}
function validateTriangulateParams(params){if(params.groups!==undefined)validatePartGroups(params);}
export function triangulateFaces(mesh,step){
  validateTriangulateParams(step.params);validateMesh(mesh);
  const selected=step.params.groups===undefined?new Set(mesh.faces.map(f=>f.id)):new Set(step.params.groups.flat(2)),existing=new Set(mesh.faces.map(f=>f.id));
  if([...selected].some(id=>!existing.has(id)))throw new Error('Triangulierungsfläche fehlt. Auswahl vor dem Schritt neu zuordnen.');
  const count=mesh.faces.reduce((n,f)=>n+(selected.has(f.id)?f.vertices.length-2:1),0);if(count>SUBDIVISION_FACE_LIMIT)throw new Error('Triangulierung überschreitet 32.000 Flächen.');
  const eps=Math.max(1e-8,viewBounds(Object.values(mesh.vertices)).radius*1e-8),faces=[],ids=new Set(existing);
  for(const f of mesh.faces){if(!selected.has(f.id)||f.vertices.length===3){faces.push(f);continue;}
    const start=f.vertices.indexOf([...f.vertices].sort()[0]),ring=[...f.vertices.slice(start),...f.vertices.slice(0,start)];
    for(const vertices of triangulateCutFace(mesh,{...f,vertices:ring},eps)){const id=`${step.id}/tri/f/${ancestryHash(JSON.stringify([f.id,[...vertices].sort()]))}`;if(ids.has(id))throw new Error('Kollision der Triangulierungsreferenzen.');ids.add(id);faces.push({id,vertices});}
  }
  const out={vertices:mesh.vertices,faces};validateMesh(out);return out;
}
// Loop interior masks: beta=(5/8-(3/8+cos(2pi/n)/4)^2)/n;
// edge point = 3/8 of each endpoint + 1/8 of each opposite corner.
export function loopSubdivide(mesh,step){
  const levels=step.params.levels;if(!Number.isInteger(levels)||levels<1||levels>2)throw new Error('Loop: erlaubt sind 1 oder 2 Stufen.');validateMesh(mesh);
  if(mesh.faces.some(f=>f.vertices.length!==3))throw new Error('Loop benötigt ein reines Dreiecksnetz. Zuerst das gesamte Modell triangulieren.');
  let current=mesh;
  for(let level=1;level<=levels;level++){
    if(current.faces.length*4>SUBDIVISION_FACE_LIMIT)throw new Error('Loop überschreitet 32.000 Flächen. Stufe reduzieren.');
    const key=(a,b)=>JSON.stringify([a,b].sort()),edges=new Map(),fans=new Map(),neighbors=new Map();
    for(const f of current.faces)for(let i=0;i<3;i++){
      const a=f.vertices[i],b=f.vertices[(i+1)%3],opposite=f.vertices[(i+2)%3],e=key(a,b);if(!edges.has(e))edges.set(e,[]);edges.get(e).push({face:f.id,opposite});
      if(!fans.has(a))fans.set(a,new Map());fans.get(a).set(f.id,key(opposite,a));if(!neighbors.has(a))neighbors.set(a,new Set());neighbors.get(a).add(b);neighbors.get(a).add(opposite);
    }
    if(fans.size!==Object.keys(current.vertices).length)throw new Error('Loop benötigt ein Netz ohne isolierte Punkte.');
    if(fans.size+edges.size>64000)throw new Error('Loop überschreitet 64.000 Punkte.');
    const vertices={},faces=[],vid=new Map(),eid=new Map(),provenance=new Map();
    const identify=(kind,source)=>{const raw=JSON.stringify(source),id=`${step.id}/loop${level}/${kind}/${ancestryHash(raw)}`;if(provenance.has(id)&&provenance.get(id)!==raw)throw new Error('Kollision der Loop-Referenzen.');provenance.set(id,raw);return id;};
    for(const [v,fan] of fans){
      const start=[...fan.keys()].sort()[0],visited=new Set();let next=start;while(fan.has(next)&&!visited.has(next)){visited.add(next);next=edges.get(fan.get(next)).find(h=>h.face!==next)?.face;}
      const ns=[...neighbors.get(v)].sort(),n=ns.length;if(next!==start||visited.size!==fan.size||n<3||n!==fan.size)throw new Error('Loop benötigt geschlossene zusammenhängende Flächenfächer ohne berührende Punkte.');
      const beta=(5/8-(3/8+Math.cos(2*Math.PI/n)/4)**2)/n,id=identify('v',v);vid.set(v,id);vertices[id]=add(mul(current.vertices[v],1-n*beta),mul(ns.map(x=>current.vertices[x]).reduce(add,[0,0,0]),beta));
    }
    for(const [e,halves] of edges){const [a,b]=JSON.parse(e),opposite=halves.map(h=>h.opposite).sort(),id=identify('e',[a,b]);eid.set(e,id);vertices[id]=add(mul(add(current.vertices[a],current.vertices[b]),3/8),mul(add(current.vertices[opposite[0]],current.vertices[opposite[1]]),1/8));}
    for(const f of current.faces){const [a,b,c]=f.vertices,ab=eid.get(key(a,b)),bc=eid.get(key(b,c)),ca=eid.get(key(c,a));
      for(const [corner,ring] of [[a,[vid.get(a),ab,ca]],[b,[vid.get(b),bc,ab]],[c,[vid.get(c),ca,bc]],['center',[ab,bc,ca]]])faces.push({id:identify('f',[f.id,corner]),vertices:ring});
    }
    current={vertices,faces};validateMesh(current);
  }
  return current;
}
export function subdivide(mesh,step) {
  const levels=step.params.levels;
  if(!Number.isInteger(levels)||levels<1||levels>2) throw new Error('Subdivision: erlaubt sind 1 oder 2 Stufen.');
  validateMesh(mesh);
  let current=mesh;
  for(let level=1;level<=levels;level++) {
    if(current.faces.reduce((n,f)=>n+f.vertices.length,0)>SUBDIVISION_FACE_LIMIT) throw new Error(`Subdivision überschreitet die Grenze von ${SUBDIVISION_FACE_LIMIT} Flächen. Stufe reduzieren oder früheren Schritt unterdrücken.`);
    const edges=new Map(),incidence=new Map(),facePoints=new Map(),vertices={},faces=[],provenance=new Map();
    const identify=(kind,source)=>{
      const key=JSON.stringify(source),id=`${step.id}/cc${level}/${kind}/${ancestryHash(key)}`;
      if(provenance.has(id)&&provenance.get(id)!==key)throw new Error('Kollision der Subdivision-Referenzen.');
      provenance.set(id,key);return id;
    };
    const edgeKey=(a,b)=>JSON.stringify([a,b].sort());
    const incident=id=>{if(!incidence.has(id))incidence.set(id,{faces:new Set(),edges:new Set()});return incidence.get(id);};
    for(const face of current.faces) {
      facePoints.set(face.id,center(current,face));
      for(let i=0;i<face.vertices.length;i++) {
        const a=face.vertices[i],b=face.vertices[(i+1)%face.vertices.length],key=edgeKey(a,b);
        if(!edges.has(key))edges.set(key,{ends:[a,b].sort(),faces:[]});
        edges.get(key).faces.push(face.id);incident(a).faces.add(face.id);incident(a).edges.add(key);incident(b).edges.add(key);
      }
    }
    const vertexIds=new Map(),edgeIds=new Map(),faceIds=new Map();
    for(const [id,links] of incidence) {
      const n=links.edges.size;
      if(n<3||links.faces.size!==n)throw new Error('Subdivision benötigt geschlossene Mannigfaltigkeiten ohne isolierte oder berührende Fächer.');
      // The incident faces must form one cycle around this vertex (no pinched vertices).
      const adjacent=new Map([...links.faces].map(f=>[f,new Set()]));
      for(const key of links.edges){const fs=edges.get(key).faces;adjacent.get(fs[0]).add(fs[1]);adjacent.get(fs[1]).add(fs[0]);}
      const reached=new Set(),pending=[[...links.faces][0]];
      while(pending.length){const f=pending.pop();if(reached.has(f))continue;reached.add(f);pending.push(...adjacent.get(f));}
      if(reached.size!==n)throw new Error('Subdivision: mehrere Flächenfächer berühren denselben Punkt.');
      const p=current.vertices[id];
      const f=mul([...links.faces].sort().map(fid=>facePoints.get(fid)).reduce(add,[0,0,0]),1/n);
      const r=mul([...links.edges].sort().map(key=>mul(edges.get(key).ends.map(v=>current.vertices[v]).reduce(add,[0,0,0]),.5)).reduce(add,[0,0,0]),1/n);
      const next=identify('v',id);vertexIds.set(id,next);vertices[next]=mul(add(add(f,mul(r,2)),mul(p,n-3)),1/n);
    }
    for(const [key,edge] of edges) {
      const next=identify('e',edge.ends);edgeIds.set(key,next);
      vertices[next]=mul([...edge.ends.map(id=>current.vertices[id]),...edge.faces.sort().map(id=>facePoints.get(id))].reduce(add,[0,0,0]),.25);
    }
    for(const face of current.faces){const next=identify('f',face.id);faceIds.set(face.id,next);vertices[next]=facePoints.get(face.id);}
    for(const face of current.faces) for(let i=0;i<face.vertices.length;i++) {
      const ring=face.vertices,a=ring[i],b=ring[(i+1)%ring.length],prev=ring[(i+ring.length-1)%ring.length];
      faces.push({id:identify('q',[face.id,a]),vertices:[vertexIds.get(a),edgeIds.get(edgeKey(a,b)),faceIds.get(face.id),edgeIds.get(edgeKey(prev,a))]});
    }
    current={vertices,faces};validateMesh(current);
  }
  return current;
}
// Akleman/Srinivasan Honeycomb (2002), t=1/2, a=0.45+1.25/N.
// Each oriented face-edge owns a point. Old vertex fans become 2k-gons.
export function honeycomb(mesh,step){
  const levels=step.params.levels;
  if(!Number.isInteger(levels)||levels<1||levels>2)throw new Error('Honeycomb: erlaubt sind 1 oder 2 Stufen.');
  validateMesh(mesh);let current=mesh;
  for(let level=1;level<=levels;level++){
    const edges=new Map(),fans=new Map(),points=new Map(),vertices={},faces=[],provenance=new Map(),key=(a,b)=>JSON.stringify([a,b].sort());
    const identify=(kind,source)=>{const raw=JSON.stringify(source),id=`${step.id}/hc${level}/${kind}/${ancestryHash(raw)}`;if(provenance.has(id)&&provenance.get(id)!==raw)throw new Error('Kollision der Honeycomb-Referenzen.');provenance.set(id,raw);return id;};
    for(const f of current.faces)for(let i=0;i<f.vertices.length;i++){
      const a=f.vertices[i],b=f.vertices[(i+1)%f.vertices.length],incoming=key(f.vertices[(i+f.vertices.length-1)%f.vertices.length],a),outgoing=key(a,b);
      if(!edges.has(outgoing))edges.set(outgoing,[]);edges.get(outgoing).push({face:f.id,a,b});
      if(!fans.has(a))fans.set(a,new Map());fans.get(a).set(f.id,{incoming,outgoing});
    }
    if(current.faces.length+fans.size>SUBDIVISION_FACE_LIMIT||2*edges.size>64000)throw new Error('Honeycomb überschreitet 32.000 Flächen oder 64.000 Punkte. Stufe reduzieren.');
    if(fans.size!==Object.keys(current.vertices).length)throw new Error('Honeycomb benötigt ein Netz ohne isolierte Punkte.');
    const cycles=new Map();for(const [v,fan] of fans){
      const start=[...fan.keys()].sort()[0],visited=new Set(),cycle=[];let next=start;
      while(fan.has(next)&&!visited.has(next)){visited.add(next);cycle.push(next);next=edges.get(fan.get(next).incoming).find(h=>h.face!==next)?.face;}
      if(next!==start||visited.size!==fan.size||cycle.length<3)throw new Error('Honeycomb benötigt geschlossene zusammenhängende Flächenfächer ohne berührende Punkte.');cycles.set(v,cycle);
    }
    for(const f of current.faces){
      const start=f.vertices.indexOf([...f.vertices].sort()[0]),ring=[...f.vertices.slice(start),...f.vertices.slice(0,start)],n=ring.length,mid=ring.map((v,i)=>mul(add(current.vertices[v],current.vertices[ring[(i+1)%n]]),.5));
      let sum=[0,0,0],cosine=[0,0,0],sine=[0,0,0];
      for(let j=0;j<n;j++){const angle=2*Math.PI*j/n;sum=add(sum,mid[j]);cosine=add(cosine,mul(mid[j],Math.cos(angle)));sine=add(sine,mul(mid[j],Math.sin(angle)));}
      const a=.45+1.25/n,w=(1-a)/(3*n-5),ids=new Map();points.set(f.id,ids);
      for(let j=0;j<n;j++){const edge=key(ring[j],ring[(j+1)%n]),id=identify('p',[f.id,edge]),angle=2*Math.PI*j/n;ids.set(edge,id);vertices[id]=add(mul(mid[j],a-5*w),mul(add(mul(sum,3),add(mul(cosine,2*Math.cos(angle)),mul(sine,2*Math.sin(angle)))),w));}
      faces.push({id:identify('f',f.id),vertices:ring.map((v,j)=>ids.get(key(v,ring[(j+1)%n])))});
    }
    for(const [v,cycle] of cycles){const ring=cycle.flatMap(f=>{const h=fans.get(v).get(f),ids=points.get(f);return [ids.get(h.outgoing),ids.get(h.incoming)];});faces.push({id:identify('v',v),vertices:ring});}
    current={vertices,faces};validateMesh(current);
  }
  return current;
}
// Doo-Sabin cosine mask: delta(i,j)/4 + (3+2*cos(2*pi*(i-j)/n))/(4*n).
// Harmonic sums evaluate all face corners in linear time, including large n-gons.
export function dooSabin(mesh,step) {
  const levels=step.params.levels;
  if(!Number.isInteger(levels)||levels<1||levels>2)throw new Error('Doo-Sabin: erlaubt sind 1 oder 2 Stufen.');
  validateMesh(mesh);
  let current=mesh;
  for(let level=1;level<=levels;level++) {
    const edges=new Map(),fans=new Map(),corners=new Map(),vertices={},faces=[],provenance=new Map();
    const identify=(kind,source)=>{
      const key=JSON.stringify(source),id=`${step.id}/ds${level}/${kind}/${ancestryHash(key)}`;
      if(provenance.has(id)&&provenance.get(id)!==key)throw new Error('Kollision der Doo-Sabin-Referenzen.');
      provenance.set(id,key);return id;
    };
    const edgeKey=(a,b)=>JSON.stringify([a,b].sort());
    for(const face of current.faces)for(let i=0;i<face.vertices.length;i++) {
      const ring=face.vertices,a=ring[i],b=ring[(i+1)%ring.length],key=edgeKey(a,b);
      if(!edges.has(key))edges.set(key,[]);
      edges.get(key).push({face:face.id,a,b});
      if(!fans.has(a))fans.set(a,new Map());
      fans.get(a).set(face.id,edgeKey(ring[(i+ring.length-1)%ring.length],a));
    }
    if(current.faces.length+edges.size+fans.size>SUBDIVISION_FACE_LIMIT)throw new Error(`Doo-Sabin überschreitet die Grenze von ${SUBDIVISION_FACE_LIMIT} Flächen. Stufe reduzieren oder früheren Schritt unterdrücken.`);
    // Walk incoming half-edges, preserving orientation and rejecting pinched fans.
    const cycles=new Map();
    for(const [vertex,fan] of fans) {
      const start=[...fan.keys()].sort()[0],cycle=[],visited=new Set();let next=start;
      while(!visited.has(next)&&fan.has(next)) {
        visited.add(next);cycle.push(next);
        next=edges.get(fan.get(next)).find(h=>h.face!==next)?.face;
      }
      if(next!==start||cycle.length!==fan.size||cycle.length<3)throw new Error('Doo-Sabin benötigt geschlossene, zusammenhängende Flächenfächer ohne berührende Punkte.');
      cycles.set(vertex,cycle);
    }
    for(const face of current.faces) {
      const original=face.vertices,n=original.length;
      const start=original.indexOf([...original].sort()[0]),ring=[...original.slice(start),...original.slice(0,start)];
      let sum=[0,0,0],cosine=[0,0,0],sine=[0,0,0];
      for(let j=0;j<n;j++) {
        const p=current.vertices[ring[j]],angle=2*Math.PI*j/n;
        sum=add(sum,p);cosine=add(cosine,mul(p,Math.cos(angle)));sine=add(sine,mul(p,Math.sin(angle)));
      }
      const ids=new Map();corners.set(face.id,ids);
      for(let i=0;i<n;i++) {
        const v=ring[i],id=identify('c',[face.id,v]),angle=2*Math.PI*i/n;ids.set(v,id);
        vertices[id]=add(mul(current.vertices[v],.25),mul(add(mul(sum,3),add(mul(cosine,2*Math.cos(angle)),mul(sine,2*Math.sin(angle)))),1/(4*n)));
      }
      faces.push({id:identify('f',face.id),vertices:ring.map(v=>ids.get(v))});
    }
    for(const halves of edges.values()) {
      const [a,b]=[...halves].sort((x,y)=>x.face.localeCompare(y.face)),ca=corners.get(a.face),cb=corners.get(b.face);
      faces.push({id:identify('e',[a.a,a.b].sort()),vertices:[ca.get(a.b),ca.get(a.a),cb.get(a.a),cb.get(a.b)]});
    }
    for(const [vertex,cycle] of cycles)faces.push({id:identify('v',vertex),vertices:cycle.map(f=>corners.get(f).get(vertex))});
    current={vertices,faces};validateMesh(current);
  }
  return current;
}
function validateDualParams(params) {
  if(typeof params.scale!=='number'||!Number.isFinite(params.scale)||params.scale<.1||params.scale>4)throw new Error('Dualnetz: Größenfaktor von 0,1 bis 4 angeben.');
}
export function dual(mesh,step) {
  validateDualParams(step.params);validateMesh(mesh);
  const edges=new Map(),fans=new Map(),vertices={},faces=[],provenance=new Map();
  const edgeKey=(a,b)=>JSON.stringify([a,b].sort());
  const identify=(kind,source)=>{
    const key=JSON.stringify(source),id=`${step.id}/dual/${kind}/${ancestryHash(key)}`;
    if(provenance.has(id)&&provenance.get(id)!==key)throw new Error('Kollision der Dualnetz-Referenzen.');
    provenance.set(id,key);return id;
  };
  for(const face of mesh.faces)for(let i=0;i<face.vertices.length;i++){
    const ring=face.vertices,a=ring[i],b=ring[(i+1)%ring.length],key=edgeKey(a,b);
    if(!edges.has(key))edges.set(key,[]);edges.get(key).push(face.id);
    if(!fans.has(a))fans.set(a,new Map());fans.get(a).set(face.id,edgeKey(ring[(i+ring.length-1)%ring.length],a));
  }
  if(!fans.size)throw new Error('Dualnetz benötigt ein nicht leeres, geschlossenes Netz.');
  if(fans.size!==Object.keys(mesh.vertices).length)throw new Error('Dualnetz: isolierte Punkte entfernen.');
  if(fans.size>SUBDIVISION_FACE_LIMIT||mesh.faces.length>SUBDIVISION_FACE_LIMIT)throw new Error(`Dualnetz überschreitet die Grenze von ${SUBDIVISION_FACE_LIMIT} Punkten oder Flächen.`);
  const pivot=mul([...fans.keys()].sort().map(v=>mesh.vertices[v]).reduce(add,[0,0,0]),1/fans.size),facePoints=new Map();
  for(const face of mesh.faces){
    const id=identify('v',face.id),point=mul([...face.vertices].sort().map(v=>mesh.vertices[v]).reduce(add,[0,0,0]),1/face.vertices.length);
    facePoints.set(face.id,id);vertices[id]=step.params.scale===1?point:add(pivot,mul(sub(point,pivot),step.params.scale));
  }
  // Incoming half-edges order the old incident faces consistently around a vertex.
  for(const [vertex,fan] of fans){
    const start=[...fan.keys()].sort()[0],cycle=[],visited=new Set();let next=start;
    while(!visited.has(next)&&fan.has(next)){
      visited.add(next);cycle.push(next);next=edges.get(fan.get(next)).find(f=>f!==next);
    }
    if(next!==start||cycle.length!==fan.size||cycle.length<3)throw new Error('Dualnetz benötigt geschlossene, zusammenhängende Flächenfächer ohne berührende Punkte.');
    faces.push({id:identify('f',vertex),vertices:cycle.map(f=>facePoints.get(f))});
  }
  const result={vertices,faces};validateMesh(result);return result;
}
export function meshTopology(mesh){
  const stats=validateMesh(mesh),parent=new Map(Object.keys(mesh.vertices).map(v=>[v,v]));
  const root=v=>{let r=v;while(parent.get(r)!==r)r=parent.get(r);while(parent.get(v)!==v){const next=parent.get(v);parent.set(v,r);v=next;}return r;};
  for(const face of mesh.faces)for(const v of face.vertices){const a=root(face.vertices[0]),b=root(v);if(a!==b)parent.set(b,a);}
  const components=new Set([...parent.keys()].map(root)).size,chi=stats.vertices-stats.edges+stats.faces;
  return {...stats,components,chi,genus:(2*components-chi)/2};
}
function validateShellParams(params){
  if(typeof params.thickness!=='number'||!Number.isFinite(params.thickness)||params.thickness<.0001||params.thickness>1000)throw new Error('Wandstärke: erlaubt sind 0,0001 bis 1000.');
  if(!Array.isArray(params.openings)||params.openings.length>2||new Set(params.openings).size!==params.openings.length||params.openings.some(id=>typeof id!=='string'||!id.length||id.length>160))throw new Error('Schale: null bis zwei unterschiedliche Öffnungsflächen angeben.');
}
export function defaultShellThickness(mesh){
  let shortest=Infinity;
  for(const f of mesh.faces)for(let i=0;i<f.vertices.length;i++)shortest=Math.min(shortest,length(sub(mesh.vertices[f.vertices[i]],mesh.vertices[f.vertices[(i+1)%f.vertices.length]])));
  return Math.max(.0001,Math.min(.1,Math.floor(shortest*.05*1e6)/1e6));
}
// Minimum-norm least-squares intersection of incident unit-normal offsets.
// Work in their span to handle flat and edge vertices without regularization.
function shellMiter(normals,fixed=[]){
  const fallback=()=>{
    const fixedBasis=[];for(const n of fixed){let v=[...n];for(const b of fixedBasis)v=sub(v,mul(b,dot(v,b)));if(length(v)>1e-7)fixedBasis.push(mul(v,1/length(v)));}
    let sum=normals.reduce(add,[0,0,0]);for(const b of fixedBasis)sum=sub(sum,mul(b,dot(sum,b)));const span=length(sum);
    if(span<1e-8)throw new Error('Schale: widersprüchliche Ecknormalen. Netz glätten oder vereinfachen.');
    const direction=mul(sum,1/span),projection=normals.map(n=>dot(n,direction));
    if(projection.some(x=>x<=.05))throw new Error('Schale: Ecke lässt keinen stabilen Innenversatz zu. Netz glätten oder vereinfachen.');
    const result=mul(direction,projection.length/projection.reduce((a,b)=>a+b,0));
    if(length(result)>8)throw new Error('Schale: Eckversatz ist zu groß. Netz glätten oder vereinfachen.');
    return result;
  };
  const basis=[];
  for(const n of [...normals,...fixed]){let v=[...n];for(const b of basis)v=sub(v,mul(b,dot(v,b)));if(length(v)>1e-7)basis.push(mul(v,1/length(v)));if(basis.length===3)break;}
  const size=basis.length,rows=Array.from({length:size},()=>Array(size+1).fill(0));
  for(const [list,target] of [[normals,1],[fixed,0]])for(const n of list){const c=basis.map(b=>dot(n,b));for(let i=0;i<size;i++){for(let j=0;j<size;j++)rows[i][j]+=c[i]*c[j];rows[i][size]+=c[i]*target;}}
  for(let i=0;i<size;i++){
    let pivot=i;for(let j=i+1;j<size;j++)if(Math.abs(rows[j][i])>Math.abs(rows[pivot][i]))pivot=j;
    [rows[i],rows[pivot]]=[rows[pivot],rows[i]];const d=rows[i][i];
    if(Math.abs(d)<1e-12)return fallback();
    for(let j=i;j<=size;j++)rows[i][j]/=d;
    for(let k=0;k<size;k++)if(k!==i){const factor=rows[k][i];for(let j=i;j<=size;j++)rows[k][j]-=factor*rows[i][j];}
  }
  const result=basis.map((b,i)=>mul(b,rows[i][size])).reduce(add,[0,0,0]);
  if(!result.every(Number.isFinite)||length(result)>8||normals.some(n=>dot(n,result)<=.05))return fallback();
  return result;
}
function meshVolume(mesh){
  const points=Object.values(mesh.vertices),pivot=mul(points.reduce(add,[0,0,0]),1/points.length);let volume=0;
  for(const f of mesh.faces){const p=f.vertices.map(v=>sub(mesh.vertices[v],pivot));for(let i=1;i<p.length-1;i++)volume+=dot(p[0],cross(p[i],p[i+1]))/6;}
  return volume;
}
export function shell(mesh,step){
  validateShellParams(step.params);const topology=meshTopology(mesh);
  if(topology.components!==1)throw new Error('Schale benötigt eine zusammenhängende geschlossene Außenhülle.');
  const openings=new Set(step.params.openings),byFace=new Map(mesh.faces.map(f=>[f.id,f]));
  if([...openings].some(id=>!byFace.has(id)))throw new Error('Öffnungsfläche fehlt. Öffnungen vor dem Schalenschritt neu auswählen und zuordnen.');
  const edges=new Map(),fans=new Map(),shortest=new Map(),normals=new Map(),edgeKey=(a,b)=>JSON.stringify([a,b].sort());
  for(const face of mesh.faces){
    normals.set(face.id,normal(mesh,face));const ring=face.vertices;
    for(let i=0;i<ring.length;i++){
      const a=ring[i],b=ring[(i+1)%ring.length],key=edgeKey(a,b),span=length(sub(mesh.vertices[a],mesh.vertices[b]));
      if(!edges.has(key))edges.set(key,[]);edges.get(key).push({face:face.id,a,b});
      if(!fans.has(a))fans.set(a,new Map());fans.get(a).set(face.id,edgeKey(ring[(i+ring.length-1)%ring.length],a));
      shortest.set(a,Math.min(shortest.get(a)??Infinity,span));shortest.set(b,Math.min(shortest.get(b)??Infinity,span));
    }
  }
  const boundary=[],degree=new Map(),preserveCut=new Set(openings);
  for(const halves of edges.values()){
    const removed=halves.filter(h=>openings.has(h.face));
    if(removed.length===1){const h=removed[0],neighbor=halves.find(x=>!openings.has(x.face));boundary.push(h);for(const v of [h.a,h.b])degree.set(v,(degree.get(v)??0)+1);
      // A hole inside a coplanar face patch needs the full normal offset;
      // otherwise hold its cut plane, e.g. the flat lip of an open box.
      if(dot(normals.get(h.face),normals.get(neighbor.face))>1-1e-9)preserveCut.delete(h.face);
    }
  }
  if([...degree.values()].some(n=>n!==2))throw new Error('Öffnungen dürfen sich nur entlang gemeinsamer Kanten verbinden, nicht nur an einem Punkt berühren.');
  if(2*(mesh.faces.length-openings.size)+boundary.length>SUBDIVISION_FACE_LIMIT||2*fans.size>64000)throw new Error('Schale überschreitet die Grenze von 32.000 Flächen oder 64.000 Punkten.');
  const inside={},innerIds=new Map(),vertices={...mesh.vertices},faces=[],provenance=new Map();
  const identify=(kind,source)=>{
    const key=JSON.stringify(source),id=`${step.id}/shell/${kind}/${ancestryHash(key)}`;
    if((provenance.has(id)&&provenance.get(id)!==key)||Object.hasOwn(mesh.vertices,id)||byFace.has(id))throw new Error('Kollision der Schalen-Referenzen.');
    provenance.set(id,key);return id;
  };
  for(const [v,fan] of fans){
    const start=[...fan.keys()].sort()[0],visited=new Set();let next=start;
    while(!visited.has(next)&&fan.has(next)){visited.add(next);next=edges.get(fan.get(next)).find(h=>h.face!==next)?.face;}
    if(next!==start||visited.size!==fan.size||fan.size<3)throw new Error('Schale benötigt geschlossene, zusammenhängende Flächenfächer ohne berührende Punkte.');
    const planes=[],fixed=[];for(const f of [...fan.keys()].sort()){const n=normals.get(f),list=preserveCut.has(f)?fixed:planes;if(!list.some(p=>dot(n,p)>1-1e-9))list.push(n);}
    const shift=mul(shellMiter(planes,fixed),step.params.thickness);
    if(length(shift)>=shortest.get(v)*.45)throw new Error('Wandstärke ist für lokale Kanten zu groß. Dicke reduzieren oder gröberes Netz verwenden.');
    inside[v]=sub(mesh.vertices[v],shift);const id=identify('v',v);innerIds.set(v,id);vertices[id]=inside[v];
  }
  for(const face of mesh.faces){
    const n=normals.get(face.id),ring=face.vertices;
    if(dot(n,normal({vertices:inside},face))<=.05)throw new Error('Innenhülle klappt um. Wandstärke reduzieren.');
    for(let i=0;i<ring.length;i++){
      const a=ring[i],b=ring[(i+1)%ring.length],edge=sub(mesh.vertices[b],mesh.vertices[a]);
      if(dot(edge,sub(inside[b],inside[a]))<=1e-6*dot(edge,edge))throw new Error('Innenkante fällt zusammen oder klappt um. Wandstärke reduzieren.');
    }
    if(!openings.has(face.id))faces.push(face,{id:identify('f',face.id),vertices:[...ring].reverse().map(v=>innerIds.get(v))});
  }
  const outerVolume=meshVolume(mesh),innerVolume=meshVolume({vertices:inside,faces:mesh.faces});
  if(!Number.isFinite(outerVolume)||!Number.isFinite(innerVolume)||innerVolume<=0||outerVolume<=innerVolume)throw new Error('Schale benötigt eine nach außen orientierte Hülle mit gültigem Innenraum. Wandstärke oder Netz prüfen.');
  for(const h of boundary)faces.push({id:identify('r',[h.face,h.a,h.b]),vertices:[h.a,h.b,innerIds.get(h.b),innerIds.get(h.a)]});
  const used=new Set(faces.flatMap(f=>f.vertices)),result={vertices:Object.fromEntries(Object.entries(vertices).filter(([id])=>used.has(id))),faces};
  validateMesh(result);return result;
}
function validateBevelParams(params){
  validateSplitParams({edges:params.edges,segments:2});
  if(typeof params.width!=='number'||!Number.isFinite(params.width)||params.width<.0001||params.width>1000)throw new Error('Fasenbreite: erlaubt sind 0,0001 bis 1000.');
}
export function bevelEdges(mesh,step){
  validateBevelParams(step.params);validateMesh(mesh);
  if(meshTopology(mesh).components!==1)throw new Error('Bevel benötigt eine zusammenhängende konvexe Außenhülle.');
  const span=viewBounds(Object.values(mesh.vertices)).radius,tol=Math.max(1e-9,span*1e-8),halfedges=new Map();
  const key=(a,b)=>JSON.stringify([a,b].sort());
  for(const f of mesh.faces){const n=normal(mesh,f),p=mesh.vertices[f.vertices[0]];
    if(f.vertices.some(v=>Math.abs(dot(n,sub(mesh.vertices[v],p)))>tol)||Object.values(mesh.vertices).some(v=>dot(n,sub(v,p))>tol))throw new Error('Bevel unterstützt zunächst ebene Flächen einer konvexen Außenhülle. Vor dem Glätten anwenden.');
    for(let i=0;i<f.vertices.length;i++){const a=f.vertices[i],b=f.vertices[(i+1)%f.vertices.length],k=key(a,b);if(!halfedges.has(k))halfedges.set(k,[]);halfedges.get(k).push(n);}
  }
  const planes=step.params.edges.map(e=>{const k=key(...e),ns=halfedges.get(k);if(!ns)throw new Error('Fasenkante fehlt. Vor dem Schritt auswählen und neu zuordnen.');const cosine=dot(ns[0],ns[1]),sum=add(ns[0],ns[1]);if(cosine>1-1e-8||length(sum)<1e-6)throw new Error('Bevel benötigt eine räumliche Kante zwischen zwei unterschiedlichen Flächen.');const n=mul(sum,1/length(sum));return {key:k,n,d:dot(n,mesh.vertices[e[0]])-step.params.width*Math.sqrt(Math.max(0,(1-cosine)/2))};}).sort((a,b)=>a.key.localeCompare(b.key));
  let vertices={...mesh.vertices},faces=mesh.faces;const provenance=new Map();
  const identify=(kind,source)=>{const k=JSON.stringify(source),id=`${step.id}/bevel/${kind}/${ancestryHash(k)}`;if(Object.hasOwn(mesh.vertices,id)||mesh.faces.some(f=>f.id===id)||(provenance.has(id)&&provenance.get(id)!==k))throw new Error('Kollision der Fasenreferenzen.');provenance.set(id,k);return id;};
  const orient=(ring,n)=>{for(let i=0;i<ring.length;i++){const a=vertices[ring[i]],b=vertices[ring[(i+1)%ring.length]],c=vertices[ring[(i+2)%ring.length]],crossing=cross(sub(b,a),sub(c,a));if(length(crossing)>1e-10&&dot(crossing,n)>0)return [...ring.slice(i),...ring.slice(0,i)];}throw new Error('Fase fällt zusammen. Breite reduzieren.');};
  for(const plane of planes){const output=[],boundary=new Set(),dist=id=>dot(plane.n,vertices[id])-plane.d;let cut=false;
    const intersection=(a,b,da,db)=>{if(Math.abs(da)<=tol)return a;if(Math.abs(db)<=tol)return b;const pair=[a,b].sort(),id=identify('v',[plane.key,...pair]);if(!Object.hasOwn(vertices,id)){const pa=vertices[pair[0]],pb=vertices[pair[1]],va=dist(pair[0]),vb=dist(pair[1]);vertices[id]=add(pa,mul(sub(pb,pa),va/(va-vb)));}return id;};
    for(const f of faces){const ring=f.vertices,out=[];let removed=false;
      for(let i=0;i<ring.length;i++){const a=ring[i],b=ring[(i+1)%ring.length],da=dist(a),db=dist(b),ina=da<=tol,inb=db<=tol;if(ina)out.push(a);else removed=true;if(ina!==inb){const id=intersection(a,b,da,db);out.push(id);boundary.add(id);cut=true;}}
      const clean=out.filter((v,i)=>v!==out[(i+out.length-1)%out.length]);if(clean.length<3)throw new Error('Fasenbreite entfernt eine ganze Fläche. Breite reduzieren.');
      output.push(removed?{id:f.id,vertices:orient(clean,normal({vertices},f))}:f);
    }
    if(!cut||boundary.size<3)throw new Error('Fasenkanten überlappen oder Fase fällt zusammen. Breite reduzieren.');
    const ids=[...boundary].sort(),center=mul(ids.map(v=>vertices[v]).reduce(add,[0,0,0]),1/ids.length),axis=mul(sub(vertices[ids[0]],center),1/length(sub(vertices[ids[0]],center))),other=cross(plane.n,axis);
    ids.sort((a,b)=>Math.atan2(dot(sub(vertices[a],center),other),dot(sub(vertices[a],center),axis))-Math.atan2(dot(sub(vertices[b],center),other),dot(sub(vertices[b],center),axis)));
    output.push({id:identify('face',plane.key),vertices:orient(ids,plane.n)});faces=output;
    const used=new Set(faces.flatMap(f=>f.vertices));vertices=Object.fromEntries(Object.entries(vertices).filter(([id])=>used.has(id)));
    if(faces.length>SUBDIVISION_FACE_LIMIT||used.size>64000)throw new Error('Bevel überschreitet 32.000 Flächen oder 64.000 Punkte.');validateMesh({vertices,faces});
  }
  return {vertices,faces};
}
function validateLocalFacesParams(params){validateStellateParams({height:0,faces:params.faces});}
export function subdivideFaces(mesh,step){
  validateLocalFacesParams(step.params);validateMesh(mesh);
  const selected=new Set(step.params.faces),edges=new Map(),byFace=new Map(mesh.faces.map(f=>[f.id,f]));
  if([...selected].some(id=>!byFace.has(id)))throw new Error('Unterteilungsfläche fehlt. Vor dem Schritt Flächen auswählen und neu zuordnen.');
  const key=(a,b)=>JSON.stringify([a,b].sort());let count=mesh.faces.length;
  for(const id of selected){const f=byFace.get(id);count+=f.vertices.length-1;for(let i=0;i<f.vertices.length;i++){const a=f.vertices[i],b=f.vertices[(i+1)%f.vertices.length];edges.set(key(a,b),[a,b].sort());}}
  if(count>SUBDIVISION_FACE_LIMIT||Object.keys(mesh.vertices).length+edges.size+selected.size>64000)throw new Error('Lokale Unterteilung überschreitet 32.000 Flächen oder 64.000 Punkte.');
  // Reuse the planar convex face checks; no output from this validation is kept.
  stellate(mesh,{id:step.id,params:{height:0,faces:step.params.faces}});
  const vertices={...mesh.vertices},faces=[],midpoints=new Map(),provenance=new Map();
  const identify=(kind,source)=>{const k=JSON.stringify(source),id=`${step.id}/localfaces/${kind}/${ancestryHash(k)}`;if(Object.hasOwn(mesh.vertices,id)||byFace.has(id)||(provenance.has(id)&&provenance.get(id)!==k))throw new Error('Kollision der lokalen Unterteilungsreferenzen.');provenance.set(id,k);return id;};
  for(const [k,[a,b]] of edges){const id=identify('e',[a,b]);vertices[id]=mul(add(vertices[a],vertices[b]),.5);midpoints.set(k,id);}
  for(const f of mesh.faces){const ring=f.vertices;
    if(selected.has(f.id)){
      const center=identify('center',f.id);vertices[center]=mul([...ring].sort().map(v=>vertices[v]).reduce(add,[0,0,0]),1/ring.length);
      for(let i=0;i<ring.length;i++){const v=ring[i],next=ring[(i+1)%ring.length],prev=ring[(i+ring.length-1)%ring.length];faces.push({id:identify('quad',[f.id,v]),vertices:[v,midpoints.get(key(v,next)),center,midpoints.get(key(prev,v))]});}
    }else{
      let out=[],changed=false;for(let i=0;i<ring.length;i++){const a=ring[i],b=ring[(i+1)%ring.length];out.push(a);const mid=midpoints.get(key(a,b));if(mid){out.push(mid);changed=true;}}
      if(!changed){faces.push(f);continue;}
      const n=normal(mesh,f);let start=-1;
      for(let i=0;i<out.length;i++){const a=vertices[out[i]],b=vertices[out[(i+1)%out.length]],c=vertices[out[(i+2)%out.length]],crossing=cross(sub(b,a),sub(c,a));if(length(crossing)>1e-10&&dot(mul(crossing,1/length(crossing)),n)>.999999){start=i;break;}}
      if(start<0)throw new Error('Nachbarfläche hat keine stabile Orientierung.');
      out=[...out.slice(start),...out.slice(0,start)];faces.push({id:f.id,vertices:out});
    }
  }
  const result={vertices,faces};validateMesh(result);return result;
}
// Dissolve a planar patch by removing selected internal edges together.
function validateDissolveParams(params){
  try{validateSplitParams({...params,segments:2});}catch{throw new Error('Kanten auflösen: 1–32 unterschiedliche Bezugskanten angeben.');}
}
export function dissolveEdges(mesh,step){
  validateDissolveParams(step.params);validateMesh(mesh);
  const key=(a,b)=>JSON.stringify([a,b].sort()),edges=new Map(),selected=new Set(step.params.edges.map(e=>key(...e))),parent=mesh.faces.map((_,i)=>i);
  const find=i=>{while(parent[i]!==i)i=parent[i];return i;};
  for(const [i,f] of mesh.faces.entries())for(let j=0;j<f.vertices.length;j++){
    const a=f.vertices[j],b=f.vertices[(j+1)%f.vertices.length],k=key(a,b);if(!edges.has(k))edges.set(k,[]);edges.get(k).push({i,a,b});
  }
  for(const k of selected){const pair=edges.get(k);if(!pair||pair.length!==2)throw new Error('Bezugskante fehlt. Kanten vor dem Schritt neu auswählen.');parent[find(pair[1].i)]=find(pair[0].i);}
  const groups=new Map();for(let i=0;i<parent.length;i++){const r=find(i);if(!groups.has(r))groups.set(r,[]);groups.get(r).push(i);}
  const faces=[],usedIds=new Set(mesh.faces.map(f=>f.id));
  for(const indices of groups.values()){
    if(indices.length===1){faces.push(mesh.faces[indices[0]]);continue;}
    const members=new Set(indices),sources=indices.map(i=>mesh.faces[i]).sort((a,b)=>a.id.localeCompare(b.id)),n=normal(mesh,sources[0]),origin=mesh.vertices[sources[0].vertices[0]],points=sources.flatMap(f=>f.vertices.map(v=>mesh.vertices[v]));
    const scale=Math.max(1,...points.map(p=>length(sub(p,origin)))),eps=scale*1e-8;
    if(sources.some(f=>dot(normal(mesh,f),n)<1-1e-8)||points.some(p=>Math.abs(dot(sub(p,origin),n))>eps))throw new Error('Kanten auflösen: angrenzende Flächen müssen in derselben Ebene liegen.');
    const boundary=[];
    for(const pair of edges.values()){
      const inside=pair.filter(e=>members.has(e.i));if(inside.length===2){if(!selected.has(key(inside[0].a,inside[0].b)))throw new Error('Alle inneren Kanten der zusammengeführten Fläche auswählen.');}
      else if(inside.length===1)boundary.push(inside[0]);
    }
    if(boundary.length<3||boundary.length>256)throw new Error('Kanten auflösen: ein einfacher Rand mit 3–256 Punkten ist erforderlich.');
    const next=new Map(),incoming=new Set();for(const e of boundary){if(next.has(e.a)||incoming.has(e.b))throw new Error('Kanten auflösen: verzweigter Rand ist nicht möglich.');next.set(e.a,e.b);incoming.add(e.b);}
    const start=[...next.keys()].sort()[0],ring=[];let v=start;
    do{if(ring.includes(v)||!next.has(v))throw new Error('Kanten auflösen: ungültiger Rand.');ring.push(v);v=next.get(v);}while(v!==start);
    if(ring.length!==boundary.length)throw new Error('Kanten auflösen: Flächen mit Löchern oder mehreren Rändern sind nicht möglich.');
    // Check nonadjacent boundary segments in the dominant projection.
    const drop=n.map(Math.abs).indexOf(Math.max(...n.map(Math.abs))),axes=[0,1,2].filter(a=>a!==drop),xy=ring.map(v=>axes.map(a=>mesh.vertices[v][a])),area=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
    for(let i=0;i<ring.length;i++)for(let j=i+1;j<ring.length;j++){
      if(j===i+1||(i===0&&j===ring.length-1))continue;
      const a=xy[i],b=xy[(i+1)%ring.length],c=xy[j],d=xy[(j+1)%ring.length];
      const sign=x=>Math.abs(x)<=eps*scale?0:Math.sign(x);
      if(sign(area(a,b,c))*sign(area(a,b,d))<=0&&sign(area(c,d,a))*sign(area(c,d,b))<=0&&[0,1].every(k=>Math.max(Math.min(a[k],b[k]),Math.min(c[k],d[k]))<=Math.min(Math.max(a[k],b[k]),Math.max(c[k],d[k]))+eps))throw new Error('Kanten auflösen: Rand berührt oder überschneidet sich selbst.');
    }
    const first=ring.findIndex((v,i)=>dot(cross(sub(mesh.vertices[ring[(i+1)%ring.length]],mesh.vertices[v]),sub(mesh.vertices[ring[(i+2)%ring.length]],mesh.vertices[v])),n)>eps*eps);
    if(first<0)throw new Error('Kanten auflösen: Fläche ist entartet.');
    const id=`${step.id}/dissolve/f/${ancestryHash(JSON.stringify(sources.map(f=>f.id)))}`;if(usedIds.has(id))throw new Error('Kollision der Flächenreferenzen.');usedIds.add(id);
    faces.push({id,vertices:[...ring.slice(first),...ring.slice(0,first)]});
  }
  const used=new Set(faces.flatMap(f=>f.vertices)),vertices=Object.fromEntries(Object.entries(mesh.vertices).filter(([id])=>used.has(id))),result={vertices,faces};validateMesh(result);return result;
}
function validateSplitParams(params){
  if(!Number.isInteger(params.segments)||params.segments<2||params.segments>16)throw new Error('Kantenunterteilung: 2–16 Abschnitte angeben.');
  if(!Array.isArray(params.edges)||params.edges.length<1||params.edges.length>32||params.edges.some(e=>!Array.isArray(e)||e.length!==2||e[0]===e[1]||e.some(v=>typeof v!=='string'||!v.length||v.length>160))||new Set(params.edges.map(e=>JSON.stringify([...e].sort()))).size!==params.edges.length)throw new Error('Kantenunterteilung: 1–32 unterschiedliche Kanten angeben.');
}
export function splitEdges(mesh,step){
  validateSplitParams(step.params);validateMesh(mesh);
  const key=(a,b)=>JSON.stringify([a,b].sort()),existing=new Set();
  for(const f of mesh.faces)for(let i=0;i<f.vertices.length;i++)existing.add(key(f.vertices[i],f.vertices[(i+1)%f.vertices.length]));
  const selected=new Map(step.params.edges.map(e=>[key(...e),[...e].sort()]));
  if([...selected.keys()].some(k=>!existing.has(k)))throw new Error('Bezugskante fehlt. Vor dem Schritt Kanten auswählen und neu zuordnen.');
  if(Object.keys(mesh.vertices).length+selected.size*(step.params.segments-1)>64000||mesh.faces.length>SUBDIVISION_FACE_LIMIT)throw new Error('Kantenunterteilung überschreitet 64.000 Punkte oder 32.000 Flächen.');
  const vertices={...mesh.vertices},rings=new Map(),provenance=new Map(),faces=[];
  for(const [k,[a,b]] of selected){const ring=[a];for(let i=1;i<step.params.segments;i++){
    const source=JSON.stringify([a,b,step.params.segments,i]),id=`${step.id}/split/v/${ancestryHash(source)}`;
    if(Object.hasOwn(mesh.vertices,id)||(provenance.has(id)&&provenance.get(id)!==source))throw new Error('Kollision der Kantenpunkt-Referenzen.');
    provenance.set(id,source);vertices[id]=add(mesh.vertices[a],mul(sub(mesh.vertices[b],mesh.vertices[a]),i/step.params.segments));ring.push(id);
  }ring.push(b);rings.set(k,ring);}
  for(const face of mesh.faces){let ring=[],changed=false;
    for(let i=0;i<face.vertices.length;i++){const a=face.vertices[i],b=face.vertices[(i+1)%face.vertices.length],part=rings.get(key(a,b));if(!part){ring.push(a);continue;}changed=true;ring.push(...(part[0]===a?part:[...part].reverse()).slice(0,-1));}
    if(!changed){faces.push(face);continue;}
    // The legacy renderer uses the first three corners. Start at the original
    // first corner's incoming segment to avoid a collinear leading triple.
    const corner=ring.indexOf(face.vertices[1]),start=(corner+ring.length-1)%ring.length;
    ring=[...ring.slice(start),...ring.slice(0,start)];
    faces.push({id:face.id,vertices:ring});
  }
  const result={vertices,faces};validateMesh(result);return result;
}
function validateMoveParams(params){
  if(!Array.isArray(params.vertices)||params.vertices.length<1||params.vertices.length>32||new Set(params.vertices).size!==params.vertices.length||params.vertices.some(v=>typeof v!=='string'||!v.length||v.length>160))throw new Error('Punktverschiebung: 1–32 unterschiedliche Punkte angeben.');
  for(const axis of ['x','y','z'])if(typeof params[axis]!=='number'||!Number.isFinite(params[axis])||Math.abs(params[axis])>1000)throw new Error('Punktversatz X/Y/Z: erlaubt sind -1000 bis 1000.');
}
export function moveVertices(mesh,step){
  validateMoveParams(step.params);validateMesh(mesh);
  const vertices={...mesh.vertices},delta=['x','y','z'].map(k=>step.params[k]);
  for(const id of step.params.vertices){if(!Object.hasOwn(vertices,id))throw new Error('Bezugspunkt fehlt. Vor dem Schritt Punkte auswählen und neu zuordnen.');vertices[id]=add(vertices[id],delta);}
  const result={vertices,faces:mesh.faces};
  for(const f of mesh.faces)for(let i=0;i<f.vertices.length;i++)if(length(sub(vertices[f.vertices[i]],vertices[f.vertices[(i+1)%f.vertices.length]]))<1e-10)throw new Error('Punktverschiebung lässt eine Kante zusammenfallen. Versatz ändern.');
  validateMesh(result);return result;
}
function validateTruncateParams(params){
  if(typeof params.amount!=='number'||!Number.isFinite(params.amount)||params.amount<.01||params.amount>.49)throw new Error('Schnittstärke: Faktor 0,01 bis 0,49 angeben.');
}
export function truncate(mesh,step){
  validateTruncateParams(step.params);validateMesh(mesh);
  const edges=new Map(),fans=new Map(),vertices={},faces=[],provenance=new Map();
  const edgeKey=(a,b)=>JSON.stringify([a,b].sort());
  const identify=(kind,source)=>{const key=JSON.stringify(source),id=`${step.id}/truncate/${kind}/${ancestryHash(key)}`;if(provenance.has(id)&&provenance.get(id)!==key)throw new Error('Kollision der Schnitt-Referenzen.');provenance.set(id,key);return id;};
  for(const face of mesh.faces)for(let i=0;i<face.vertices.length;i++){
    const ring=face.vertices,a=ring[i],b=ring[(i+1)%ring.length],prev=ring[(i+ring.length-1)%ring.length],key=edgeKey(a,b);
    if(!edges.has(key))edges.set(key,[]);edges.get(key).push(face.id);
    if(!fans.has(a))fans.set(a,new Map());fans.get(a).set(face.id,{incoming:edgeKey(prev,a),outgoing:b});
  }
  if(!fans.size||fans.size!==Object.keys(mesh.vertices).length)throw new Error('Abschneiden benötigt ein geschlossenes Netz ohne isolierte Punkte.');
  if(mesh.faces.length+fans.size>SUBDIVISION_FACE_LIMIT||edges.size*2>64000)throw new Error('Abschneiden überschreitet 32.000 Flächen oder 64.000 Punkte.');
  const point=(a,b)=>{const id=identify('v',[a,b]);if(!Object.hasOwn(vertices,id))vertices[id]=add(mesh.vertices[a],mul(sub(mesh.vertices[b],mesh.vertices[a]),step.params.amount));return id;};
  for(const face of mesh.faces){const ring=[];for(let i=0;i<face.vertices.length;i++){const a=face.vertices[i],b=face.vertices[(i+1)%face.vertices.length];ring.push(point(a,b),point(b,a));}faces.push({id:identify('face',face.id),vertices:ring});}
  for(const [v,fan] of fans){
    const start=[...fan.keys()].sort()[0],visited=new Set(),ring=[];let next=start;
    while(fan.has(next)&&!visited.has(next)){visited.add(next);const h=fan.get(next);ring.push(point(v,h.outgoing));next=edges.get(h.incoming).find(f=>f!==next);}
    if(next!==start||visited.size!==fan.size||ring.length<3)throw new Error('Abschneiden benötigt zusammenhängende geschlossene Flächenfächer an jeder Ecke.');
    faces.push({id:identify('corner',v),vertices:ring});
  }
  const result={vertices,faces};validateMesh(result);return result;
}
function validateLocalTruncateParams(params){
  validateTruncateParams(params);
  if(!Array.isArray(params.vertices)||params.vertices.length<1||params.vertices.length>32||new Set(params.vertices).size!==params.vertices.length||params.vertices.some(v=>typeof v!=='string'||!v.length||v.length>160))throw new Error('Lokales Abschneiden: 1–32 unterschiedliche Punkte angeben.');
}
export function truncateVertices(mesh,step){
  validateLocalTruncateParams(step.params);validateMesh(mesh);
  const selected=new Set(step.params.vertices);if([...selected].some(v=>!Object.hasOwn(mesh.vertices,v)))throw new Error("Schnittecke fehlt. Vor dem Schritt Punkte auswählen und neu zuordnen.");
  const edges=new Map(),fans=new Map(),vertices={},faces=[],provenance=new Map();
  const edgeKey=(a,b)=>JSON.stringify([a,b].sort());
  const identify=(kind,source)=>{const key=JSON.stringify(source),id=`${step.id}/localcut/${kind}/${ancestryHash(key)}`;if(provenance.has(id)&&provenance.get(id)!==key)throw new Error('Kollision der Schnitt-Referenzen.');provenance.set(id,key);return id;};
  for(const face of mesh.faces)for(let i=0;i<face.vertices.length;i++){
    const ring=face.vertices,a=ring[i],b=ring[(i+1)%ring.length],prev=ring[(i+ring.length-1)%ring.length],key=edgeKey(a,b);
    if(!edges.has(key))edges.set(key,[]);edges.get(key).push(face.id);
    if(!fans.has(a))fans.set(a,new Map());fans.get(a).set(face.id,{incoming:edgeKey(prev,a),outgoing:b});
  }
  if(!fans.size||fans.size!==Object.keys(mesh.vertices).length)throw new Error('Abschneiden benötigt ein geschlossenes Netz ohne isolierte Punkte.');
  if(mesh.faces.length+selected.size>SUBDIVISION_FACE_LIMIT||Object.keys(mesh.vertices).length-selected.size+[...selected].reduce((sum,v)=>sum+fans.get(v).size,0)>64000)throw new Error('Abschneiden überschreitet 32.000 Flächen oder 64.000 Punkte.');
  const point=(a,b)=>{if(!selected.has(a)){vertices[a]=mesh.vertices[a];return a;}const id=identify('v',[a,b]);if(!Object.hasOwn(vertices,id))vertices[id]=add(mesh.vertices[a],mul(sub(mesh.vertices[b],mesh.vertices[a]),step.params.amount));return id;};
  for(const face of mesh.faces){const ring=[];for(let i=0;i<face.vertices.length;i++){const a=face.vertices[i],b=face.vertices[(i+1)%face.vertices.length];ring.push(point(a,b),point(b,a));}const clean=ring.filter((v,i)=>v!==ring[(i+ring.length-1)%ring.length]);faces.push(face.vertices.some(v=>selected.has(v))?{id:identify('face',face.id),vertices:clean}:face);}
  for(const [v,fan] of fans){
    const start=[...fan.keys()].sort()[0],visited=new Set(),ring=[];let next=start;
    while(fan.has(next)&&!visited.has(next)){visited.add(next);const h=fan.get(next);ring.push(selected.has(v)?point(v,h.outgoing):v);next=edges.get(h.incoming).find(f=>f!==next);}
    if(next!==start||visited.size!==fan.size||ring.length<3)throw new Error('Abschneiden benötigt zusammenhängende geschlossene Flächenfächer an jeder Ecke.');
    if(selected.has(v))faces.push({id:identify('corner',v),vertices:ring});
  }
  const result={vertices,faces};validateMesh(result);return result;
}
function validateStellateParams(params){
  if(typeof params.height!=='number'||!Number.isFinite(params.height)||Math.abs(params.height)>1000)throw new Error('Spitzenhöhe: erlaubt sind -1000 bis 1000.');
  if(!Array.isArray(params.faces)||params.faces.length<1||params.faces.length>32||new Set(params.faces).size!==params.faces.length||params.faces.some(f=>typeof f!=='string'||!f.length||f.length>160))throw new Error('Spitzen: 1–32 unterschiedliche Flächen angeben.');
}
export function stellate(mesh,step){
  validateStellateParams(step.params);validateMesh(mesh);
  const selected=new Set(step.params.faces),byFace=new Map(mesh.faces.map(f=>[f.id,f]));
  if([...selected].some(id=>!byFace.has(id)))throw new Error('Spitzenfläche fehlt. Vor dem Schritt auswählen und neu zuordnen.');
  const count=mesh.faces.length+[...selected].reduce((n,id)=>n+byFace.get(id).vertices.length-1,0);
  if(count>SUBDIVISION_FACE_LIMIT||Object.keys(mesh.vertices).length+selected.size>64000)throw new Error('Spitzen überschreiten 32.000 Flächen oder 64.000 Punkte.');
  const vertices={...mesh.vertices},faces=[],provenance=new Map();
  const identify=(kind,source)=>{
    const key=JSON.stringify(source),id=`${step.id}/stellate/${kind}/${ancestryHash(key)}`;
    if((provenance.has(id)&&provenance.get(id)!==key)||Object.hasOwn(mesh.vertices,id)||byFace.has(id))throw new Error('Kollision der Spitzen-Referenzen.');
    provenance.set(id,key);return id;
  };
  for(const face of mesh.faces){
    if(!selected.has(face.id)){faces.push(face);continue;}
    const ring=face.vertices,points=ring.map(v=>vertices[v]),n=normal(mesh,face);
    const center=mul([...ring].sort().map(v=>vertices[v]).reduce(add,[0,0,0]),1/ring.length);
    const scale=Math.max(...points.map(p=>length(sub(p,center))));
    if(points.some(p=>Math.abs(dot(sub(p,center),n))>scale*1e-6))throw new Error('Spitzen benötigen ebene, konvexe Ausgangsflächen. Vor dem Glätten anwenden.');
    for(let i=0;i<points.length;i++){
      const edge=sub(points[(i+1)%points.length],points[i]),inward=cross(n,edge);
      if(dot(sub(center,points[i]),inward)<=scale*scale*1e-10||points.some(p=>dot(sub(p,points[i]),inward)<-scale*scale*1e-8))throw new Error('Spitzen benötigen konvexe Flächen mit innenliegendem Mittelpunkt.');
    }
    const tip=identify('v',face.id);vertices[tip]=add(center,mul(n,step.params.height));
    for(let i=0;i<ring.length;i++){const a=ring[i],b=ring[(i+1)%ring.length];faces.push({id:identify('f',[face.id,a,b]),vertices:[a,b,tip]});}
  }
  const result={vertices,faces};validateMesh(result);return result;
}
function validateWireParams(params){
  if(typeof params.thickness!=='number'||!Number.isFinite(params.thickness)||params.thickness<.0001||params.thickness>1000)throw new Error('Strebenstärke: erlaubt sind 0,0001 bis 1000.');
}
// Face-border construction: shared outer/inner vertices join every edge strut
// into a manifold junction. Each convex planar face receives one through-hole.
export function wireModel(mesh,step){
  validateWireParams(step.params);
  const corners=mesh.faces.reduce((n,f)=>n+f.vertices.length,0);
  if(corners*3>SUBDIVISION_FACE_LIMIT||Object.keys(mesh.vertices).length*2+corners*2>64000)throw new Error('Drahtmodell überschreitet 32.000 Flächen oder 64.000 Punkte.');
  const base=shell(mesh,{id:step.id,params:{thickness:step.params.thickness,openings:[]}});
  const vertices={...base.vertices},faces=[],provenance=new Map();
  const identify=(kind,source)=>{
    const key=JSON.stringify(source),id=`${step.id}/wire/${kind}/${ancestryHash(key)}`;
    if((provenance.has(id)&&provenance.get(id)!==key)||Object.hasOwn(base.vertices,id))throw new Error('Kollision der Drahtmodell-Referenzen.');
    provenance.set(id,key);return id;
  };
  const inset=(ids,face,kind)=>{
    const points=ids.map(v=>vertices[v]),n=normal({vertices},{vertices:ids});
    const scale=Math.max(...points.map(p=>length(sub(p,points[0]))));
    if(points.some(p=>Math.abs(dot(sub(p,points[0]),n))>scale*1e-6))throw new Error('Drahtmodell benötigt ebene, konvexe Flächen. Drahtmodell vor dem Glätten anlegen.');
    const inward=points.map((p,i)=>{const e=sub(points[(i+1)%points.length],p);return mul(cross(n,e),1/length(e));});
    for(let i=0;i<points.length;i++)for(const p of points)if(dot(sub(p,points[i]),inward[i]) < -scale*1e-8)throw new Error('Drahtmodell benötigt konvexe Flächen.');
    const ring=points.map((p,i)=>{
      const prev=inward[(i+points.length-1)%points.length],next=inward[i],den=1+dot(prev,next);
      if(den<1e-6)throw new Error('Drahtmodell: zu spitze Flächenecke.');
      return add(p,mul(add(prev,next),step.params.thickness*.5/den));
    });
    for(let i=0;i<points.length;i++){
      if(dot(sub(ring[(i+1)%ring.length],ring[i]),sub(points[(i+1)%points.length],points[i]))<=scale*scale*1e-9)throw new Error('Strebenstärke zu groß: eine Öffnung fällt zusammen. Stärke reduzieren.');
      for(const p of ring)if(dot(sub(p,points[i]),inward[i])<step.params.thickness*.5-scale*1e-7)throw new Error('Strebenstärke zu groß für diese Fläche.');
    }
    return ring.map((point,i)=>{const id=identify(kind,[face.id,face.vertices[i]]);vertices[id]=point;return id;});
  };
  for(const face of mesh.faces){
    const outer=face.vertices,inner=outer.map(v=>shellVertex(step.id,v)),a=inset(outer,face,'a'),b=inset(inner,face,'b');
    for(let i=0;i<outer.length;i++){
      const j=(i+1)%outer.length,key=[face.id,outer[i],outer[j]];
      faces.push({id:identify('outer',key),vertices:[outer[i],outer[j],a[j],a[i]]},
        {id:identify('inner',key),vertices:[inner[j],inner[i],b[i],b[j]]},
        {id:identify('rim',key),vertices:[a[i],a[j],b[j],b[i]]});
    }
  }
  const result={vertices,faces};validateMesh(result);return result;
}
function validateOpeningParams(params){
  if(typeof params.source!=='string'||!/^s[\w-]{1,64}$/.test(params.source))throw new Error('Öffnung: gültigen Schalenschritt angeben.');
  if(!Array.isArray(params.faces)||params.faces.length<1||params.faces.length>32||new Set(params.faces).size!==params.faces.length||params.faces.some(f=>typeof f!=='string'||!f.length||f.length>160))throw new Error('Öffnung: 1–32 unterschiedliche Außenflächen angeben.');
}
const shellVertex=(source,v)=>`${source}/shell/v/${ancestryHash(JSON.stringify(v))}`;
const shellFace=(source,f)=>`${source}/shell/f/${ancestryHash(JSON.stringify(f))}`;
function pairedShellFace(byFace,source,face){
  if(!face)return false;const inner=byFace.get(shellFace(source,face.id));if(!inner||inner.vertices.length!==face.vertices.length)return false;
  const expected=face.vertices.map(v=>shellVertex(source,v)).reverse(),start=inner.vertices.indexOf(expected[0]);
  return start>=0&&expected.every((v,i)=>inner.vertices[(start+i)%expected.length]===v);
}
export function openingSource(mesh,faces){
  if(!faces.length||faces.length>32)throw new Error('Für eine Öffnung 1–32 Außenflächen auswählen.');
  const byFace=new Map(mesh.faces.map(f=>[f.id,f])),sources=new Set();
  for(const f of mesh.faces){const match=/^(s[\w-]{1,64})\/shell\/f\/[a-f0-9]{32}$/.exec(f.id);if(match)sources.add(match[1]);}
  const matches=[...sources].filter(source=>faces.every(id=>pairedShellFace(byFace,source,byFace.get(id))));
  if(matches.length!==1)throw new Error('Außenflächen derselben Schale mit unveränderter Innenzuordnung auswählen. Öffnungen vor Glättung oder Remeshing anlegen.');
  return matches[0];
}
export function openShell(mesh,step){
  validateOpeningParams(step.params);validateMesh(mesh);
  const {source}=step.params,removed=new Set(step.params.faces),byFace=new Map(mesh.faces.map(f=>[f.id,f]));
  for(const id of removed)if(!pairedShellFace(byFace,source,byFace.get(id)))throw new Error('Öffnungsbezug fehlt oder Außen-/Innenfläche wurde verändert. Flächengruppe vor dem Öffnungsschritt neu zuordnen.');
  const edgeKey=(a,b)=>JSON.stringify([a,b].sort()),edges=new Map(),oldRims=new Map(),removeFaces=new Set(removed),newRims=[];
  // Recognize paired rim vertices, including rims made by earlier opening steps.
  for(const f of mesh.faces){
    const v=f.vertices;
    if(v.length===4&&shellVertex(source,v[0])===v[3]&&shellVertex(source,v[1])===v[2]){
      const key=edgeKey(v[0],v[1]);if(oldRims.has(key))throw new Error('Öffnung: mehrdeutiger vorhandener Rand.');oldRims.set(key,f);
    }
  }
  for(const id of removed){
    const face=byFace.get(id);removeFaces.add(shellFace(source,id));
    for(let i=0;i<face.vertices.length;i++){
      const a=face.vertices[i],b=face.vertices[(i+1)%face.vertices.length],key=edgeKey(a,b);
      if(!edges.has(key))edges.set(key,[]);edges.get(key).push({face:id,a,b});
    }
  }
  const provenance=new Map();
  for(const [key,halves] of edges){
    if(halves.length===2)continue;
    if(halves.length!==1)throw new Error('Öffnung: ungültige Flächengruppe.');
    const h=halves[0],old=oldRims.get(key);
    if(old){removeFaces.add(old.id);oldRims.delete(key);continue;}
    const ancestry=JSON.stringify([source,h.face,h.a,h.b]),id=`${step.id}/opening/r/${ancestryHash(ancestry)}`;
    if(byFace.has(id)||(provenance.has(id)&&provenance.get(id)!==ancestry))throw new Error('Kollision der Öffnungsreferenzen.');provenance.set(id,ancestry);
    newRims.push({id,vertices:[h.a,h.b,shellVertex(source,h.b),shellVertex(source,h.a)]});
  }
  const degree=new Map();
  for(const f of [...oldRims.values(),...newRims])for(const v of f.vertices.slice(0,2))degree.set(v,(degree.get(v)??0)+1);
  if([...degree.values()].some(n=>n!==2))throw new Error('Öffnungsgruppen dürfen sich nicht nur an einem Punkt berühren. Gruppe erweitern oder andere Flächen wählen.');
  const faces=[...mesh.faces.filter(f=>!removeFaces.has(f.id)),...newRims];
  const remaining=new Map(faces.map(f=>[f.id,f]));
  if(!faces.some(f=>pairedShellFace(remaining,source,f)))throw new Error('Mindestens eine gepaarte Wandfläche der Schale muss erhalten bleiben.');
  if(faces.length>SUBDIVISION_FACE_LIMIT)throw new Error('Öffnung überschreitet die Grenze von 32.000 Flächen.');
  const used=new Set(faces.flatMap(f=>f.vertices)),result={vertices:Object.fromEntries(Object.entries(mesh.vertices).filter(([v])=>used.has(v))),faces};validateMesh(result);return result;
}
export const BRIDGE_EXAMPLE_TARGETS=['sfrontend/side/0','sbackend/side/0'];
export function bridgeExample(shifted=false) {
  const project=newProject();project.name=shifted?'Versetztes Brückenbeispiel':'Brückenbeispiel';
  project.steps.push(
    {id:'sfront',type:'extrude',enabled:true,target:'sbase/front',params:{distance:3}},
    {id:'sfrontarm',type:'extrude',enabled:true,target:'sfront/side/1',params:{distance:shifted?6:2}},
    {id:'sfrontend',type:'extrude',enabled:true,target:'sfrontarm/cap',params:{distance:2}},
    {id:'sback',type:'extrude',enabled:true,target:'sbase/back',params:{distance:3}},
    {id:'sbackarm',type:'extrude',enabled:true,target:'sback/side/3',params:{distance:2}},
    {id:'sbackend',type:'extrude',enabled:true,target:'sbackarm/cap',params:{distance:2}}
  );
  return project;
}
// Two short inward extrusions give Doo-Sabin triangular corner faces across the gap.
export const TRIANGLE_BRIDGE_EXAMPLE_TARGETS=['stipe0/v1','stipe1/v0'].map(v=>`sdoo/ds1/v/${ancestryHash(JSON.stringify(v))}`);
export const TRIANGLE_CURVED_EXAMPLE_TARGETS=['sfrontend/v2','sbackend/v3'].map(v=>`sdoo/ds1/v/${ancestryHash(JSON.stringify(v))}`);
export function triangleBridgeExample() {
  const project=bridgeExample();project.name='Dreiecksbrückenbeispiel';
  BRIDGE_EXAMPLE_TARGETS.forEach((target,i)=>project.steps.push({id:'stipe'+i,type:'extrude',enabled:true,target,params:{distance:.2}}));
  project.steps.push({id:'sdoo',type:'doo_sabin',enabled:true,params:{levels:1}});
  return project;
}
export function validateMesh(mesh,{allowOpen=false}={}) {
  const edges=new Map(),faceIds=new Set();
  for(const f of mesh.faces) {
    if(faceIds.has(f.id)||f.vertices.length<3||new Set(f.vertices).size!==f.vertices.length) throw new Error('Ungültige Fläche.');
    faceIds.add(f.id);
    for(const id of f.vertices) if(!mesh.vertices[id]||!mesh.vertices[id].every(Number.isFinite)) throw new Error('Ungültiger Punkt.');
    normal(mesh,f);
    for(let i=0;i<f.vertices.length;i++) {
      const a=f.vertices[i],b=f.vertices[(i+1)%f.vertices.length],key=[a,b].sort().join('|');
      const e=edges.get(key)||{count:0,balance:0};
      e.count++;e.balance+=a<b?1:-1;edges.set(key,e);
    }
  }
  if([...edges.values()].some(e=>allowOpen&&e.count===1?false:e.count!==2||e.balance!==0)) throw new Error('Das Netz ist nicht geschlossen und konsistent orientiert.');
  return {vertices:Object.keys(mesh.vertices).length,edges:edges.size,faces:mesh.faces.length};
}
export function validateProject(p) {
  if(!p||!['kantolyx-project','topolab-project'].includes(p.format)||p.formatVersion!==FORMAT_VERSION) throw new Error('Nicht unterstütztes Projektformat.');
  if(!Array.isArray(p.steps)||p.steps.length<1||p.steps.length>200) throw new Error('Erlaubt sind 1 bis 200 Schritte.');
  const ids=new Set();
  for(const [i,s] of p.steps.entries()) {
    if(!s||typeof s.id!=='string'||!/^s[\w-]{1,64}$/.test(s.id)||ids.has(s.id)) throw new Error('Ungültige oder doppelte Schritt-ID.');
    ids.add(s.id);
    if(!s.params||typeof s.params!=='object'||Array.isArray(s.params)) throw new Error('Parameter fehlen.');
    if(s.enabled!==undefined&&typeof s.enabled!=='boolean') throw new Error('Ungültiger Aktivierungsstatus.');
    if(i===0?!['cube','primitive'].includes(s.type):!['manual_patch','triangulate_faces','loop','punch_faces','honeycomb','quad_bridge','extrude_shape','extrude_region','dissolve_edges','extrude','mixed_curve_bridge','boolean_tunnel','plane_cut','split_face_band','remove_parts','extrude_group','tunnel_general','tunnel','mixed_bridge','bridge','triangle_bridge','curved_bridge','spline_bridge','triangle_curved_bridge','triangle_spline_bridge','multi_spline_bridge','triangle_multi_spline_bridge','twist_spline_bridge','triangle_twist_spline_bridge','subdivide','doo_sabin','dual','bevel_edges','subdivide_faces','split_edges','truncate_vertices','move_vertices','truncate','stellate','wire_model','shell','shell_open','face_transform'].includes(s.type)) throw new Error('Unbekannte oder falsch angeordnete Operation.');
    if(s.type==='cube') for(const k of ['width','height','depth']) positive(s.params[k],k);
    else if(s.type==='primitive') {
      if(!['tetrahedron','octahedron','icosahedron','prism','dodecahedron','sphere','torus','soccerball'].includes(s.params.kind))throw new Error('Unbekannter Grundkörper.');
      if(['sphere','torus'].includes(s.params.kind))validateRoundPrimitive(s.params);else {positive(s.params.size,'Kantenlänge');if(s.params.kind==='prism')validatePrism(s.params);}
    } else if(['extrude','extrude_shape'].includes(s.type)) {extrusionDistance(s.params.distance);validateExtrudeTransform(s.params);if(s.type==='extrude'&&((s.params.scale??1)!==1||(s.params.angle??0)!==0))throw new Error('Skalierung/Drehwinkel benötigen den geformten Extrusionsschritt extrude_shape.');if(typeof s.target!=='string'||s.target.length>160) throw new Error('Flächenreferenz fehlt.');}
    else if(s.type==='move_vertices')validateMoveParams(s.params);
    else if(s.type==='mixed_curve_bridge'){curvedBridgeParams(s.params,12);if(!Array.isArray(s.targets)||s.targets.length!==2||s.targets.some(t=>typeof t!=='string'||!t.length||t.length>160)||s.targets[0]===s.targets[1])throw new Error('Zwei gemischte Kurvenbezüge angeben.');}
    else if(s.type==='plane_cut')validatePlaneCut(s.params);
    else if(s.type==='manual_patch')validateManualParams(s.params);
    else if(s.type==='triangulate_faces')validateTriangulateParams(s.params);
    else if(s.type==='punch_faces')validatePunchParams(s.params);
    else if(s.type==='boolean_tunnel'){validateBooleanTunnel(s.params);if(!Array.isArray(s.targets)||s.targets.length!==2||s.targets.some(t=>typeof t!=='string'||!t.length||t.length>160)||s.targets[0]===s.targets[1])throw new Error('Zwei Durchbruchsbezüge angeben.');}
    else if(['split_face_band','remove_parts'].includes(s.type))validatePartGroups(s.params);
    else if(s.type==='extrude_region')validateRegionExtrude(s.params);
    else if(s.type==='extrude_group')validateGroupExtrude(s.params);
    else if(s.type==='tunnel_general'){validateGeneralTunnelParams(s.params);if(!Array.isArray(s.targets)||s.targets.length!==2||s.targets.some(t=>typeof t!=='string'||!t.length||t.length>160)||s.targets[0]===s.targets[1])throw new Error('Zwei unterschiedliche Durchbruchsbezüge angeben.');}
    else if(s.type==='tunnel'){validateTunnelParams(s.params);if(!Array.isArray(s.targets)||s.targets.length!==2||s.targets.some(t=>typeof t!=='string'||!t.length||t.length>160)||s.targets[0]===s.targets[1])throw new Error('Zwei unterschiedliche Durchbruchsbezüge angeben.');}
    else if(s.type==='mixed_bridge'){validateMixedParams(s.params);if(!Array.isArray(s.targets)||s.targets.length!==2||s.targets.some(t=>typeof t!=='string'||!t.length||t.length>160)||s.targets[0]===s.targets[1])throw new Error('Zwei unterschiedliche Brückenbezüge angeben.');}
    else if(s.type==='bevel_edges')validateBevelParams(s.params);
    else if(s.type==='subdivide_faces')validateLocalFacesParams(s.params);
    else if(s.type==='dissolve_edges')validateDissolveParams(s.params);
    else if(s.type==='split_edges')validateSplitParams(s.params);
    else if(s.type==='truncate_vertices')validateLocalTruncateParams(s.params);
    else if(s.type==='truncate')validateTruncateParams(s.params);
    else if(s.type==='stellate')validateStellateParams(s.params);
    else if(s.type==='wire_model')validateWireParams(s.params);
    else if(s.type==='dual')validateDualParams(s.params);
    else if(s.type==='shell')validateShellParams(s.params);
    else if(s.type==='shell_open')validateOpeningParams(s.params);
    else if(s.type==='face_transform') {
      validateFaceTransform(s.params);
      if(typeof s.target!=='string'||!s.target.length||s.target.length>160)throw new Error('Flächenreferenz fehlt.');
    } else if(['curved_bridge','spline_bridge','triangle_curved_bridge','triangle_spline_bridge','multi_spline_bridge','triangle_multi_spline_bridge','twist_spline_bridge','triangle_twist_spline_bridge'].includes(s.type)) {
      if(!Array.isArray(s.targets)||s.targets.length!==2||s.targets.some(t=>typeof t!=='string'||!t.length||t.length>160)||s.targets[0]===s.targets[1])throw new Error('Zwei unterschiedliche Brückenbezüge angeben.');
      curvedBridgeParams(s.params,s.type.startsWith('triangle_')?3:4);
      if(s.type.includes('multi_spline_bridge')&&!s.params.pathPoints?.length)throw new Error('Zusätzliche Pfadpunkte fehlen.');
      if(!s.type.includes('multi_spline_bridge')&&!s.type.includes('twist_spline_bridge')&&s.params.pathPoints?.length)throw new Error('Zusätzliche Pfadpunkte benötigen einen Mehrpunkt-Spline-Schritt.');
      if(!s.type.includes('twist_spline_bridge')&&s.params.twist)throw new Error('Verdrehung benötigt einen eigenen Twist-Schritt.');
      if(s.type.endsWith('spline_bridge')&&s.params.bow===undefined)throw new Error('Freie Kurvenmitte fehlt.');
      if(s.type.endsWith('curved_bridge')&&s.params.bow?.some(v=>v!==0))throw new Error('Eine freie Kurvenmitte benötigt einen Spline-Brückenschritt.');
    } else if(['loop','honeycomb','subdivide','doo_sabin'].includes(s.type)) {
      if(!Number.isInteger(s.params.levels)||s.params.levels<1||s.params.levels>2)throw new Error('Subdivision: erlaubt sind 1 oder 2 Stufen.');
    } else {
      if(!Array.isArray(s.targets)||s.targets.length!==2||s.targets.some(t=>typeof t!=='string'||t.length>160)||s.targets[0]===s.targets[1]) throw new Error('Zwei unterschiedliche Brückenbezüge angeben.');
      validateBridgeWalls(s.params);
      if(!Number.isInteger(s.params.offset)||s.params.offset<0||s.params.offset>(s.type==='triangle_bridge'?2:3)||!Number.isInteger(s.params.segments)||s.params.segments<1||s.params.segments>16) throw new Error('Ungültige Brückenparameter.');
    }
  }
  if(p.steps[0].enabled===false) throw new Error('Der Grundkörper muss aktiv bleiben.');
  return p;
}
export function evaluate(project,end=project.steps.length-1) {
  validateProject(project);
  let mesh=null,failed=false;
  const states=[];
  for(let i=0;i<=Math.min(end,project.steps.length-1);i++) {
    const s=project.steps[i];
    if(failed) {states.push({status:'blocked',message:'Vorherigen Fehler beheben.'});continue;}
    if(s.enabled===false) {states.push({status:'suppressed'});continue;}
    try {
      const next=s.type==='cube'?cube(s):s.type==='primitive'?primitive(s):s.type==='mixed_curve_bridge'?curvedBridge(mesh,s):s.type==='plane_cut'?planeCut(mesh,s):s.type==='punch_faces'?punchFaces(mesh,s):s.type==='boolean_tunnel'?booleanTunnel(mesh,s):s.type==='split_face_band'?splitFaceBand(mesh,s):s.type==='remove_parts'?removeParts(mesh,s):s.type==='extrude_region'?extrudeRegion(mesh,s):s.type==='extrude_group'?extrudeGroup(mesh,s):s.type==='tunnel_general'?generalTunnel(mesh,s):s.type==='tunnel'?tunnel(mesh,s):s.type==='mixed_bridge'?mixedBridge(mesh,s):['quad_bridge','bridge','triangle_bridge'].includes(s.type)?bridge(mesh,s):['curved_bridge','spline_bridge','triangle_curved_bridge','triangle_spline_bridge','multi_spline_bridge','triangle_multi_spline_bridge','twist_spline_bridge','triangle_twist_spline_bridge'].includes(s.type)?curvedBridge(mesh,s):s.type==='subdivide'?subdivide(mesh,s):s.type==='manual_patch'?manualPatch(mesh,s):s.type==='triangulate_faces'?triangulateFaces(mesh,s):s.type==='loop'?loopSubdivide(mesh,s):s.type==='honeycomb'?honeycomb(mesh,s):s.type==='doo_sabin'?dooSabin(mesh,s):s.type==='bevel_edges'?bevelEdges(mesh,s):s.type==='subdivide_faces'?subdivideFaces(mesh,s):s.type==='dissolve_edges'?dissolveEdges(mesh,s):s.type==='split_edges'?splitEdges(mesh,s):s.type==='move_vertices'?moveVertices(mesh,s):s.type==='truncate_vertices'?truncateVertices(mesh,s):s.type==='truncate'?truncate(mesh,s):s.type==='stellate'?stellate(mesh,s):s.type==='wire_model'?wireModel(mesh,s):s.type==='dual'?dual(mesh,s):s.type==='shell'?shell(mesh,s):s.type==='shell_open'?openShell(mesh,s):s.type==='face_transform'?transformFace(mesh,s):extrude(mesh,s);
      validateMesh(next);mesh=next;states.push({status:'ok'});
    } catch(e) {states.push({status:'error',message:e.message});failed=true;}
  }
  return {mesh,states,failed};
}
export function newProject(kind='cube') {
  if(!Object.hasOwn(PRIMITIVE_NAMES,kind))throw new Error('Unbekannter Grundkörper.');
  return {format:'kantolyx-project',formatVersion:FORMAT_VERSION,appVersion:APP_VERSION,name:'Unbenannt',steps:[{id:'sbase',type:kind==='cube'?'cube':'primitive',enabled:true,params:kind==='cube'?{width:2,height:2,depth:2}:kind==='prism'?{kind,size:2,height:2,sides:6}:kind==='sphere'?{kind,radius:1,segments:16,rings:8}:kind==='torus'?{kind,radius:2,tubeRadius:.5,segments:24,rings:12}:{kind,size:2}}]};
}
export function toOBJ(mesh) {
  const ids=Object.keys(mesh.vertices),indices=new Map(ids.map((id,i)=>[id,i+1]));
  return ['# Kantolyx '+APP_VERSION,...ids.map(id=>'v '+mesh.vertices[id].join(' ')),...mesh.faces.map(f=>'f '+f.vertices.map(id=>indices.get(id)).join(' ')),''].join('\n');
}

// Selection is transient view state, separate from the parametric project.
function selectionGraph(mesh){
  validateMesh(mesh);const faces=new Map(mesh.faces.map(f=>[f.id,f])),edges=new Map(),neighbors=new Map(mesh.faces.map(f=>[f.id,new Set()]));
  for(const f of mesh.faces)for(let i=0;i<f.vertices.length;i++){const a=f.vertices[i],b=f.vertices[(i+1)%f.vertices.length],key=JSON.stringify([a,b].sort());if(!edges.has(key))edges.set(key,[]);edges.get(key).push(f.id);}
  for(const pair of edges.values())for(const a of pair)for(const b of pair)if(a!==b)neighbors.get(a).add(b);
  return {faces,edges,neighbors};
}
export function expandFaceSelection(mesh,seeds,mode='connected'){
  if(!['connected','coplanar','grow'].includes(mode))throw new Error('Unbekannte Auswahlhilfe.');
  const {faces,neighbors}=selectionGraph(mesh);
  if(!Array.isArray(seeds)||!seeds.length||seeds.some(id=>!faces.has(id)))throw new Error('Vorher vorhandene Flächen auswählen.');
  const result=new Set(seeds);
  if(mode==='grow'){for(const id of seeds)for(const next of neighbors.get(id))result.add(next);}
  else if(mode==='connected'){
    const queue=[...result];for(let i=0;i<queue.length;i++)for(const next of neighbors.get(queue[i]))if(!result.has(next)){result.add(next);queue.push(next);}
  }else{
    // Cache each oriented planar region so a large multi-selection is linear.
    const assigned=new Set(),normals=new Map(),getNormal=id=>{if(!normals.has(id))normals.set(id,normal(mesh,faces.get(id)));return normals.get(id);};
    const radius=viewBounds(Object.values(mesh.vertices)).radius,eps=Math.max(1,radius)*1e-8;
    for(const seed of seeds){if(assigned.has(seed))continue;const origin=mesh.vertices[faces.get(seed).vertices[0]],n=getNormal(seed),queue=[seed],seen=new Set([seed]);
      const fits=id=>dot(n,getNormal(id))>1-1e-8&&faces.get(id).vertices.every(v=>Math.abs(dot(sub(mesh.vertices[v],origin),n))<=eps);
      if(!fits(seed))throw new Error('Koplanare Auswahl benötigt ebene Startflächen.');
      for(let i=0;i<queue.length;i++){const id=queue[i];assigned.add(id);result.add(id);for(const next of neighbors.get(id))if(!seen.has(next)){seen.add(next);if(fits(next))queue.push(next);}}
    }
  }
  if(result.size>32000)throw new Error('Flächenauswahl überschreitet 32.000 Flächen.');return [...result].sort();
}
export function selectEdgeRing(mesh,seeds){
  const {edges}=selectionGraph(mesh),opposite=new Map([...edges.keys()].map(k=>[k,new Set()]));
  if(!Array.isArray(seeds)||!seeds.length||seeds.some(e=>!Array.isArray(e)||e.length!==2||!edges.has(JSON.stringify([...e].sort()))))throw new Error('Vorher vorhandene Kanten auswählen.');
  for(const f of mesh.faces)if(f.vertices.length===4)for(let i=0;i<4;i++){
    const key=j=>JSON.stringify([f.vertices[j%4],f.vertices[(j+1)%4]].sort());opposite.get(key(i)).add(key(i+2));
  }
  const result=new Set(seeds.map(e=>JSON.stringify([...e].sort()))),queue=[...result];
  for(let i=0;i<queue.length;i++)for(const next of opposite.get(queue[i]))if(!result.has(next)){result.add(next);queue.push(next);if(result.size>32)throw new Error('Kantenring überschreitet die Auswahlgrenze von 32 Kanten. Auswahl bleibt unverändert.');}
  if(result.size>32)throw new Error('Höchstens 32 Kanten auswählen.');return [...result].sort().map(k=>JSON.parse(k));
}
export function selectFaces(current, clicked, additive=false,limit=2) {
  if(!Number.isInteger(limit)||limit<2||limit>32000)throw new Error('Auswahlgrenze: 2–32000 Flächen angeben.');
  if(!additive) return {faces:clicked?[clicked]:[],limitReached:false};
  if(!clicked) return {faces:[...current],limitReached:false};
  if(current.includes(clicked)) return {faces:current.filter(id=>id!==clicked),limitReached:false};
  if(current.length>=limit) return {faces:[...current],limitReached:true};
  return {faces:[...current,clicked],limitReached:false};
}
export function retainFaces(selection,mesh) {
  const present=new Set(mesh?.faces.map(f=>f.id)||[]);
  return selection.filter(id=>present.has(id));
}

export function viewBounds(points) {
  if(!points.length) return {center:[0,0,0],radius:1};
  const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
  for(const p of points) for(let i=0;i<3;i++){min[i]=Math.min(min[i],p[i]);max[i]=Math.max(max[i],p[i]);}
  return {center:min.map((v,i)=>(v+max[i])/2),radius:Math.max(.1,Math.hypot(...max.map((v,i)=>v-min[i]))/2)};
}
export function navigationGesture(button,shift){return button===1?'pan':button===0?(shift?'pan':'orbit'):null;}
