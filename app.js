const pitch = document.getElementById("pitch");
const bench = document.getElementById("bench");

// ================= FIELD =================

function line(x,y,w,h){
const l=document.createElement("div");
l.className="line";
l.style.left=x+"px";
l.style.top=y+"px";
l.style.width=w+"px";
l.style.height=h+"px";
pitch.appendChild(l);
}

function circle(x,y,size){
const c=document.createElement("div");
c.className="circle";
c.style.left=x+"px";
c.style.top=y+"px";
c.style.width=size+"px";
c.style.height=size+"px";
pitch.appendChild(c);
}

// Halfway
line(0,298,1000,4);
circle(400,200,200);

// PENALTY BOXES (UEFA proportions scaled)
line(0,150,180,4);
line(0,450,180,4);
line(180,150,4,300);

line(820,150,180,4);
line(820,450,180,4);
line(820,150,4,300);

// Small boxes
line(0,250,80,4);
line(0,350,80,4);
line(80,250,4,100);

line(920,250,80,4);
line(920,350,80,4);
line(920,250,4,100);

// Correct penalty arcs (outside box only)
circle(110,230,140);
circle(750,230,140);

// Goals
function goal(x){
const g=document.createElement("div");
g.style.position="absolute";
g.style.width="20px";
g.style.height="120px";
g.style.background="white";
g.style.top="240px";
g.style.left=x+"px";
pitch.appendChild(g);
}
goal(-20);
goal(1000);

// Corner arcs
function corner(x,y){
const a=document.createElement("div");
a.style.position="absolute";
a.style.width="40px";
a.style.height="40px";
a.style.border="3px solid white";
a.style.borderRadius="50%";
a.style.left=x+"px";
a.style.top=y+"px";
pitch.appendChild(a);
}
corner(-20,-20);
corner(980,-20);
corner(-20,580);
corner(980,580);

// ================= PLAYERS =================

let players=[];

function createPlayer(label,color="red"){
const p=document.createElement("div");
p.className="player";
p.innerHTML=label+"<span>Jméno</span>";
p.style.background=color;
enableDrag(p);

p.onclick=function(e){
if(e.detail===2){
const name=prompt("Zadej jméno:");
if(name) p.querySelector("span").innerText=name;
}
}

pitch.appendChild(p);
players.push(p);
return p;
}

// Drag & Drop
function enableDrag(el){
el.onmousedown=function(e){
let shiftX=e.clientX-el.getBoundingClientRect().left;
let shiftY=e.clientY-el.getBoundingClientRect().top;

function moveAt(pageX,pageY){
el.style.left=pageX-pitch.offsetLeft-shiftX+"px";
el.style.top=pageY-pitch.offsetTop-shiftY+"px";
}

function onMouseMove(e){
moveAt(e.pageX,e.pageY);
}

document.addEventListener("mousemove",onMouseMove);

document.onmouseup=function(){
document.removeEventListener("mousemove",onMouseMove);
document.onmouseup=null;
};
};
el.ondragstart=()=>false;
}

// Create squad
createPlayer("GK","yellow");
for(let i=1;i<=10;i++){
createPlayer(i);
}

// Bench
for(let i=1;i<=5;i++){
const bp=document.createElement("div");
bp.className="bench-player";
bp.innerHTML=i+"<span>Jméno</span>";
bp.onclick=function(){
const name=prompt("Zadej jméno:");
if(name) bp.querySelector("span").innerText=name;
}
bench.appendChild(bp);
}

// ================= FORMATIONS =================

function applyFormation(){
const f=document.getElementById("formationSelect").value;

const layouts={
"433":[
[80,275],
[250,100],[250,250],[250,400],[250,550],
[500,150],[500,300],[500,450],
[750,150],[750,300],[750,450]
],
"442":[
[80,275],
[250,100],[250,250],[250,400],[250,550],
[500,150],[500,300],[500,450],[500,550],
[750,200],[750,400]
],
"352":[
[80,275],
[250,200],[250,300],[250,400],
[500,100],[500,200],[500,300],[500,400],[500,500],
[750,200],[750,400]
],
"4231":[
[80,275],
[250,100],[250,250],[250,400],[250,550],
[450,250],[450,400],
[650,150],[650,300],[650,450],
[850,300]
]
};

const pos=layouts[f];
players.forEach((p,i)=>{
p.style.left=pos[i][0]+"px";
p.style.top=pos[i][1]+"px";
});
}

// ================= EXPORT =================

async function exportPNG(){
const canvas=await html2canvas(document.getElementById("exportArea"));
const link=document.createElement("a");
link.download="lineup.png";
link.href=canvas.toDataURL();
link.click();
}

async function exportPDF(){
const { jsPDF }=window.jspdf;
const canvas=await html2canvas(document.getElementById("exportArea"));
const imgData=canvas.toDataURL("image/png");
const pdf=new jsPDF("landscape");
pdf.addImage(imgData,"PNG",10,10,270,150);
pdf.save("lineup.pdf");
}
