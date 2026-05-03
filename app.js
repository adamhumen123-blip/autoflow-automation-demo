const defaultState = {
  tracker:[{date:'01 May 2026',client:'Everline Contractors',project:'Bid Intake Sync',deadline:'12 May 2026',budget:'$1,300',status:'Queued'}],
  calendar:[{title:'Everline Contractors | Bid Intake Sync',deadline:'12 May 2026'}],
  settings:{label:'Client Requests',sheet:'Project Milestones Tracker',calendar:'Operations Calendar',prefix:'OFF-',status:'Queued'}
};
const state = structuredClone(defaultState);
const samples=[`Client Name: Meridian Wellness\nClient Email: hello@meridianwellness.co\nProject: New Inquiry Parsing Flow\nDeadline: 21 May 2026\nBudget: $2,200\nService: Operations automation`,`Client Name: Budget Missing Demo\nClient Email: ops@budget-missing.io\nProject: Tracker Cleanup\nDeadline: 19 May 2026\nService: Workflow rebuild`];
const $=id=>document.getElementById(id);
const parse = t => {const g=k=>(t.match(new RegExp(k+"\\s*:\\s*(.+)","i"))||[])[1]?.trim()||''; return {client:g('Client Name'),email:g('Client Email'),project:g('Project'),deadline:g('Deadline'),budget:g('Budget'),service:g('Service')};};
const validEmail=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
function toast(msg){$('toast').textContent=msg;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),1500)}
function addLog(msg){$('log').insertAdjacentHTML('afterbegin',`<div class="log-line">✓ ${msg}</div>`)}
function renderTracker(filter=''){const list=state.tracker.filter(r=>Object.values(r).join(' ').toLowerCase().includes(filter.toLowerCase()));$('trackerRows').innerHTML=list.map(r=>`<tr><td>${r.date}</td><td>${r.client}</td><td>${r.project}</td><td>${r.deadline}</td><td>${r.budget}</td><td>${r.status}</td></tr>`).join('');}
function renderCalendar(){ $('calendarQueue').innerHTML=state.calendar.map(c=>`<li>${c.title} → ${c.deadline}</li>`).join(''); }
function renderInvoice(d={}){const num=1000+state.tracker.length;$('invoicePreview').innerHTML=`<strong>${state.settings.prefix}${num}</strong><br/><small>Draft status: Pending review</small><hr/><b>Client:</b> ${d.client||'—'}<br/><b>Project:</b> ${d.project||'—'}<br/><b>Service:</b> ${d.service||'—'}<br/><b>Deadline:</b> ${d.deadline||'—'}<br/><b>Total:</b> ${d.budget||'$0'}<br/><small>Generated from intake + tracker data.</small>`;}
function flowActive(step){for(let i=1;i<=6;i++){$(`flow-${i}`).classList.remove('active');if(i<step)$(`flow-${i}`).classList.add('complete');if(i===step)$(`flow-${i}`).classList.add('active');}}
function setMeta(){$('labelDisplay').textContent=state.settings.label;$('sheetDisplay').textContent=state.settings.sheet;$('calendarDisplay').textContent=state.settings.calendar;$('prefixDisplay').textContent=state.settings.prefix;}
async function runDemo(){const d=parse($('emailBody').value);$('parserOutput').textContent=JSON.stringify(d,null,2);const errs=[];if(!d.deadline) errs.push('Missing deadline');if(!d.budget) errs.push('Missing budget');if(!validEmail(d.email)) errs.push('Invalid email');
if(errs.length){$('errorOutput').textContent='Validation blocked run:\n- '+errs.join('\n- ');addLog('Validation halted: '+errs.join(', '));toast('Validation error');return;}
for(let i=1;i<=6;i++){flowActive(i);addLog(`Step ${i} completed.`);await new Promise(r=>setTimeout(r,220));}
state.tracker.unshift({date:'03 May 2026',client:d.client,project:d.project,deadline:d.deadline,budget:d.budget,status:state.settings.status});
state.calendar.unshift({title:`${d.client} | ${d.project}`,deadline:d.deadline});
renderTracker();renderCalendar();renderInvoice(d);$('errorOutput').textContent='No blocking errors. Automation health: stable.';addLog('Run complete. Offer and invoice draft created.');toast('Automation run complete');}
function exportCsv(){const h=['Date','Client','Project','Deadline','Budget','Status'];const rows=state.tracker.map(r=>[r.date,r.client,r.project,r.deadline,r.budget,r.status]);const csv=[h,...rows].map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='opsflow-project-tracker.csv';a.click();URL.revokeObjectURL(a.href);addLog('CSV exported for handoff.');}
function simulateError(kind){const map={deadline:'Missing deadline: cannot write reminder to Operations Calendar.',budget:'Missing budget: offer total stays blank until clarified.',email:'Invalid email: follow-up kept in draft, no send action.'};$('errorOutput').textContent=map[kind];addLog(`Error simulation: ${kind}`)}
async function guided(){const ids=['guide-intake','guide-parser','guide-tracker','guide-calendar','guide-invoice','guide-health','guide-rail'];for(const id of ids){document.querySelectorAll('.guide-highlight').forEach(x=>x.classList.remove('guide-highlight'));$(id).classList.add('guide-highlight');toast(`Guided focus: ${id.replace('guide-','')}`);await new Promise(r=>setTimeout(r,800));}document.querySelectorAll('.guide-highlight').forEach(x=>x.classList.remove('guide-highlight'));}
$('runDemo').onclick=runDemo;$('loadRandom').onclick=()=>$('emailBody').value=samples[Math.floor(Math.random()*samples.length)];$('searchTracker').oninput=e=>renderTracker(e.target.value);$('exportCsv').onclick=exportCsv;$('startGuide').onclick=guided;
document.querySelectorAll('.error-test').forEach(b=>b.onclick=()=>simulateError(b.dataset.case));
$('resetDemo').onclick=()=>{Object.assign(state,structuredClone(defaultState));$('log').innerHTML='<div class="log-line">✓ Console ready for demo run.</div>';$('parserOutput').textContent='Run automation to parse intake fields.';$('errorOutput').textContent='Error handling watchlist: Missing deadline, missing budget, invalid email.';document.querySelectorAll('.flow-step').forEach(x=>x.classList.remove('active','complete'));renderTracker();renderCalendar();renderInvoice();setMeta();toast('Simulation reset');};
renderTracker();renderCalendar();renderInvoice();setMeta();
