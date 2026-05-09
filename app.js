const defaultState = {
  tracker: [
    { date: '09 May 2026', extractedEmail: 'choco-boubou@hotmail.fr', subject: 'Etsy Confirmación de pedido por: 3,74 € de: choco-boubou@hotmail.fr (4052703070)', orderId: '4052703070', status: 'Exported' }
  ],
  health: [
    'Last batch: 500 threads scanned',
    'Regex match rate: 99.2%',
    'Resume cursor saved: batch_0042'
  ],
  settings: {
    label: 'subject:("Etsy Confirmación de pedido") newer_than:30d',
    sheet: 'Gmail Subject Email Extracts'
  }
};

const state = structuredClone(defaultState);
const samples = [
`Etsy Confirmación de pedido por: 3,74 € de: choco-boubou@hotmail.fr (4052703070)
Etsy Confirmación de pedido por: 3,71 € de: karin.vandermost@web.de (4052663706)
Etsy Confirmación de pedido por: 3,71 € de: jenny.radeck@web.de (405719139)`,
`Etsy Confirmación de pedido por: 3,71 € de: karin.vandermost@web.de (4052663706)
Etsy Confirmación de pedido por: 3,71 € de: karin.vandermost@web.de (4052663706)
Etsy Confirmación de pedido por: 3,74 € de: choco-boubou@hotmail.fr (4052703070)`
];

const $ = id => document.getElementById(id);
const extractFromSubjects = text => text.split('\n').filter(Boolean).map(subject => {
  const email = (subject.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/) || [])[0] || '';
  const orderId = (subject.match(/\((\d+)\)/) || [,''])[1];
  return { date: '09 May 2026', extractedEmail: email, subject, orderId, status: email ? 'Ready' : 'No Match' };
});

function toast(msg) { $('toast').textContent = msg; $('toast').classList.add('show'); setTimeout(() => $('toast').classList.remove('show'), 1500); }
function addLog(msg) { $('log').insertAdjacentHTML('afterbegin', `<div class="log-line">✓ ${msg}</div>`); }

function renderTracker(filter = '') {
  const list = state.tracker.filter(r => Object.values(r).join(' ').toLowerCase().includes(filter.toLowerCase()));
  $('trackerRows').innerHTML = list.map(r => `<tr><td>${r.date}</td><td>${r.extractedEmail}</td><td>${r.subject}</td><td>${r.orderId}</td><td>${r.status}</td></tr>`).join('');
}
function renderHealth() { $('calendarQueue').innerHTML = state.health.map(h => `<li>${h}</li>`).join(''); }
function flowActive(step) { for (let i = 1; i <= 6; i++) { $(`flow-${i}`).classList.remove('active'); if (i < step) $(`flow-${i}`).classList.add('complete'); if (i === step) $(`flow-${i}`).classList.add('active'); } }
function setMeta() { $('labelDisplay').textContent = state.settings.label; $('sheetDisplay').textContent = state.settings.sheet; }

async function runDemo() {
  const scanned = extractFromSubjects($('emailBody').value);
  $('parserOutput').textContent = JSON.stringify(scanned, null, 2);
  if (!scanned.length) {
    $('errorOutput').textContent = 'No subject lines found for scanning.';
    addLog('Run halted: empty Gmail batch input.');
    toast('No subjects to scan');
    return;
  }

  for (let i = 1; i <= 6; i++) { flowActive(i); addLog(`Step ${i} completed.`); await new Promise(r => setTimeout(r, 180)); }

  const unique = [];
  const seen = new Set();
  for (const row of scanned) {
    const key = `${row.extractedEmail}-${row.orderId}`;
    if (!row.extractedEmail || seen.has(key)) continue;
    seen.add(key);
    unique.push({ ...row, status: 'Exported' });
  }

  state.tracker = [...unique, ...state.tracker];
  state.health = [
    `Last batch: ${scanned.length} subjects scanned`,
    `Emails extracted: ${scanned.filter(r => r.extractedEmail).length}`,
    `Duplicates removed: ${scanned.length - unique.length}`,
    `Resume cursor saved: batch_${String(state.tracker.length).padStart(4, '0')}`
  ];

  renderTracker();
  renderHealth();
  $('errorOutput').textContent = 'No blocking errors. Regex extraction, dedupe, and Google Sheets export simulation completed.';
  addLog('Run complete. Clean rows prepared for Google Sheets export.');
  toast('Extraction run complete');
}

function exportCsv() {
  const h = ['Date', 'Extracted Email', 'Subject', 'Order ID', 'Status'];
  const rows = state.tracker.map(r => [r.date, r.extractedEmail, r.subject, r.orderId, r.status]);
  const csv = [h, ...rows].map(r => r.map(v => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = 'gmail-subject-email-extracts.csv';
  a.click();
  URL.revokeObjectURL(a.href);
  addLog('CSV exported for Google Sheets upload.');
}

async function guided() {
  const ids = ['guide-intake', 'guide-parser', 'guide-tracker', 'guide-calendar', 'guide-health', 'guide-rail'];
  for (const id of ids) {
    document.querySelectorAll('.guide-highlight').forEach(x => x.classList.remove('guide-highlight'));
    $(id).classList.add('guide-highlight');
    toast(`Guided focus: ${id.replace('guide-', '')}`);
    await new Promise(r => setTimeout(r, 800));
  }
  document.querySelectorAll('.guide-highlight').forEach(x => x.classList.remove('guide-highlight'));
}

$('runDemo').onclick = runDemo;
$('loadRandom').onclick = () => $('emailBody').value = samples[Math.floor(Math.random() * samples.length)];
$('searchTracker').oninput = e => renderTracker(e.target.value);
$('exportCsv').onclick = exportCsv;
$('startGuide').onclick = guided;
$('resetDemo').onclick = () => {
  Object.assign(state, structuredClone(defaultState));
  $('log').innerHTML = '<div class="log-line">✓ Demo ready for Gmail subject scan.</div>';
  $('parserOutput').textContent = 'Run automation to scan subject lines.';
  $('errorOutput').textContent = 'Health checks: valid Gmail filter, regex match, duplicate cleanup, export readiness.';
  document.querySelectorAll('.flow-step').forEach(x => x.classList.remove('active', 'complete'));
  renderTracker();
  renderHealth();
  setMeta();
  toast('Simulation reset');
};

renderTracker();
renderHealth();
setMeta();
