const pitch = document.getElementById("pitch");
const bench = document.getElementById("bench");

// ---------- UEFA FIELD DRAWING ----------

function drawLine(x, y, w, h) {
const line = document.createElement("div");
line.className = "line";
line.style.left = x + "px";
line.style.top = y + "px";
line.style.width = w + "px";
line.style.height = h + "px";
pitch.appendChild(line);
}

function drawCircle(x, y, size) {
const circle = document.createElement("div");
circle.className = "circle";
circle.style.left = x + "px";
circle.style.top = y + "px";
circle.style.width = size + "px";
circle.style.height = size + "px";
pitch.appendChild(circle);
}

// Outer lines
drawLine(0, 298, 1000, 4); // half line
drawCircle(400, 200, 200); // center circle

// Penalty areas
drawLine(0, 150, 180, 4);
drawLine(0, 450, 180, 4);
drawLine(820, 150, 180, 4);
drawLine(820, 450, 180, 4);

drawLine(180,150,4,300);
drawLine(820,150,4,300);

// Small box
drawLine(0,250,80,4);
drawLine(0,350,80,4);
drawLine(80,250,4,100);

drawLine(920,250,80,4);
drawLine(920,350,80,4);
drawLine(920,250,4,100);

// Penalty arcs
drawCircle(120,230,140);
drawCircle(740,230,140);

// Corner arcs
function cornerArc(x,y) {
const arc = document.createElement("div");
arc.style.position="absolute";
arc.style.width="40px";
arc.style.height="40px";
arc.style.border="3px solid white";
arc.style.borderRadius="50%";
arc.style.left=x+"px";
arc.style.top=y+"px";
pitch.appendChild(arc);
}

cornerArc(-20,-20);
cornerArc(980,-20);
cornerArc(-20,580);
cornerArc(980,580);

// ---------- PLAYERS ----------

function createPlayer(x,y,label,color="red"){
const player = document.createElement("div");
player.className="player";
player.style.left=x+"px";
player.style.top=y+"px";
player.style.background=color;
player.innerHTML=label + "<span>Jméno</span>";

player.onclick=function(){
const name=prompt("Zadej jméno hráče:");
if(name){
player.querySelector("span").innerText=name;
}
}

pitch.appendChild(player);
}

// GK
createPlayer(50,275,"GK","yellow");

// 10 players
for(let i=1;i<=10;i++){
createPlayer(200+i*60,100+(i%5)*80,i);
}

// Bench players
for(let i=1;i<=5;i++){
const bp=document.createElement("div");
bp.className="bench-player";
bp.innerHTML=i+"<span>Jméno</span>";
bp.onclick=function(){
const name=prompt("Zadej jméno hráče:");
if(name){
bp.querySelector("span").innerText=name;
}
}
bench.appendChild(bp);
}

// ---------- EXPORT ----------

async function exportPNG(){
const canvas = await html2canvas(document.getElementById("exportArea"));
const link=document.createElement("a");
link.download="lineup.png";
link.href=canvas.toDataURL();
link.click();
}

async function exportPDF(){
const { jsPDF } = window.jspdf;
const canvas = await html2canvas(document.getElementById("exportArea"));
const imgData = canvas.toDataURL("image/png");
const pdf = new jsPDF('landscape');
pdf.addImage(imgData,'PNG',10,10,270,150);
pdf.save("lineup.pdf");
}
