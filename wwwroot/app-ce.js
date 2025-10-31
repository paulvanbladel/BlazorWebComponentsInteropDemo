const el = document.getElementById('ceHost');
const out = document.getElementById('ce-out');

function getParamsFromCEForm() {
  const title = document.getElementById('ce-title').value;
  const due = new Date(document.getElementById('ce-due').value).toISOString();
  const important = document.getElementById('ce-important').checked;
  const count = parseInt(document.getElementById('ce-count').value, 10);
  const amount = parseFloat(document.getElementById('ce-amount').value);
  const name = document.getElementById('ce-customer').value;
  const vip = document.getElementById('ce-vip').checked;

  return {
    title, due, important, count, amount,
    customer: { name, vip }
  };
}

// set initial params from form
el.params = getParamsFromCEForm();

// listen for events from the component
el.addEventListener('rich:submit', (e) => {
  out.textContent = JSON.stringify(e.detail, null, 2);
});

// update button - now reads from form inputs
document.getElementById('ce-update').addEventListener('click', () => {
  el.params = getParamsFromCEForm();
});

// For demo: "invoke submit" just clicks the component's button via host query
function invokeSubmitCE() {
  // The custom element uses Shadow DOM, so we need to access the shadow root
  const ceHost = document.getElementById('ceHost');
  if (ceHost && ceHost.shadowRoot) {
    const btn = ceHost.shadowRoot.querySelector('button');
    if (btn) btn.click();
  }
}

// wire up the new submit button
document.getElementById('ce-submit').addEventListener('click', invokeSubmitCE);
