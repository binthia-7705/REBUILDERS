// KTU REFORGE demo. All student data below is fictional.
const SURAKSHA_URL = "#"; // <- put the real Suraksha link here
const $ = id => document.getElementById(id);
const page = document.body.dataset.page;
const todayD = new Date(); todayD.setHours(0,0,0,0);
const fmt = d => d.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});

const STUDENT = {name:"Ananya S", reg:"REG22CS045", branch:"B.Tech Computer Science & Engg", sem:7};
const NOTICES = [
  ["Exam registration for S7 is now open","12 Oct"],["KTU holiday on 20th Oct 2026","10 Oct"],
  ["Result publication delayed","08 Oct"],["Attendance rules updated","05 Oct"],
  ["Workshop on AI & ML","02 Oct"],["Activity point submission reminder","28 Sep"]];
const DEADLINES = [
  ["Internal Mark Submission","Data Structures","2026-10-18"],["Assignment Submission","Database Management","2026-10-22"],
  ["Semester End Exam","Computer Networks","2026-10-28"],["Project Review","Mini Project","2026-11-05"],
  ["Fee Payment Last Date","Exam Fee","2026-11-10"]];
// code | name | credits | grade   (grade O,A+,A,B+,B,C,P,F)
const SUBJ = {
 1:["MAT101|Linear Algebra and Calculus|4|A","PHT100|Engineering Physics|4|B+","EST100|Engineering Mechanics|4|A","EST102|Programming in C|4|A+","HUN101|Life Skills|2|O"],
 2:["MAT102|Vector Calculus|4|A","CYT100|Engineering Chemistry|4|A","EST110|Engineering Graphics|3|B+","EST120|Basic Electrical Engg|4|A","HUN102|Professional Communication|2|A+"],
 3:["MAT203|Discrete Mathematics|4|A","CST201|Data Structures|4|A+","CST203|Logic System Design|4|B+","CST205|Object Oriented Programming|3|A"],
 4:["MAT204|Probability and Statistics|4|B+","CST202|Computer Organization|4|A","CST204|Database Management Systems|4|A","CST206|Operating Systems|4|F"],
 5:["CST301|Formal Languages and Automata|4|A","CST303|Computer Networks|4|B+","CST305|System Software|4|A","CST307|Microprocessors|4|A+"],
 6:["CST302|Compiler Design|4|A","CST304|Computer Graphics|4|B+","CST306|Algorithm Analysis|4|A","CST308|Comprehensive Course Work|1|O"],
 7:["CST401|Artificial Intelligence|4|A","CST403|Distributed Computing|4|B+","CST405|Machine Learning|3|A","CST407|Web Technologies|3|B"]
};
const subs = s => (SUBJ[s]||[]).map(r => { const [code,name,cr,gr] = r.split("|"); return {code,name,cr,gr}; });
const attPct = code => [...code].reduce((a,c)=>a+c.charCodeAt(0),0)%20 + 78; // demo value

// ---- shared layout ----
const NAV = [["index.html","Home","home"],["student.html","Student","student"],["exam.html","Exam","exam"],["result.html","Result","result"]];
document.body.insertAdjacentHTML("afterbegin",
 `<aside class="sidebar" id="sb"><div class="brand">KTU <b>REFORGE</b><small>A Smarter Student Portal</small></div>
 ${NAV.map(n=>`<a href="${n[0]}" class="${n[2]===page?"on":""}">${n[1]}</a>`).join("")}
 <a href="#" id="logout">Logout</a></aside>`);
const main = document.querySelector(".main");
main.insertAdjacentHTML("afterbegin",
 `<header class="topbar"><button class="menu" id="menu" aria-label="Menu">☰</button><div class="sp"></div>
 <button class="btn" id="surakshaTop">Suraksha</button>
 <div class="user"><i>AS</i><span>${STUDENT.name}</span></div></header>`);
main.insertAdjacentHTML("beforeend",`<footer>KTU Reforge is a student-inspired project, not an official KTU website. Demo data only.</footer>
 <button class="side" id="fbOpen">Feedback form</button>
 <dialog id="fb"><h3>Feedback form</h3><textarea id="fbText" placeholder="Write your feedback"></textarea>
 <button class="btn fill" id="fbSend">Send feedback</button> <button class="btn" onclick="this.closest('dialog').close()">Cancel</button></dialog>
 <div class="toast" id="toast"></div>`);

let tt; function toast(m){const t=$("toast");t.textContent=m;t.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("show"),2400)}
$("menu").onclick = () => $("sb").classList.toggle("open");
$("logout").onclick = e => {e.preventDefault();toast("Demo mode: no login in this prototype")};
const openSuraksha = e => {e.preventDefault(); SURAKSHA_URL==="#" ? toast("Add the Suraksha link in script.js") : window.open(SURAKSHA_URL,"_blank")};
$("surakshaTop").onclick = openSuraksha;
$("fbOpen").onclick = () => $("fb").showModal();
$("fbSend").onclick = () => { if(!$("fbText").value.trim()) return toast("Please write your feedback first");
  $("fbText").value=""; $("fb").close(); toast("Feedback sent. Thank you!") };

// ---- HOME ----
if (page === "home") {
  $("stdName").textContent = STUDENT.name; $("stdReg").textContent = STUDENT.reg;
  $("surakshaBtn").onclick = openSuraksha;
  $("notices").innerHTML = NOTICES.map(n=>`<li><span>${n[0]}</span><small>${n[1]}</small></li>`).join("");
  $("deadlines").innerHTML = DEADLINES.map(([t,s,d])=>{
    const n = Math.round((new Date(d+"T00:00")-todayD)/864e5);
    const tag = n<0 ? ["Passed",""] : n===0 ? ["Today","red"] : [`Due in ${n} day${n>1?"s":""}`, n<=7?"red":"green"];
    return `<li><span>${t}<small>${s} · ${fmt(new Date(d+"T00:00"))}</small></span><span class="tag ${tag[1]}">${tag[0]}</span></li>`}).join("");
  const prog = [90,75,68,82];
  $("progress").innerHTML = subs(7).map((s,i)=>`<div class="bar"><div><span>${s.name}</span><b>${prog[i]}%</b></div><div class="track"><span style="width:${prog[i]}%"></span></div></div>`).join("");

  let cm = todayD.getMonth(), cy = todayD.getFullYear();
  const EV = DEADLINES.map(d=>d[2]).concat(["2026-10-20"]);
  const drawCal = () => {
    $("monthLabel").textContent = new Date(cy,cm,1).toLocaleDateString("en-IN",{month:"long",year:"numeric"});
    let h = ["M","T","W","Th","F","S","S"].map(d=>`<b>${d}</b>`).join("");
    const lead = (new Date(cy,cm,1).getDay()+6)%7, days = new Date(cy,cm+1,0).getDate();
    h += "<span></span>".repeat(lead);
    for (let d=1; d<=days; d++){
      const key = `${cy}-${String(cm+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      const isToday = d===todayD.getDate() && cm===todayD.getMonth() && cy===todayD.getFullYear();
      h += `<span class="${isToday?"today":""} ${EV.includes(key)?"ev":""}">${d}</span>`;
    }
    $("cal").innerHTML = h;
  };
  $("prev").onclick = () => {cm--; if(cm<0){cm=11;cy--} drawCal()};
  $("next").onclick = () => {cm++; if(cm>11){cm=0;cy++} drawCal()};
  drawCal();
}

// ---- STUDENT ----
if (page === "student") {
  $("pf").innerHTML = [["Name",STUDENT.name],["Register No",STUDENT.reg],["Programme",STUDENT.branch],["Current semester","S"+STUDENT.sem],["Email","ananya.demo@example.com"]]
    .map(r=>`<tr><th>${r[0]}</th><td>${r[1]}</td></tr>`).join("");
  $("fees").innerHTML = [["S7 Tuition fee","₹ 45,000","Paid"],["S7 Exam fee","₹ 1,250","Paid"],["Library fee","₹ 500","Paid"]]
    .map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td><span class="tag green">${r[2]}</span></td></tr>`).join("");
}

// ---- EXAM ----
if (page === "exam") {
  const avg = s => { const l = subs(s); return l.length ? Math.round(l.reduce((a,x)=>a+attPct(x.code),0)/l.length) : null };
  const drawAtt = sel => {
    $("semList").innerHTML = [1,2,3,4,5,6,7,8].map(s=>{const a=avg(s);
      return `<button class="sem ${s===sel?"on":""}" data-s="${s}"><span>S${s}</span><span class="ring ${a&&a<75?"low":""}">${a??"–"}</span></button>`}).join("");
    $("semList").querySelectorAll(".sem").forEach(b=>b.onclick=()=>drawAtt(+b.dataset.s));
    const l = subs(sel);
    $("attTitle").textContent = `S${sel} subject-wise attendance`;
    $("attRows").innerHTML = l.length ? l.map(x=>{const a=attPct(x.code);
      return `<tr><td>${x.name}</td><td class="${a<75?"low-t":""}">${a}%</td></tr>`}).join("")
      : `<tr><td colspan="2">No attendance yet for S${sel}.</td></tr>`;
  };
  drawAtt(7);
  $("ttSem").innerHTML = [1,2,3,4,5,6,7].map(s=>`<option value="${s}" ${s===7?"selected":""}>Semester S${s}</option>`).join("");
  const drawTT = () => { const s=+$("ttSem").value;
    $("ttRows").innerHTML = subs(s).map((x,i)=>{
      const d = new Date(2026,9,28); d.setDate(d.getDate() - (7-s)*183 + i*2);
      return `<tr><td>${x.code}</td><td>${x.name}</td><td>${fmt(d)}</td></tr>`}).join("") };
  $("ttSem").onchange = drawTT; drawTT();
  $("revSub").innerHTML = subs(6).map(x=>`<option>${x.code} – ${x.name}</option>`).join("");
  $("revOpen").onclick = () => $("rev").showModal();
  $("revSend").onclick = () => { $("rev").close(); toast("Revaluation request saved (demo)") };
}

// ---- RESULT ----
if (page === "result") {
  const failed = [1,2,3,4,5,6,7].reduce((n,s)=>n+subs(s).filter(x=>x.gr==="F").length,0);
  $("failed").textContent = failed;
  $("gSem").innerHTML = `<option value="">Select</option>` + [1,2,3,4,5,6,7].map(s=>`<option value="${s}">S${s}</option>`).join("");
  $("gSem").onchange = () => { const s=+$("gSem").value;
    $("gCard").hidden = !s;
    $("gRows").innerHTML = subs(s).map(x=>`<tr><td>${x.code}</td><td>${x.name}</td><td>${x.cr}</td><td>${x.gr}</td>
      <td><span class="tag ${x.gr==="F"?"red":"green"}">${x.gr==="F"?"Fail":"Pass"}</span></td></tr>`).join("") };
}
