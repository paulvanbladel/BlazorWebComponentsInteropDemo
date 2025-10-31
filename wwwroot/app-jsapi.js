let instance = null;

function getParamsFromForm() {
  const title = document.getElementById('jsapi-title').value;
  const due   = new Date(document.getElementById('jsapi-due').value).toISOString();
  const important = document.getElementById('jsapi-important').checked;
  const count  = parseInt(document.getElementById('jsapi-count').value, 10);
  const amount = parseFloat(document.getElementById('jsapi-amount').value);
  const name   = document.getElementById('jsapi-customer').value;
  const vip    = document.getElementById('jsapi-vip').checked;

  return {
    title, due, important, count, amount,
    customer: { name, vip },
    hostId: 'jsapiHost'
  };
}

async function waitForBlazor() {
  if (window.Blazor?.rootComponents) return;
  await new Promise(resolve => {
    const tick = () => (window.Blazor?.rootComponents ? resolve() : requestAnimationFrame(tick));
    tick();
  });
}

async function mountOrUpdate() {
  const host = document.getElementById('jsapiHost');
  if (!host) return;
  await waitForBlazor();
  if (instance) { instance.dispose(); instance = null; }
  instance = await Blazor.rootComponents.add(host, 'rich', getParamsFromForm());
}

function disposeInst() {
  if (instance) { instance.dispose(); instance = null; }
}

// For demo: "invoke submit" just clicks the component's button via host query
function invokeSubmit() {
  const btn = document.querySelector('#jsapiHost button');
  if (btn) btn.click();
}

function onEvent(e) {
  document.getElementById('jsapi-out').textContent = JSON.stringify(e.detail, null, 2);
}

// wire up UI and event listener
document.getElementById('jsapi-mount').addEventListener('click', mountOrUpdate);
document.getElementById('jsapi-dispose').addEventListener('click', disposeInst);
document.getElementById('jsapi-submit').addEventListener('click', invokeSubmit);
document.getElementById('jsapiHost').addEventListener('rich:submit', onEvent);

// initial mount
mountOrUpdate();
