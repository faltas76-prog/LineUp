const pitchCanvas = document.getElementById("pitchCanvas");
const drawCanvas = document.getElementById("drawCanvas");
const ctx = pitchCanvas.getContext("2d");
const drawCtx = drawCanvas.getContext("2d");

const playersLayer = document.getElementById("playersLayer");

let players=[];
let basePositions=[];
let drawingMode=null;
let startX,startY;

/* ================= RESIZE ================= */

function resizeAll(){
[pitchCanvas, drawCanvas].forEach(c=>{
c.width=c.offsetWidth;
c.height=c.offsetHeight;
});
drawPitch();
if(basePositions.length) resetFormation();
}

window.addEventListener("resize",resizeAll);
resizeAll();

/* ================= UEFA PITCH ================= */

function drawPitch(){
const w=pitchCanvas.width;
const h=pitchCanvas.height;
ctx.clearRect(0,0,w,h);
ctx.strokeStyle="white";
ctx.lineWidth=2;

ctx.strokeRect(0,0,w,h);

ctx.beginPath();
ctx.moveTo(w/2,0); ctx.lineTo(w/2,h); ctx.stroke();

ctx.beginPath();
ctx.arc(w/2,h/2,h*0.15,0,2*Math.PI);
ctx.stroke();

ctx.strokeRect(0,h*0.25,w*0.16,h*0.5);
ctx.strokeRect(w-w*0.16,h*0.25,w*0.16,h*0.5);

ctx.strokeRect(0,h*0.4,w*0.07,h*0.2);
ctx.strokeRect(w-w*0.07,h*0.4,w*0.07,h*0.2);

ctx.beginPath();
ctx.arc(w*0.16,h/2,h*0.15,Math.PI*1.5,Math.PI*0.5);
ctx.stroke();

ctx.beginPath();
ctx.arc(w-w*0.16,h/2,h*0.15,Math.PI*0.5,Math.PI*1.5);
ctx.stroke();
}

/* ================= PLAYERS ================= */

function createPlayer(label,color){
const p=document.createElement("div");
p.className="player";
p.style.background=color;
p.innerHTML=label+"<span>Jméno</span>";
enableDrag(p);
playersLayer.appendChild(p);
players.push(p);
}

function enableDrag(el){
el.addEventListener("pointerdown",e=>{
if(drawingMode) return;
function move(e2){
const rect=playersLayer.getBoundingClientRect();
el.style.left=(e2.clientX-rect.left-el.offsetWidth/2)+"px";
el.style.top=(e2.clientY-rect.top-el.offsetHeight/2)+"px";
}
document.addEventListener("pointermove",move);
document.addEventListener("pointerup",()=>document.removeEventListener("pointermove",move),{once:true});
});
}

createPlayer("GK","yellow");
for(let i=1;i<=10;i++) createPlayer(i,"red");

/* ================= DRAWING ================= */

document.getElementById("drawArrow").onclick=()=>drawingMode="arrow";
document.getElementById("drawZone").onclick=()=>drawingMode="zone";
document.getElementById("clearDraw").onclick=()=>drawCtx.clearRect(0,0,drawCanvas.width,drawCanvas.height);

drawCanvas.addEventListener("pointerdown",e=>{
if(!drawingMode) return;
const rect=drawCanvas.getBoundingClientRect();
startX=e.clientX-rect.left;
startY=e.clientY-rect.top;
drawCanvas.style.pointerEvents="auto";
});

drawCanvas.addEventListener("pointerup",e=>{
if(!drawingMode) return;
const rect=drawCanvas.getBoundingClientRect();
const endX=e.clientX-rect.left;
const endY=e.clientY-rect.top;

drawCtx.strokeStyle="yellow";
drawCtx.lineWidth=3;

if(drawingMode==="arrow"){
drawCtx.beginPath();
drawCtx.moveTo(startX,startY);
drawCtx.lineTo(endX,endY);
drawCtx.stroke();
}

if(drawingMode==="zone"){
drawCtx.strokeRect(startX,startY,endX-startX,endY-startY);
}

drawingMode=null;
drawCanvas.style.pointerEvents="none";
});

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

/* ================= EXPORT ================= */

document.getElementById("pngBtn").onclick=async()=>{
const img=await html2canvas(document.getElementById("exportArea"));
const link=document.createElement("a");
link.download="lineup.png";
link.href=img.toDataURL();
link.click();
};

document.getElementById("pdfBtn").onclick=async()=>{
const { jsPDF }=window.jspdf;
const img=await html2canvas(document.getElementById("exportArea"));
const pdf=new jsPDF("landscape");
pdf.addImage(img.toDataURL("image/png"),"PNG",10,10,270,150);
pdf.save("lineup.pdf");
};

/* ================= PWA ================= */

if("serviceWorker" in navigator){
navigator.serviceWorker.register("sw.js");
}
