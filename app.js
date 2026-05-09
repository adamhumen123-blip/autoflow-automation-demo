const $ = id => document.getElementById(id);

const defaultState = {
  settings: { label: 'Client Requests' },
  log: ['✓ Console ready for extraction run.']
};

const state = structuredClone(defaultState);

const samples = [
  `Subject: Client Name=Meridian Wellness | Client Email=hello@meridianwellness.co | Project=New Inquiry Parsing Flow\nBody: Please process this request.`,
  `Subject: Client Name=Sunset Dental | Client Email=contact@sunsetdental.com | Project=Website Refresh\nBody: Please process this request.`
];

function addLog(msg) {
  state.log.unshift(`${new Date().toLocaleTimeString()} — ${msg}`);
  $('log').innerHTML = state.log.slice(0, 12).map(x => `<div class="log-line">${x}</div>`).join('');
}

function setMeta() {
  $('labelDisplay').textContent = state.settings.label;
}

function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || '');
}

function parseSubjectLine(text) {
  const subjectLine = (text.match(/^Subject:\s*(.*)$/im) || [])[1] || '';
  const pairs = subjectLine.split('|').map(x => x.trim());
  const data = {};
  for (const pair of pairs) {
    const [k, ...rest] = pair.split('=');
    if (!k || rest.length === 0) continue;
    data[k.trim().toLowerCase()] = rest.join('=').trim();
  }
  return {
    subject: subjectLine,
    client: data['client name'] || '',
    email: data['client email'] || '',
    project: data['project'] || ''
  };
}

function runDemo() {
  const parsed = parseSubjectLine($('emailBody').value);
  $('parserOutput').textContent = JSON.stringify(parsed, null, 2);

  const errs = [];
  if (!parsed.subject) errs.push('Missing subject');
  if (!parsed.client) errs.push('Missing client name');
  if (!validEmail(parsed.email)) errs.push('Invalid email');

  if (errs.length) {
    $('errorOutput').textContent = errs.join(' | ');
    addLog(`Extraction blocked: ${errs.join(', ')}`);
    return;
  }

  $('errorOutput').textContent = 'No blocking errors. Extraction health: stable.';
  addLog('Extraction complete. Subject fields parsed successfully.');
}

function simulateError(kind) {
  const map = {
    email: 'Invalid email: parsed value failed format check.',
    subject: 'Missing subject: no extraction performed.',
    client: 'Missing client name: required field not found in subject.'
  };
  $('errorOutput').textContent = map[kind];
  addLog(`Error simulation: ${kind}`);
}

$('runDemo').onclick = runDemo;
$('loadRandom').onclick = () => { $('emailBody').value = samples[Math.floor(Math.random() * samples.length)]; };
$('resetDemo').onclick = () => {
  Object.assign(state, structuredClone(defaultState));
  $('parserOutput').textContent = 'Run extraction to parse subject fields.';
  $('errorOutput').textContent = 'Validation watchlist: missing subject, missing client name, invalid email.';
  addLog('Simulation reset');
  setMeta();
};

document.querySelectorAll('.error-test').forEach(b => b.onclick = () => simulateError(b.dataset.case));
setMeta();
addLog('Ready.');
