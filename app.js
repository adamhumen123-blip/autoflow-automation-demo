const defaultState = {
  tracker:[{date:'02 May 2026',client:'XYZ Solutions',project:'CRM Integration',service:'API Integration',deadline:'10 May 2026',budget:'$1,200',status:'In Progress'}],
  settings:{label:'Client Requests',sheet:'Automation Tracker',reminder:'2 days before',prefix:'INV',status:'Scheduled'},
  email:null
};
const state = structuredClone(defaultState);
const samples=[`Client Name: Bright Dental\nClient Email: manager@brightdental.com\nProject: Appointment Reminder System\nDeadline: 20 May 2026\nBudget: $950\nService: Make.com Automation`,`Client Name: Missing Budget Co\nClient Email: contact@missing.com\nProject: Intake Workflow\nDeadline: 18 May 2026\nService: Automation Build`];
const $=id=>document.getElementById(id);
function parseEmail(t){const get=l=>(t.match(new RegExp(l+"\\s*:\\s*(.+)","i"))||[])[1]?.trim()||''; return {client:get('Client Name'),email:get('Client Email'),project:get('Project'),deadline:get('Deadline'),budget:get('Budget'),service:get('Service')};}
function validEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);}
function addLog(msg){$('log').insertAdjacentHTML('afterbegin',`<div class="log-item">✓ ${msg}</div>`);} 
function activateStep(n){document.querySelectorAll('.step').forEach((s,i)=>s.classList.toggle('active',i===n-1));}
function renderTracker(filter=''){const rows=state.tracker.filter(r=>Object.values(r).join(' ').toLowerCase().includes(filter.toLowerCase())); $('trackerRows').innerHTML=rows.map(r=>`<tr><td>${r.date}</td><td>${r.client}</td><td>${r.project}</td><td>${r.service}</td><td>${r.deadline}</td><td>${r.budget}</td><td>${r.status}</td></tr>`).join('');}
function renderInvoice(data){$('invoicePreview').innerHTML=`<div class="head"><div><h3>${state.settings.prefix}-${1000+state.tracker.length}</h3><small>Status: Draft</small></div><div><b>AutoFlow Studio</b><br/>automation@autoflow.demo</div></div><p><b>Bill To:</b> ${data.client || 'Client Name'}</p><p><b>Project:</b> ${data.project || '-'}</p><p><b>Service:</b> ${data.service || '-'}</p><p><b>Deadline:</b> ${data.deadline || '-'}</p><h3>Total: ${data.budget || '$0'}</h3>`;}
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),1600)}
async function runDemo(){const d=parseEmail($('emailBody').value);$('log').innerHTML='';const errs=[]; if(!d.deadline) errs.push('Missing deadline'); if(!d.budget) errs.push('Missing budget'); if(!validEmail(d.email)) errs.push('Invalid email'); if(errs.length){$('errorOutput').textContent='Validation blocked automation:\n- '+errs.join('\n- '); addLog('Validation failed.'); toast('Validation error'); return;}
for(let i=1;i<=5;i++){activateStep(i); addLog(`Step ${i} completed.`); await new Promise(r=>setTimeout(r,280));}
state.tracker.unshift({date:'03 May 2026',client:d.client,project:d.project,service:d.service,deadline:d.deadline,budget:d.budget,status:state.settings.status});
state.email=`To: ${d.email}\nSubject: Request Received - ${d.project}\n\nHi ${d.client},\nYour request is now tracked in ${state.settings.sheet}.`;
$('emailPreview').textContent=state.email; renderTracker(); renderInvoice(d); addLog('Automation completed successfully.'); toast('Automation completed');}
function exportCsv(){const headers=['Date','Client','Project','Service','Deadline','Budget','Status'];const rows=state.tracker.map(r=>[r.date,r.client,r.project,r.service,r.deadline,r.budget,r.status]);const csv=[headers,...rows].map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\n');const blob=new Blob([csv],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='autoflow-tracker.csv';a.click();URL.revokeObjectURL(a.href);} 
function saveSettings(){state.settings={label:$('setLabel').value,sheet:$('setSheet').value,reminder:$('setReminder').value,prefix:$('setPrefix').value,status:$('setStatus').value};addLog('Settings updated.');toast('Settings saved');}
function simulateError(kind){const map={deadline:'Missing deadline: calendar event not created.',budget:'Missing budget: invoice total set to pending.',email:'Invalid email: confirmation held in draft queue.'};$('errorOutput').textContent=map[kind];}
async function guidedDemo(){const ids=['guide-email','guide-steps','guide-log'];for(const id of ids){document.querySelectorAll('.guide-highlight').forEach(e=>e.classList.remove('guide-highlight'));$(id).classList.add('guide-highlight');toast(`Guided step: ${id.replace('guide-','')}`);await new Promise(r=>setTimeout(r,900));}document.querySelectorAll('.guide-highlight').forEach(e=>e.classList.remove('guide-highlight'));}

document.querySelectorAll('.nav').forEach(btn=>btn.onclick=()=>{document.querySelectorAll('.nav,.panel').forEach(e=>e.classList.remove('active'));btn.classList.add('active');$(btn.dataset.page).classList.add('active');});
$('runDemo').onclick=runDemo;$('searchTracker').oninput=e=>renderTracker(e.target.value);$('loadRandom').onclick=()=>$('emailBody').value=samples[Math.floor(Math.random()*samples.length)];$('exportCsv').onclick=exportCsv;$('saveSettings').onclick=saveSettings;$('startGuide').onclick=guidedDemo;
document.querySelectorAll('.error-test').forEach(b=>b.onclick=()=>simulateError(b.dataset.case));
$('resetDemo').onclick=()=>{Object.assign(state, structuredClone(defaultState));$('emailPreview').textContent='Confirmation email preview will appear here.';$('log').innerHTML='<div class="log-item">✓ Demo ready.</div>';renderTracker();renderInvoice({});$('errorOutput').textContent='Run a test case to see simulated validation behavior.';toast('Reset complete');};
renderTracker();renderInvoice({});
