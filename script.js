// Teams
const nfcTeams = [
  { name: "Seattle Seahawks", seed: 1, code: "sea" },
  { name: "Chicago Bears", seed: 2, code: "chi" },
  { name: "Philadelphia Eagles", seed: 3, code: "phi" },
  { name: "Carolina Panthers", seed: 4, code: "car" },
  { name: "Los Angeles Rams", seed: 5, code: "lar" },
  { name: "San Francisco 49ers", seed: 6, code: "sf" },
  { name: "Green Bay Packers", seed: 7, code: "gb" }
];

const afcTeams = [
  { name: "Denver Broncos", seed: 1, code: "den" },
  { name: "New England Patriots", seed: 2, code: "ne" },
  { name: "Jacksonville Jaguars", seed: 3, code: "jax" },
  { name: "Pittsburgh Steelers", seed: 4, code: "pit" },
  { name: "Houston Texans", seed: 5, code: "hou" },
  { name: "Buffalo Bills", seed: 6, code: "buf" },
  { name: "Los Angeles Chargers", seed: 7, code: "lac" },
];

const state = { nfc:{wcWins:[], div:[]}, afc:{wcWins:[], div:[]} };

// Make clickable team div
function makeTeamDiv(team, onClick){
  const div = document.createElement("div");
  div.innerHTML = `<img src="https://a.espncdn.com/i/teamlogos/nfl/500/${team.code}.png" width="30" height="30"><span>${team.seed}. ${team.name}</span>`;
  div.style.display = "flex";
  div.style.justifyContent = "space-between";
  div.style.alignItems = "center";
  if(onClick) div.addEventListener("click",()=>onClick(team, div));
  return div;
}

function clearSelected(el){
  el.parentNode.querySelectorAll("div").forEach(s=>s.classList.remove("selected"));
}

// Wild Card
function renderWildCard(){
  const nfcWC=[[nfcTeams[1], nfcTeams[6]], [nfcTeams[2], nfcTeams[5]], [nfcTeams[3], nfcTeams[4]]];
  const afcWC=[[afcTeams[1], afcTeams[6]], [afcTeams[2], afcTeams[5]], [afcTeams[3], afcTeams[4]]];

  nfcWC.forEach((m,i)=>{
    const el=document.getElementById(`nfc-wc-${i+1}`); el.innerHTML="";
    m.forEach(team=>el.appendChild(makeTeamDiv(team,(t,d)=>pickWC("nfc",t,d))));
  });

  afcWC.forEach((m,i)=>{
    const el=document.getElementById(`afc-wc-${i+1}`); el.innerHTML="";
    m.forEach(team=>el.appendChild(makeTeamDiv(team,(t,d)=>pickWC("afc",t,d))));
  });

  // Render bye teams in Divisional
  const nfcDiv1=document.getElementById("nfc-div-1");
  nfcDiv1.innerHTML=""; nfcDiv1.appendChild(makeTeamDiv(nfcTeams[0], (t,d)=>pickDiv("nfc",t,d)));
  const afcDiv1=document.getElementById("afc-div-1");
  afcDiv1.innerHTML=""; afcDiv1.appendChild(makeTeamDiv(afcTeams[0], (t,d)=>pickDiv("afc",t,d)));
}

// Pick Wild Card winner
function pickWC(conf, team, div){
  clearSelected(div); div.classList.add("selected");
  if(!state[conf].wcWins.includes(team)) state[conf].wcWins.push(team);
  renderDivisional(conf);
}

// Divisional round
function renderDivisional(conf){
  const wins=state[conf].wcWins.slice().sort((a,b)=>b.seed-a.seed);
  if(wins.length<3) return;
  const lowest=wins[0], mid=wins[1], high=wins[2];
  const div1=document.getElementById(`${conf}-div-1`);
  if(div1.children.length<2) div1.appendChild(makeTeamDiv(lowest,(t,d)=>pickDiv(conf,t,d)));
  const div2=document.getElementById(`${conf}-div-2`);
  div2.innerHTML="";
  div2.appendChild(makeTeamDiv(mid,(t,d)=>pickDiv(conf,t,d)));
  div2.appendChild(makeTeamDiv(high,(t,d)=>pickDiv(conf,t,d)));
}

function pickDiv(conf, team, div){
  clearSelected(div); div.classList.add("selected");
  if(!state[conf].div.includes(team)) state[conf].div.push(team);
  if(state[conf].div.length===2) renderConference(conf);
}

function renderConference(conf){
  const [top,bot]=state[conf].div;
  const el=document.getElementById(`${conf}-conf`); el.innerHTML="";
  [top,bot].forEach(team=>el.appendChild(makeTeamDiv(team,(t,d)=>pickConf(t,d))));
}

function pickConf(team, div){
  clearSelected(div); div.classList.add("selected");
  const sbEl=document.getElementById("superbowl");
  const names=Array.from(sbEl.children).map(c=>c.textContent);
  if(!names.includes(team.name)) sbEl.appendChild(makeTeamDiv(team,()=>pickSB(team)));
}

// Pick Super Bowl champion → update big bottom box
function pickSB(team){
  const champBox=document.getElementById("champion-box");
  champBox.innerHTML="";
  const div=document.createElement("div");
  div.style.display="flex"; div.style.alignItems="center";
  div.innerHTML=`<img src="https://a.espncdn.com/i/teamlogos/nfl/500/${team.code}.png"><span>${team.name}</span>`;
  champBox.appendChild(div);
}

// Initialize
renderWildCard();