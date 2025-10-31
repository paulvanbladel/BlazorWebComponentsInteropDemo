class ImmothekerWidget extends HTMLElement {
  static get observedAttributes() { return ['component-id']; }

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
    this._host = document.createElement('div');
    this._host.id = this.id || `cew-${(crypto?.randomUUID?.() || Math.random().toString(36).slice(2))}`;
    this._shadow.append(this._host);

    this._instance = null;
    this._params = {};
    this._debounce = null;

    this._observer = new MutationObserver(muts => {
      if (muts.some(m => m.type === 'attributes' && m.attributeName?.startsWith('param-'))) {
        this._scheduleRender();
      }
    });
    this._observer.observe(this, { attributes: true });
  }

  get params() { return this._params; }
  set params(value) {
    this._params = value ? { ...value } : {};
    this._scheduleRender();
  }

  get componentId() { return this.getAttribute('component-id'); }
  set componentId(v) { v ? this.setAttribute('component-id', v) : this.removeAttribute('component-id'); }

  attributeChangedCallback() { this._scheduleRender(); }
  connectedCallback() { this._scheduleRender(); }
  disconnectedCallback() { this._dispose(); this._observer.disconnect(); }

  _scheduleRender() {
    clearTimeout(this._debounce);
    this._debounce = setTimeout(() => this._render(), 0);
  }

  async _ensureBlazorReady() {
    if (window.Blazor?.rootComponents) return;
    await new Promise(resolve => {
      const tick = () => (window.Blazor?.rootComponents ? resolve() : requestAnimationFrame(tick));
      tick();
    });
  }

  _collectParams() {
    const obj = { ...this._params };
    for (const attr of this.getAttributeNames()) {
      if (!attr.startsWith('param-')) continue;
      const key = attr.slice(6).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      const raw = this.getAttribute(attr);
      obj[key] = this._coerce(raw);
    }
    obj.hostId = this._host.id;
    return obj;
  }

  _coerce(v) {
    if (v === 'true') return true;
    if (v === 'false') return false;
    if (v !== '' && !Number.isNaN(+v)) return +v;
    try {
      if ((v?.startsWith('{') && v.endsWith('}')) || (v?.startsWith('[') && v.endsWith(']'))) return JSON.parse(v);
    } catch {}
    return v;
  }

  async _render() {
    const id = this.componentId;
    if (!id) return;
    await this._ensureBlazorReady();

    if (this._instance) { this._instance.dispose(); this._instance = null; }

    const params = this._collectParams();
    this._instance = await Blazor.rootComponents.add(this._host, id, params);
  }

  _dispose() {
    if (this._instance) { this._instance.dispose(); this._instance = null; }
  }
}

customElements.define('immotheker-widget', ImmothekerWidget);
export {};
