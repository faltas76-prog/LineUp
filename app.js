const canvas = document.getElementById("pitchCanvas");
const ctx = canvas.getContext("2d");
const playersLayer = document.getElementById("playersLayer");
const bench = document.getElementById("bench");

let players = [];
let basePositions = [];

/* ================= RESIZE CANVAS ================= */

function resizeCanvas(){
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
drawPitch();
if(basePositions.length) resetFormation();
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* ================= DRAW UEFA PITCH ================= */

function drawPitch(){
const w = canvas.width;
const h = canvas.height;

ctx.clearRect(0,0,w,h);
ctx.strokeStyle="white";
ctx.lineWidth=2;

/* outer */
ctx.strokeRect(0,0,w,h);

/* halfway */
ctx.beginPath();
ctx.moveTo(w/2,0);
ctx.lineTo(w/2,h);
ctx.stroke();

/* center circle */
ctx.beginPath();
ctx.arc(w/2,h/2,h*0.15,0,2*Math.PI);
ctx.stroke();

/* penalty areas */
const boxW = w*0.16;
const boxH = h*0.5;
ctx.strokeRect(0,h*0.25,boxW,boxH);
ctx.strokeRect(w-boxW,h*0.25,boxW,boxH);

/* small box */
ctx.strokeRect(0,h*0.4,w*0.07,h*0.2);
ctx.strokeRect(w-w*0.07,h*0.4,w*0.07,h*0.2);

/* penalty arcs */
ctx.beginPath();
ctx.arc(w*0.16,h/2,h*0.15,Math.PI*1.5,Math.PI*0.5);
ctx.stroke();

ctx.beginPath();
ctx.arc(w-w*0.16,h/2,h*0.15,Math.PI*0.5,Math.PI*1.5);
ctx.stroke();

/* corner arcs */
const r = 20;
ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI/2); ctx.stroke();
ctx.beginPath(); ctx.arc(w,0,r,Math.PI/2,Math.PI); ctx.stroke();
ctx.beginPath(); ctx.arc(0,h,r,Math.PI*1.5,0); ctx.stroke();
ctx.beginPath(); ctx.arc(w,h,r,Math.PI,Math.PI*1.5); ctx.stroke();

/* goals */
ctx.fillStyle="white";
ctx.fillRect(-5,h*0.4,5,h*0.2);
ctx.fillRect(w,h*0.4,5,h*0.2);
}

/* ================= PLAYERS ================= */

function createPlayer(label,color){
const p=document.createElement("div");
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
e.preventDefault();
function move(e2){
const rect=playersLayer.getBoundingClientRect();
el.style.left=(e2.clientX-rect.left-el.offsetWidth/2)+"px";
el.style.top=(e2.clientY-rect.top-el.offsetHeight/2)+"px";
}
document.addEventListener("pointermove",move);
document.addEventListener("pointerup",()=>document.removeEventListener("pointermove",move),{once:true});
});
}

/* create squad */
createPlayer("GK","yellow");
for(let i=1;i<=10;i++) createPlayer(i,"red");

/* bench */
for(let i=1;i<=5;i++){
const b=document.createElement("div");
b.className="bench-player";
b.innerHTML=i+"<span>Jméno</span>";
b.onclick=()=>{
const name=prompt("Zadej jméno:");
if(name) b.querySelector("span").innerText=name;
};
bench.appendChild(b);
}

/* ================= FORMATIONS ================= */

const formations={
"433":[[0.08,0.5],[0.25,0.15],[0.25,0.35],[0.25,0.65],[0.25,0.85],[0.5,0.25],[0.5,0.5],[0.5,0.75],[0.75,0.2],[0.75,0.5],[0.75,0.8]],
"442":[[0.08,0.5],[0.25,0.15],[0.25,0.35],[0.25,0.65],[0.25,0.85],[0.5,0.2],[0.5,0.4],[0.5,0.6],[0.5,0.8],[0.75,0.35],[0.75,0.65]],
"352":[[0.08,0.5],[0.25,0.3],[0.25,0.5],[0.25,0.7],[0.5,0.1],[0.5,0.3],[0.5,0.5],[0.5,0.7],[0.5,0.9],[0.75,0.35],[0.75,0.65]],
"4231":[[0.08,0.5],[0.25,0.15],[0.25,0.35],[0.25,0.65],[0.25,0.85],[0.45,0.35],[0.45,0.65],[0.65,0.2],[0.65,0.5],[0.65,0.8],[0.85,0.5]]
};

document.getElementById("applyBtn").onclick=()=>{
basePositions=formations[document.getElementById("formation").value];
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
const canvasImg=await html2canvas(document.getElementById("exportArea"));
const link=document.createElement("a");
link.download="lineup.png";
link.href=canvasImg.toDataURL();
link.click();
};

document.getElementById("pdfBtn").onclick=async()=>{
const { jsPDF }=window.jspdf;
const canvasImg=await html2canvas(document.getElementById("exportArea"));
const pdf=new jsPDF("landscape");
pdf.addImage(canvasImg.toDataURL("image/png"),"PNG",10,10,270,150);
pdf.save("lineup.pdf");
};
