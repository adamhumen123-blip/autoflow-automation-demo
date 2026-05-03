const state = {
  tracker: [
    {date:"02 May 2026", client:"XYZ Solutions", project:"CRM Integration", service:"API Integration", deadline:"10 May 2026", budget:"$1,200", status:"In Progress"},
    {date:"01 May 2026", client:"Nova Studio", project:"Email Automation", service:"Zapier Setup", deadline:"08 May 2026", budget:"$500", status:"Scheduled"}
  ],
  events: [
    {title:"Project Deadline - XYZ Solutions", date:"10 May 2026", description:"CRM Integration / API Integration"}
  ],
  invoices: [
    {id:"INV-1001", client:"Nova Studio", amount:"$500", status:"Draft"}
  ],
  emails: []
};

const samples = [
`Client Name: ABC Company
Client Email: client@example.com
Project: Website Automation
Deadline: 15 May 2026
Budget: $750
Service: Workflow Automation`,
`Client Name: Bright Dental
Client Email: manager@brightdental.example
Project: Appointment Reminder System
Deadline: 20 May 2026
Budget: $950
Service: Make.com Automation`,
`Client Name: GreenLeaf Realty
Client Email: ops@greenleaf.example
Project: Lead Routing Workflow
Deadline: 25 May 2026
Budget: $1,400
Service: Zapier CRM Automation`
];

function parseEmail(text){
  const get = (label) => {
    const match = text.match(new RegExp(label + "\\s*:\\s*(.+)", "i"));
    return match ? match[1].trim() : "";
  };
  return {
    client: get("Client Name") || "Unknown Client",
    email: get("Client Email") || "client@example.com",
    project: get("Project") || "New Project",
    deadline: get("Deadline") || "15 May 2026",
    budget: get("Budget") || "$0",
    service: get("Service") || "Workflow Automation"
  };
}

function renderTracker(filter=""){
  const tbody = document.getElementById("trackerRows");
  const rows = state.tracker.filter(r => Object.values(r).join(" ").toLowerCase().includes(filter.toLowerCase()));
  tbody.innerHTML = rows.map(r => `
    <tr>
      <td>${r.date}</td><td>${r.client}</td><td>${r.project}</td><td>${r.service}</td>
      <td>${r.deadline}</td><td>${r.budget}</td>
      <td><span class="pill ${r.status === "In Progress" ? "progress" : "scheduled"}">${r.status}</span></td>
    </tr>
  `).join("");
}

function renderCards(){
  document.getElementById("calendarCards").innerHTML = state.events.map(e => `
    <div class="card"><h3>📅 ${e.title}</h3><p><b>Date:</b> ${e.date}</p><p>${e.description}</p></div>
  `).join("");
  document.getElementById("invoiceCards").innerHTML = state.invoices.map(i => `
    <div class="card"><h3>🧾 ${i.id}</h3><p><b>Client:</b> ${i.client}</p><p><b>Amount:</b> ${i.amount}</p><p><b>Status:</b> ${i.status}</p></div>
  `).join("");
  document.getElementById("emailCards").innerHTML = state.emails.length ? state.emails.map(e => `
    <div class="card"><h3>✉️ ${e.subject}</h3><p><b>To:</b> ${e.to}</p><p>${e.body.replace(/\n/g,"<br>")}</p></div>
  `).join("") : `<div class="card"><p>No confirmation emails generated yet. Run the demo first.</p></div>`;
}

function addLog(text){
  const log = document.getElementById("log");
  const div = document.createElement("div");
  div.className = "log-item";
  div.textContent = "✓ " + text;
  log.prepend(div);
}

function activateStep(n){
  document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
  document.getElementById("step"+n).classList.add("active");
}

function sleep(ms){ return new Promise(res => setTimeout(res, ms)); }

async function runDemo(){
  document.getElementById("log").innerHTML = "";
  const data = parseEmail(document.getElementById("emailBody").value);

  activateStep(1);
  addLog("Gmail trigger detected a new labeled project request.");
  await sleep(600);

  activateStep(2);
  addLog(`Parser extracted: ${data.client}, ${data.project}, ${data.deadline}, ${data.budget}.`);
  await sleep(600);

  activateStep(3);
  const projectRow = {date:"03 May 2026", client:data.client, project:data.project, service:data.service, deadline:data.deadline, budget:data.budget, status:"Scheduled"};
  state.tracker.unshift(projectRow);
  renderTracker();
  document.getElementById("kpiRequests").textContent = state.tracker.length;
  addLog("Google Sheets tracker updated with a new project row.");
  await sleep(600);

  activateStep(4);
  state.events.unshift({title:`Project Deadline - ${data.client}`, date:data.deadline, description:`${data.project} / ${data.service}`});
  renderCards();
  document.getElementById("kpiEvents").textContent = state.events.length;
  addLog(`Calendar event created for ${data.deadline}.`);
  await sleep(600);

  activateStep(5);
  const invoiceId = "INV-" + String(1000 + state.invoices.length + 1);
  state.invoices.unshift({id:invoiceId, client:data.client, amount:data.budget, status:"Draft"});
  document.getElementById("kpiInvoices").textContent = state.invoices.length;
  const email = {
    to:data.email,
    subject:`Project Request Received - ${data.project}`,
    body:`Hi ${data.client},

Thanks for your project request.

Project: ${data.project}
Service: ${data.service}
Deadline: ${data.deadline}
Budget: ${data.budget}

We have added your request to our tracking system and created the required internal follow-up.

Best,
Your Team`
  };
  state.emails.unshift(email);
  renderCards();
  document.getElementById("emailPreview").textContent = `To: ${email.to}\n\nSubject: ${email.subject}\n\n${email.body}`;
  addLog(`Invoice draft ${invoiceId} generated and confirmation email prepared.`);
  showToast();
}

function resetDemo(){
  state.tracker = [
    {date:"02 May 2026", client:"XYZ Solutions", project:"CRM Integration", service:"API Integration", deadline:"10 May 2026", budget:"$1,200", status:"In Progress"},
    {date:"01 May 2026", client:"Nova Studio", project:"Email Automation", service:"Zapier Setup", deadline:"08 May 2026", budget:"$500", status:"Scheduled"}
  ];
  state.events = [{title:"Project Deadline - XYZ Solutions", date:"10 May 2026", description:"CRM Integration / API Integration"}];
  state.invoices = [{id:"INV-1001", client:"Nova Studio", amount:"$500", status:"Draft"}];
  state.emails = [];
  document.getElementById("log").innerHTML = `<div class="log-item">✓ Demo ready. Click Run Full Demo.</div>`;
  document.getElementById("emailPreview").textContent = "Confirmation email preview will appear here.";
  document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
  document.getElementById("kpiRequests").textContent = "2";
  document.getElementById("kpiEvents").textContent = "1";
  document.getElementById("kpiInvoices").textContent = "1";
  renderTracker();
  renderCards();
}

function showToast(){
  const toast = document.getElementById("toast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

document.querySelectorAll(".nav").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.page).classList.add("active");
  });
});

document.getElementById("runDemo").addEventListener("click", runDemo);
document.getElementById("resetDemo").addEventListener("click", resetDemo);
document.getElementById("searchTracker").addEventListener("input", e => renderTracker(e.target.value));
document.getElementById("loadRandom").addEventListener("click", () => {
  document.getElementById("emailBody").value = samples[Math.floor(Math.random()*samples.length)];
});

renderTracker();
renderCards();
