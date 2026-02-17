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

/* ================= TRÁVA (FAČR STYL) ================= */

function drawGrass(w,h){

const stripeCount = 12;
const stripeWidth = w / stripeCount;

for(let i=0;i<stripeCount;i++){

ctx.fillStyle = i%2===0 ? "#117a2d" : "#149b3a";
ctx.fillRect(i*stripeWidth,0,stripeWidth,h);

}

}

/* ================= UEFA PITCH ================= */

function drawPitch(){

const w = pitchCanvas.width;
const h = pitchCanvas.height;

ctx.clearRect(0,0,w,h);

/* ===== TRÁVA ===== */
drawGrass(w,h);

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

/* ===== ROZMĚRY ===== */

const penaltySpotDist = w*0.11;
const bigBoxDepth = w*0.16;
const bigBoxHeight = h*0.5;
const smallBoxDepth = w*0.06;
const smallBoxHeight = h*0.2;

/* ===== VELKÉ VÁPNO ===== */
ctx.strokeRect(0,h*0.25,bigBoxDepth,bigBoxHeight);
ctx.strokeRect(w-bigBoxDepth,h*0.25,bigBoxDepth,bigBoxHeight);

/* ===== MALÉ VÁPNO ===== */
ctx.strokeRect(0,h*0.4,smallBoxDepth,smallBoxHeight);
ctx.strokeRect(w-smallBoxDepth,h*0.4,smallBoxDepth,smallBoxHeight);

/* ===== PENALTY SPOT ===== */
ctx.beginPath();
ctx.arc(penaltySpotDist,h/2,3,0,2*Math.PI);
ctx.fillStyle="white";
ctx.fill();

ctx.beginPath();
ctx.arc(w-penaltySpotDist,h/2,3,0,2*Math.PI);
ctx.fill();

/* ===== OŘÍZNUTÝ OBLOUK ===== */

const arcRadius = h*0.15;
const cy = h/2;

/* levá strana */
const dxLeft = bigBoxDepth - penaltySpotDist;
const dyLeft = Math.sqrt(arcRadius**2 - dxLeft**2);

const angleLeftTop = Math.atan2(-dyLeft, dxLeft);
const angleLeftBottom = Math.atan2(dyLeft, dxLeft);

ctx.beginPath();
ctx.arc(penaltySpotDist,cy,arcRadius,angleLeftTop,angleLeftBottom,false);
ctx.stroke();

/* pravá strana */
const rightPenaltyX = w - penaltySpotDist;
const dxRight = (w-bigBoxDepth) - rightPenaltyX;
const dyRight = Math.sqrt(arcRadius**2 - dxRight**2);

const angleRightTop = Math.atan2(-dyRight, dxRight);
const angleRightBottom = Math.atan2(dyRight, dxRight);

ctx.beginPath();
ctx.arc(rightPenaltyX,cy,arcRadius,angleRightBottom,angleRightTop,false);
ctx.stroke();

/* ===== ROHOVÉ OBLOUKY ===== */
const r=20;
ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI/2); ctx.stroke();
ctx.beginPath(); ctx.arc(w,0,r,Math.PI/2,Math.PI); ctx.stroke();
ctx.beginPath(); ctx.arc(0,h,r,Math.PI*1.5,0); ctx.stroke();
ctx.beginPath(); ctx.arc(w,h,r,Math.PI,Math.PI*1.5); ctx.stroke();

/* ===== BRANKY ===== */
ctx.fillRect(-6,h*0.4,6,h*0.2);
ctx.fillRect(w,h*0.4,6,h*0.2);

}

/* ================= HRÁČI ================= */

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

/* EDIT JMÉNA */
name.addEventListener("click",e=>{
e.stopPropagation();
const newName=prompt("Zadej jméno hráče:");
if(newName) name.innerText=newName;
});

/* VÝBĚR / STŘÍDÁNÍ */
p.addEventListener("click",()=>{
if(!isBench){
selectedFieldPlayer=p;
highlight();
}else if(selectedFieldPlayer){
swap(selectedFieldPlayer,p);
selectedFieldPlayer=null;
highlight();
}
});

/* DRAG */
if(!isBench){
p.addEventListener("pointerdown",e=>{
if(e.target.tagName==="SPAN") return;

function move(e2){
const rect=playersLayer.getBoundingClientRect();
p.style.left=(e2.clientX-rect.left-p.offsetWidth/2)+"px";
p.style.top=(e2.clientY-rect.top-p.offsetHeight/2)+"px";
}
document.addEventListener("pointermove",move);
document.addEventListener("pointerup",
()=>document.removeEventListener("pointermove",move),
{once:true});
});
}

return p;
}

function highlight(){
players.forEach(p=>p.classList.remove("selected"));
if(selectedFieldPlayer) selectedFieldPlayer.classList.add("selected");
}

function swap(a,b){
[a.children[0].innerText,b.children[0].innerText]=
[b.children[0].innerText,a.children[0].innerText];

[a.children[1].innerText,b.children[1].innerText]=
[b.children[1].innerText,a.children[1].innerText];
}

/* ================= VYTVOŘENÍ TÝMU ================= */

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

/* ================= ROZESTAVENÍ ================= */

const formations={
"433":[[0.08,0.5],[0.25,0.15],[0.25,0.35],[0.25,0.65],[0.25,0.85],
[0.5,0.25],[0.5,0.5],[0.5,0.75],
[0.75,0.2],[0.75,0.5],[0.75,0.8]],

"442":[[0.08,0.5],[0.25,0.15],[0.25,0.35],[0.25,0.65],[0.25,0.85],
[0.5,0.2],[0.5,0.4],[0.5,0.6],[0.5,0.8],
[0.75,0.35],[0.75,0.65]],

"352":[[0.08,0.5],[0.25,0.3],[0.25,0.5],[0.25,0.7],
[0.5,0.15],[0.5,0.3],[0.5,0.5],[0.5,0.7],[0.5,0.85],
[0.75,0.35],[0.75,0.65]],

"4231":[[0.08,0.5],[0.25,0.15],[0.25,0.35],[0.25,0.65],[0.25,0.85],
[0.45,0.35],[0.45,0.65],
[0.65,0.2],[0.65,0.5],[0.65,0.8],
[0.85,0.5]]
};

document.getElementById("applyBtn").onclick=()=>{
basePositions=formations[document.getElementById("formation").value];
resetFormation();
};

document.getElementById("resetBtn").onclick=resetFormation;

function resetFormation(){
if(!basePositions || basePositions.length!==players.length) return;
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
