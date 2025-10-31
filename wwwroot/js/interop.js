export function dispatchToHost(hostId, eventName, detail) {
  const el = document.getElementById(hostId);
  if (!el) return;
  el.dispatchEvent(new CustomEvent(eventName, { detail, bubbles: true, composed: true }));
}
