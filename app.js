const pitchCanvas = document.getElementById("pitchCanvas");
const ctx = pitchCanvas.getContext("2d");
const playersLayer = document.getElementById("playersLayer");
const bench = document.getElementById("bench");

let players = [];
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

/* ================= UEFA / FAČR PITCH ================= */

function drawPitch(){
const w = pitchCanvas.width;
const h = pitchCanvas.height;

ctx.clearRect(0,0,w,h);
ctx.strokeStyle="white";
ctx.lineWidth=2;

/* outer lines */
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

/* penalty area (16.5m scaled) */
const bigBoxW = w*0.16;
const bigBoxH = h*0.5;

ctx.strokeRect(0,h*0.25,bigBoxW,bigBoxH);
ctx.strokeRect(w-bigBoxW,h*0.25,bigBoxW,bigBoxH);

/* small box (5.5m scaled) */
const smallBoxW = w*0.06;
const smallBoxH = h*0.2;

ctx.strokeRect(0,h*0.4,smallBoxW,smallBoxH);
ctx.strokeRect(w-smallBoxW,h*0.4,smallBoxW,smallBoxH);

/* penalty spot */
ctx.beginPath();
ctx.arc(w*0.11,h/2,3,0,2*Math.PI);
ctx.fillStyle="white";
ctx.fill();

ctx.beginPath();
ctx.arc(w-w*0.11,h/2,3,0,2*Math.PI);
ctx.fill();

/* penalty arc */
ctx.beginPath();
ctx.arc(w*0.11,h/2,h*0.15,Math.PI*1.5,Math.PI*0.5);
ctx.stroke();

ctx.beginPath();
ctx.arc(w-w*0.11,h/2,h*0.15,Math.PI*0.5,Math.PI*1.5);
ctx.stroke();

/* corner arcs */
const r = 20;
ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI/2); ctx.stroke();
ctx.beginPath(); ctx.arc(w,0,r,Math.PI/2,Math.PI); ctx.stroke();
ctx.beginPath(); ctx.arc(0,h,r,Math.PI*1.5,0); ctx.stroke();
ctx.beginPath(); ctx.arc(w,h,r,Math.PI,Math.PI*1.5); ctx.stroke();

/* goals */
ctx.fillRect(-6,h*0.4,6,h*0.2);
ctx.fillRect(w,h*0.4,6,h*0.2);
}

/* ================= PLAYER CREATION ================= */

function createPlayer(label,color,isBench=false){

const p=document.createElement("div");
p.className=isBench?"bench-player":"player";
p.style.background=color;

const number=document.createElement("div");
number.innerText=label;

const name=document.createElement("span");
name.innerText="Jméno";

p.appendChild(number);
p.appendChild(name);

/* ===== EDIT NAME ===== */
name.addEventListener("click",e=>{
e.stopPropagation();
const newName=prompt("Zadej jméno hráče:");
if(newName) name.innerText=newName;
});

/* ===== SELECT / SWAP ===== */
p.addEventListener("click",()=>{
if(!isBench){
selectedFieldPlayer=p;
highlightSelection();
}else if(selectedFieldPlayer){
swapPlayers(selectedFieldPlayer,p);
selectedFieldPlayer=null;
highlightSelection();
}
});

/* ===== DRAG ===== */
if(!isBench){
p.addEventListener("pointerdown",e=>{
if(e.target.tagName==="SPAN") return;
function move(e2){
const rect=playersLayer.getBoundingClientRect();
p.style.left=(e2.clientX-rect.left-p.offsetWidth/2)+"px";
p.style.top=(e2.clientY-rect.top-p.offsetHeight/2)+"px";
}
document.addEventListener("pointermove",move);
document.addEventListener("pointerup",()=>document.removeEventListener("pointermove",move),{once:true});
});
}

return p;
}

function highlightSelection(){
players.forEach(p=>p.classList.remove("selected"));
if(selectedFieldPlayer) selectedFieldPlayer.classList.add("selected");
}

function swapPlayers(a,b){
const tempNumber=a.children[0].innerText;
const tempName=a.children[1].innerText;

a.children[0].innerText=b.children[0].innerText;
a.children[1].innerText=b.children[1].innerText;

b.children[0].innerText=tempNumber;
b.children[1].innerText=tempName;
}

/* ================= CREATE TEAM ================= */

const gk=createPlayer("GK","yellow");
playersLayer.appendChild(gk);
players.push(gk);

for(let i=1;i<=10;i++){
const p=createPlayer(i,"red");
playersLayer.appendChild(p);
players.push(p);
}

for(let i=1;i<=5;i++){
bench.appendChild(createPlayer(i,"blue",true));
}

/* ================= FORMATIONS ================= */

const formations={
"433":[[0.08,0.5],[0.25,0.15],[0.25,0.35],[0.25,0.65],[0.25,0.85],[0.5,0.25],[0.5,0.5],[0.5,0.75],[0.75,0.2],[0.75,0.5],[0.75,0.8]]
};

document.getElementById("applyBtn").onclick=()=>{
basePositions=formations[document.getElementById("formation").value];
resetFormation();
};

document.getElementById("resetBtn").onclick=resetFormation;

function resetFormation(){
if(!basePositions.length) return;
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
