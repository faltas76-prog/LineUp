const pitchCanvas = document.getElementById("pitchCanvas");
const drawCanvas = document.getElementById("drawCanvas");
const pitchCtx = pitchCanvas.getContext("2d");
const drawCtx = drawCanvas.getContext("2d");

const playersLayer = document.getElementById("playersLayer");
const bench = document.getElementById("bench");

let players = [];
let basePositions = [];
let drawingMode = null;
let startX, startY;

/* ================= RESIZE ================= */

function resizeAll(){
[pitchCanvas, drawCanvas].forEach(c=>{
c.width = c.offsetWidth;
c.height = c.offsetHeight;
});
drawPitch();
if(basePositions.length) resetFormation();
}

window.addEventListener("resize", resizeAll);
resizeAll();

/* ================= DRAW PITCH ================= */

function drawPitch(){
const w = pitchCanvas.width;
const h = pitchCanvas.height;

pitchCtx.clearRect(0,0,w,h);
pitchCtx.strokeStyle="white";
pitchCtx.lineWidth=2;

pitchCtx.strokeRect(0,0,w,h);

pitchCtx.beginPath();
pitchCtx.moveTo(w/2,0);
pitchCtx.lineTo(w/2,h);
pitchCtx.stroke();

pitchCtx.beginPath();
pitchCtx.arc(w/2,h/2,h*0.15,0,2*Math.PI);
pitchCtx.stroke();

pitchCtx.strokeRect(0,h*0.25,w*0.16,h*0.5);
pitchCtx.strokeRect(w-w*0.16,h*0.25,w*0.16,h*0.5);

pitchCtx.strokeRect(0,h*0.4,w*0.07,h*0.2);
pitchCtx.strokeRect(w-w*0.07,h*0.4,w*0.07,h*0.2);
}

/* ================= PLAYERS ================= */

function createPlayer(label,color){
const p = document.createElement("div");
p.className="player";
p.style.background=color;
p.innerHTML=label+"<span>Jméno</span>";

enableDrag(p);

p.addEventListener("dblclick",()=>{
const name=prompt("Zadej jméno:");
if(name) p.querySelector("span").innerText=name;
});

playersLayer.appendChild(p);
players.push(p);
}

function enableDrag(el){
el.addEventListener("pointerdown",e=>{
if(drawingMode) return;

function move(e2){
const rect = playersLayer.getBoundingClientRect();
el.style.left = (e2.clientX - rect.left - el.offsetWidth/2)+"px";
el.style.top = (e2.clientY - rect.top - el.offsetHeight/2)+"px";
}

document.addEventListener("pointermove", move);
document.addEventListener("pointerup", ()=>document.removeEventListener("pointermove", move), {once:true});
});
}

createPlayer("GK","yellow");
for(let i=1;i<=10;i++) createPlayer(i,"red");

/* ================= BENCH ================= */

for(let i=1;i<=5;i++){
const b=document.createElement("div");
b.className="bench-player";
b.innerHTML=i+"<span>Jméno</span>";
b.addEventListener("dblclick",()=>{
const name=prompt("Zadej jméno:");
if(name) b.querySelector("span").innerText=name;
});
bench.appendChild(b);
}

/* ================= DRAWING ================= */

document.getElementById("arrowBtn").onclick=()=>drawingMode="arrow";
document.getElementById("zoneBtn").onclick=()=>drawingMode="zone";
document.getElementById("clearBtn").onclick=()=>{
drawCtx.clearRect(0,0,drawCanvas.width,drawCanvas.height);
drawingMode=null;
};

drawCanvas.addEventListener("pointerdown",e=>{
if(!drawingMode) return;
const rect = drawCanvas.getBoundingClientRect();
startX = e.clientX - rect.left;
startY = e.clientY - rect.top;
});

drawCanvas.addEventListener("pointerup",e=>{
if(!drawingMode) return;

const rect = drawCanvas.getBoundingClientRect();
const endX = e.clientX - rect.left;
const endY = e.clientY - rect.top;

drawCtx.strokeStyle="yellow";
drawCtx.fillStyle="yellow";
drawCtx.lineWidth=3;

if(drawingMode==="arrow"){
drawArrow(startX,startY,endX,endY);
}

if(drawingMode==="zone"){
drawCtx.strokeRect(startX,startY,endX-startX,endY-startY);
}

drawingMode=null;
});

function drawArrow(x1,y1,x2,y2){
const headLength = 15;
const dx = x2 - x1;
const dy = y2 - y1;
const angle = Math.atan2(dy, dx);

drawCtx.beginPath();
drawCtx.moveTo(x1,y1);
drawCtx.lineTo(x2,y2);
drawCtx.stroke();

drawCtx.beginPath();
drawCtx.moveTo(x2,y2);
drawCtx.lineTo(
x2 - headLength * Math.cos(angle - Math.PI/6),
y2 - headLength * Math.sin(angle - Math.PI/6)
);
drawCtx.lineTo(
x2 - headLength * Math.cos(angle + Math.PI/6),
y2 - headLength * Math.sin(angle + Math.PI/6)
);
drawCtx.closePath();
drawCtx.fill();
}

/* ================= FORMATIONS ================= */

const formations={
"433":[[0.08,0.5],[0.25,0.15],[0.25,0.35],[0.25,0.65],[0.25,0.85],[0.5,0.25],[0.5,0.5],[0.5,0.75],[0.75,0.2],[0.75,0.5],[0.75,0.8]]
};

document.getElementById("applyBtn").onclick=()=>{
basePositions=formations["433"];
resetFormation();
};

document.getElementById("resetBtn").onclick=resetFormation;

function resetFormation(){
const w=playersLayer.offsetWidth;
const h=playersLayer.offsetHeight;
players.forEach((p,i)=>{
p.style.left=(basePositions[i][0]*w)+"px";
p.style.top=(basePositions[i][1]*h)+"px";
});
}
