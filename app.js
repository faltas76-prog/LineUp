const pitchCanvas = document.getElementById("pitchCanvas");
const pitchCtx = pitchCanvas.getContext("2d");
const playersLayer = document.getElementById("playersLayer");
const bench = document.getElementById("bench");

let players = [];
let benchPlayers = [];
let selectedFieldPlayer = null;
let basePositions = [];

/* ================= RESIZE ================= */

function resizeCanvas(){
pitchCanvas.width = pitchCanvas.offsetWidth;
pitchCanvas.height = pitchCanvas.offsetHeight;
drawPitch();
if(basePositions.length) resetFormation();
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

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
}

/* ================= CREATE PLAYER ================= */

function createPlayer(label,color,isBench=false){

const p = document.createElement("div");
p.className = isBench ? "bench-player" : "player";
p.style.background = color;
p.innerHTML = label + "<span>Jméno</span>";

/* ===== ZMĚNA JMÉNA (SINGLE CLICK + SHIFT) ===== */

p.addEventListener("click",e=>{
if(e.shiftKey){
const name = prompt("Zadej jméno:");
if(name) p.querySelector("span").innerText = name;
return;
}

/* ===== VÝMĚNA HRÁČE ===== */

if(!isBench){
selectedFieldPlayer = p;
highlightSelected();
}else{
if(selectedFieldPlayer){
swapPlayers(selectedFieldPlayer, p);
selectedFieldPlayer = null;
highlightSelected();
}
}
});

/* ===== DRAG (jen hráči na hřišti) ===== */

if(!isBench){
p.addEventListener("pointerdown",e=>{
if(e.shiftKey) return;

function move(e2){
const rect = playersLayer.getBoundingClientRect();
p.style.left = (e2.clientX - rect.left - p.offsetWidth/2) + "px";
p.style.top = (e2.clientY - rect.top - p.offsetHeight/2) + "px";
}
document.addEventListener("pointermove", move);
document.addEventListener("pointerup",()=>document.removeEventListener("pointermove",move),{once:true});
});
}

return p;
}

/* ================= HIGHLIGHT ================= */

function highlightSelected(){
players.forEach(p=>p.style.outline="none");
if(selectedFieldPlayer){
selectedFieldPlayer.style.outline="3px solid yellow";
}
}

/* ================= SWAP ================= */

function swapPlayers(field, benchP){
const tempLabel = field.innerHTML;
field.innerHTML = benchP.innerHTML;
benchP.innerHTML = tempLabel;
}

/* ================= CREATE TEAM ================= */

const gk = createPlayer("GK","yellow");
playersLayer.appendChild(gk);
players.push(gk);

for(let i=1;i<=10;i++){
const p = createPlayer(i,"red");
playersLayer.appendChild(p);
players.push(p);
}

for(let i=1;i<=5;i++){
const b = createPlayer(i,"blue",true);
bench.appendChild(b);
benchPlayers.push(b);
}

/* ================= FORMATIONS ================= */

const formations={
"433":[[0.08,0.5],[0.25,0.15],[0.25,0.35],[0.25,0.65],[0.25,0.85],[0.5,0.25],[0.5,0.5],[0.5,0.75],[0.75,0.2],[0.75,0.5],[0.75,0.8]],
"442":[[0.08,0.5],[0.25,0.15],[0.25,0.35],[0.25,0.65],[0.25,0.85],[0.5,0.2],[0.5,0.4],[0.5,0.6],[0.5,0.8],[0.75,0.35],[0.75,0.65]],
"352":[[0.08,0.5],[0.25,0.3],[0.25,0.5],[0.25,0.7],[0.5,0.1],[0.5,0.3],[0.5,0.5],[0.5,0.7],[0.5,0.9],[0.75,0.35],[0.75,0.65]],
"4231":[[0.08,0.5],[0.25,0.15],[0.25,0.35],[0.25,0.65],[0.25,0.85],[0.45,0.35],[0.45,0.65],[0.65,0.2],[0.65,0.5],[0.65,0.8],[0.85,0.5]]
};

document.getElementById("applyBtn").onclick=()=>{
basePositions = formations[document.getElementById("formation").value];
resetFormation();
};

document.getElementById("resetBtn").onclick=resetFormation;

function resetFormation(){
if(!basePositions.length) return;
const w = playersLayer.offsetWidth;
const h = playersLayer.offsetHeight;
players.forEach((p,i)=>{
p.style.left = basePositions[i][0]*w + "px";
p.style.top = basePositions[i][1]*h + "px";
});
}

/* ================= EXPORT ================= */

document.getElementById("pngBtn").onclick=async()=>{
const img = await html2canvas(document.getElementById("exportArea"));
const link=document.createElement("a");
link.download="lineup.png";
link.href=img.toDataURL();
link.click();
};

document.getElementById("pdfBtn").onclick=async()=>{
const { jsPDF }=window.jspdf;
const img = await html2canvas(document.getElementById("exportArea"));
const pdf=new jsPDF("landscape");
pdf.addImage(img.toDataURL("image/png"),"PNG",10,10,270,150);
pdf.save("lineup.pdf");
};
