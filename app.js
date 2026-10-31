
const contacts=[
{name:"Manuel Marconi",phone:"+393470613045"},
{name:"Andrea Piai",phone:"+393334579765"},
{name:"Angelo Tarquini",phone:"+393927796821"},
{name:"Pierluigi Iacobbi",phone:"+393284917585"}];

let currentDate=new Date(); currentDate.setHours(12,0,0,0);
let team=localStorage.getItem("filctem_team")||"A";

function squadra1(m,d){
if(m===10)return d<=21?"D":d<=24?"B":d<=25?"NON PREVISTO":d<=28?"A":"C";
if(m===11)return d<=1?"NON PREVISTO":d<=4?"B":d<=7?"D":d<=8?"NON PREVISTO":d<=11?"C":d<=14?"A":d<=15?"NON PREVISTO":d<=18?"D":d<=21?"B":d<=22?"NON PREVISTO":d<=25?"A":d<=28?"C":d<=29?"NON PREVISTO":"B";
if(m===12)return d<=2?"B":d<=5?"D":d<=6?"NON PREVISTO":d<=9?"C":d<=12?"A":d<=13?"NON PREVISTO":d<=16?"D":d<=19?"B":d<=20?"NON PREVISTO":d<=24?"A":d<=27?"NON PREVISTO":"FERIE";
return "FUORI CALENDARIO";}
function squadra2(m,d){
if(m===10)return d<=21?"B":d<=24?"D":d<=25?"NON PREVISTO":d<=28?"C":"A";
if(m===11)return d<=1?"NON PREVISTO":d<=4?"D":d<=7?"B":d<=8?"NON PREVISTO":d<=11?"A":d<=14?"C":d<=15?"NON PREVISTO":d<=18?"B":d<=21?"D":d<=22?"NON PREVISTO":d<=25?"C":d<=28?"A":d<=29?"NON PREVISTO":"D";
if(m===12)return d<=2?"D":d<=5?"B":d<=6?"NON PREVISTO":d<=9?"A":d<=12?"C":d<=13?"NON PREVISTO":d<=16?"B":d<=19?"D":d<=20?"NON PREVISTO":d<=23?"C":d<=27?"NON PREVISTO":"FERIE";
return "FUORI CALENDARIO";}
function squadra3(m,d){
if(m===10)return d<=21?"A":d<=24?"C":d<=28?"B":"D";
if(m===11)return d<=1?"B":d<=4?"C":d<=7?"A":d<=11?"D":d<=14?"B":d<=18?"A":d<=21?"C":d<=25?"B":d<=28?"D":"C";
if(m===12)return d<=2?"C":d<=5?"A":d<=9?"D":d<=12?"B":d<=16?"A":d<=19?"C":d<=23?"B":d<=27?"NON PREVISTO":"FERIE";
return "FUORI CALENDARIO";}
function riposo(m,d){
if(m===10)return d<=21?"C":d<=24?"A":d<=25?"A/C/D":d<=28?"D":"B";
if(m===11)return d<=1?"A/C/D":d<=4?"A":d<=7?"C":d<=8?"A/B/C":d<=11?"B":d<=14?"D":d<=15?"B/C/D":d<=18?"C":d<=21?"A":d<=22?"A/C/D":d<=25?"D":d<=28?"B":d<=29?"A/B/D":"A";
if(m===12)return d<=2?"A":d<=5?"C":d<=6?"A/B/C":d<=9?"B":d<=12?"D":d<=13?"B/C/D":d<=16?"C":d<=19?"A":d<=20?"A/C/D":d<=23?"D":d<=24?"B/C/D":d<=27?"A/B/C/D":"FERIE";
return "FUORI CALENDARIO";}
function hasTeam(v,t){return (v||"").split("/").includes(t)}
function getShift(dt,t){
const y=dt.getFullYear(),m=dt.getMonth()+1,d=dt.getDate();
if(y!==2026||m<10||m>12)return {code:"—",label:"Fuori calendario",note:"Calendario disponibile: ottobre–dicembre 2026.",out:true};
const a=squadra1(m,d),b=squadra2(m,d),c=squadra3(m,d),r=riposo(m,d);
if(a===t)return {code:"1°",label:"Mattina",note:"06:00–14:00"};
if(b===t)return {code:"2°",label:"Pomeriggio",note:"14:00–22:00"};
if(c===t)return {code:"3°",label:"Notte",note:"22:00–06:00"};
if(hasTeam(r,t))return {code:"R",label:"Riposo",note:"",rest:true};
if([a,b,c,r].includes("FERIE"))return {code:"F",label:"Ferie",note:"Ferie collettive / periodo non lavorato",rest:true};
return {code:"—",label:"Non previsto",note:"Turnazione non prevista per questa squadra/data.",out:true};}
function render(){
document.querySelectorAll("[data-team]").forEach(b=>b.classList.toggle("active",b.dataset.team===team));
document.getElementById("dayName").textContent=new Intl.DateTimeFormat("it-IT",{weekday:"long"}).format(currentDate);
document.getElementById("dateText").textContent=new Intl.DateTimeFormat("it-IT",{day:"2-digit",month:"long",year:"numeric"}).format(currentDate);
const s=getShift(currentDate,team),card=document.getElementById("shiftCard");
document.getElementById("shiftCode").textContent=s.code;document.getElementById("shiftLabel").textContent=s.label;document.getElementById("statusNote").textContent=s.note||"";
card.classList.toggle("rest",!!s.rest);card.classList.toggle("out",!!s.out);}
document.querySelectorAll("[data-team]").forEach(b=>b.onclick=()=>{team=b.dataset.team;localStorage.setItem("filctem_team",team);render()});
function add(n){currentDate.setDate(currentDate.getDate()+n);render()}
document.getElementById("prevBtn").onclick=()=>add(-1);document.getElementById("nextBtn").onclick=()=>add(1);document.getElementById("minus15").onclick=()=>add(-15);document.getElementById("plus15").onclick=()=>add(15);document.getElementById("todayBtn").onclick=()=>{currentDate=new Date();currentDate.setHours(12,0,0,0);render()};
document.getElementById("contacts").innerHTML=contacts.map(c=>`<div class="contact"><strong>${c.name}</strong><div class="actions"><a href="tel:${c.phone}">Chiama</a><a target="_blank" href="https://wa.me/${c.phone.replace(/\D/g,"")}">WhatsApp</a></div></div>`).join("");
document.querySelectorAll(".bottom button").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".bottom button").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  const target=document.getElementById(b.dataset.view);
  if(target) target.classList.add("active");
  if(b.dataset.view==="registro"){
    try { renderRegister(); } catch(e) { console.error("Errore Registro",e); }
  }
  window.scrollTo({top:0,behavior:"smooth"});
});
let deferredPrompt;addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;document.getElementById("installBtn").classList.remove("hide")});document.getElementById("installBtn").onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;document.getElementById("installBtn").classList.add("hide")}};
if("serviceWorker"in navigator)addEventListener("load",()=>navigator.serviceWorker.register("./sw.js"));

let registerDate=new Date(); registerDate.setDate(1); registerDate.setHours(12,0,0,0);
function regKey(d){return `filctem_reg_${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function loadReg(d){try{return JSON.parse(localStorage.getItem(regKey(d))||"{}")}catch{return {}}}
function saveReg(d,o){localStorage.setItem(regKey(d),JSON.stringify(o))}
function mins(v){if(!v||!v.includes(":"))return null;let [h,m]=v.split(":").map(Number);return h*60+m}
function worked(a,b){a=mins(a);b=mins(b);if(a===null||b===null)return 0;let x=b-a;return x<0?x+1440:x}
function renderRegister(){
  document.getElementById("monthTitle").textContent=new Intl.DateTimeFormat("it-IT",{month:"long",year:"numeric"}).format(registerDate);
  const y=registerDate.getFullYear(),m=registerDate.getMonth(),days=new Date(y,m+1,0).getDate();
  const monthListEl=document.getElementById("monthList"); monthListEl.innerHTML=""; let st=0,mg=0,fe=0,ma=0,pe=0,ua=0,wm=0;
  for(let n=1;n<=days;n++){
    const d=new Date(y,m,n,12),o=loadReg(d);
    st+=Number(o.straordinario||0);mg+=Number(o.maggiorazione||0);fe+=o.ferie?1:0;ma+=o.malattia?1:0;pe+=o.permesso?1:0;ua+=o.uscitaAnticipata?1:0;wm+=worked(o.entrata,o.uscita);
    const e=document.createElement("article");e.className="day-entry";
    e.innerHTML=`<div class="day-entry-head"><strong>${new Intl.DateTimeFormat("it-IT",{weekday:"short",day:"2-digit"}).format(d)}</strong><span>${String(n).padStart(2,"0")}/${String(m+1).padStart(2,"0")}</span></div>
    <div class="day-grid">
    <label>Entrata<input type="time" data-f="entrata" value="${o.entrata||""}"></label>
    <label>Uscita<input type="time" data-f="uscita" value="${o.uscita||""}"></label>
    <label>Straordinario (ore)<input type="number" step="0.25" min="0" data-f="straordinario" value="${o.straordinario||""}"></label>
    <label>Maggiorazioni (ore)<input type="number" step="0.25" min="0" data-f="maggiorazione" value="${o.maggiorazione||""}"></label></div>
    <div class="checks">
    <label><input type="checkbox" data-f="uscitaAnticipata" ${o.uscitaAnticipata?"checked":""}> Uscita anticipata</label>
    <label><input type="checkbox" data-f="ferie" ${o.ferie?"checked":""}> Ferie</label>
    <label><input type="checkbox" data-f="malattia" ${o.malattia?"checked":""}> Malattia</label>
    <label><input type="checkbox" data-f="permesso" ${o.permesso?"checked":""}> Permesso</label></div>
    <label>Note libere<textarea data-f="note" placeholder="Annotazioni del giorno...">${o.note||""}</textarea></label>`;
    e.querySelectorAll("[data-f]").forEach(inp=>{
      const save=()=>{const cur=loadReg(d),f=inp.dataset.f;cur[f]=inp.type==="checkbox"?inp.checked:inp.value;saveReg(d,cur)};
      inp.addEventListener(inp.tagName==="TEXTAREA"?"blur":"change",()=>{save(); if(inp.tagName!=="TEXTAREA") renderRegister()});
    });
    monthListEl.appendChild(e);
  }
  document.getElementById("monthTotals").innerHTML=`<div><strong>${Math.floor(wm/60)}h ${wm%60}m</strong><span>Ore entrata/uscita registrate</span></div><div><strong>${st.toFixed(2)}</strong><span>Ore straordinario</span></div><div><strong>${mg.toFixed(2)}</strong><span>Ore maggiorazioni</span></div><div><strong>${ua}</strong><span>Uscite anticipate</span></div><div><strong>${fe}</strong><span>Giorni ferie</span></div><div><strong>${ma}</strong><span>Giorni malattia</span></div><div><strong>${pe}</strong><span>Giorni permesso</span></div>`;
}
document.getElementById("prevMonth").onclick=()=>{registerDate.setMonth(registerDate.getMonth()-1);renderRegister()}
document.getElementById("nextMonth").onclick=()=>{registerDate.setMonth(registerDate.getMonth()+1);renderRegister()}
document.getElementById("printMonth").onclick=()=>window.print();

// Inizializzazione: prima i turni; il Registro viene costruito solo quando viene aperto.
try { render(); } catch (e) { console.error('Errore rendering turni', e); }

