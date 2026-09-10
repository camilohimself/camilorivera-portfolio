/* A filterable drawer with a complete no-script reading order. */
(() => {
  'use strict';
  const root = document.documentElement;
  const items = [...document.querySelectorAll('[data-reserve-item]')];
  const filters = [...document.querySelectorAll('[data-regard]')];
  const toolbar = document.querySelector('.reserve-toolbar');
  const more = document.querySelector('.reserve-more');
  const status = document.querySelector('.reserve-status');
  if (!items.length || !toolbar || !more) return;
  const allowed = new Set(filters.map(button => button.dataset.regard));
  let kind = new URL(location.href).searchParams.get('regard') || 'all';
  if (!allowed.has(kind)) kind = 'all';
  let limit = 16;
  const matching = () => items.filter(item => kind === 'all' || item.dataset.kind === kind);
  function render() {
    const selected = matching();
    const visible = new Set(selected.slice(0, limit));
    items.forEach(item => { item.hidden = !visible.has(item); });
    selected.forEach((item, index) => {
      const hanging = index % 8;
      item.dataset.hang = String(hanging + 1);
      const mobileWidths = [83, 46, 40, 53, 90, 46, 38, 75];
      const desktopWidths = [57, 37, 30, 42, 64, 24, 29, 50];
      item.querySelector('img').sizes = `(max-width: 700px) ${mobileWidths[hanging]}vw, ${desktopWidths[hanging]}vw`;
    });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.regard === kind)));
    more.hidden = selected.length <= limit;
    const count = Math.min(limit, selected.length);
    status.textContent = root.lang === 'en' ? `${count} of ${selected.length} fragments` : `${count} fragments sur ${selected.length}`;
  }
  filters.forEach(button => button.addEventListener('click', () => {
    kind = button.dataset.regard;
    limit = 16;
    const url = new URL(location.href);
    if (kind === 'all') url.searchParams.delete('regard');
    else url.searchParams.set('regard', kind);
    history.replaceState(history.state, '', url);
    render();
  }));
  document.querySelector('[data-reserve-more]').addEventListener('click', () => {
    const firstNew = matching()[limit];
    limit += 16;
    render();
    if (firstNew) {
      firstNew.querySelector('a').focus({preventScroll: true});
      firstNew.scrollIntoView({block: 'start', behavior: 'instant'});
    }
  });
  new MutationObserver(render).observe(root, {attributes: true, attributeFilter: ['lang']});
  window.addEventListener('popstate', () => {
    const value = new URL(location.href).searchParams.get('regard') || 'all';
    if (allowed.has(value) && value !== kind) { kind = value; limit = 16; render(); }
  });
  toolbar.hidden = false;
  render();
})();
