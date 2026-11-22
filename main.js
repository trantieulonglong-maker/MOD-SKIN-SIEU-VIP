/* FISH MOD Z · ALOK — main.js
 * Dựng lại từ hành vi quan sát được trong bản MHT. Script gốc không có trong MHT,
 * nên đây KHÔNG phải code gốc (xem README: mục "Không khôi phục được"). */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const CATS = ['hair', 'top', 'bottom', 'shoes', 'mask', 'face', 'action'];
  const sel = {};
  CATS.forEach(c => { sel[c] = $('#' + c); });
  const form = $('#wardrobe-form');
  const versionSel = $('#version');
  const statusEl = $('#status');
  const dialog = $('.item-picker-dialog');
  const list = $('.item-picker-list', dialog);
  const search = $('.item-picker-search', dialog);
  const title = $('#item-picker-title');
  const canPick = typeof dialog.showModal === 'function'; // không hỗ trợ <dialog> -> giữ <select> gốc

  const text = o => o.textContent.trim();
  const picked = c => sel[c].selectedOptions[0];
  const catLabel = c => text($('label[for="' + c + '"]'));
  const iconOf = c => $('img.category-icon', sel[c].closest('.form-row')).getAttribute('src');
  const btnOf = c => $('.item-picker-button', sel[c].parentElement);
  const fold = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
  const setStatus = (t, err) => { statusEl.textContent = t; statusEl.classList.toggle('error', !!err); };

  /* ---- Hiển thị: nhãn phiên bản, nút chọn, tóm tắt bộ đang chọn ---- */
  function render() {
    const v = text(versionSel.selectedOptions[0]);
    $('#platform-label').textContent = v;
    $('.intro .count').textContent = v;
    CATS.forEach(c => { const b = btnOf(c); if (b) b.lastChild.textContent = text(picked(c)); });
    $('#selection-summary').textContent =
      CATS.map(c => catLabel(c) + ': ' + text(picked(c))).join(' · ') + ' · Bản quyền FISH MOD Z';
  }

  /* ---- Hộp chọn trang phục (dialog + tìm kiếm không dấu) ---- */
  let current = null;

  function makeButton(c) {
    const wrap = sel[c].parentElement;
    const b = document.createElement('button');
    const img = new Image(38, 38);
    img.alt = ''; img.loading = 'lazy'; img.src = iconOf(c);
    b.type = 'button'; b.className = 'item-picker-button';
    b.setAttribute('aria-haspopup', 'dialog');
    b.setAttribute('aria-label', 'Chọn ' + catLabel(c));
    b.append(img, document.createElement('span'));
    b.addEventListener('click', () => openPicker(c));
    wrap.append(b);
    wrap.classList.add('picker-ready');
  }

  function renderList(q) {
    const f = fold(q.trim());
    const frag = document.createDocumentFragment();
    [...sel[current].options].forEach(o => {
      if (f && !fold(text(o)).includes(f)) return;
      const b = document.createElement('button');
      const img = new Image(38, 38);
      const span = document.createElement('span');
      img.alt = ''; img.src = iconOf(current); span.textContent = text(o);
      b.type = 'button'; b.className = 'item-picker-option'; b.dataset.index = o.index;
      b.setAttribute('role', 'option'); b.setAttribute('aria-selected', o.selected);
      b.append(img, span);
      frag.append(b);
    });
    if (!frag.childNodes.length) {
      const d = document.createElement('div');
      d.className = 'item-picker-empty'; d.textContent = 'Không tìm thấy trang phục.';
      frag.append(d);
    }
    list.textContent = '';
    list.append(frag);
  }

  function openPicker(c) {
    current = c;
    title.textContent = 'Chọn ' + catLabel(c);
    search.value = '';
    renderList('');
    dialog.showModal();
    const on = $('[aria-selected="true"]', list);
    if (on) on.scrollIntoView({ block: 'center' });
  }

  if (canPick) {
    CATS.forEach(makeButton);
    search.addEventListener('input', () => renderList(search.value));
    list.addEventListener('click', e => {
      const b = e.target.closest('.item-picker-option');
      if (!b) return;
      sel[current].selectedIndex = +b.dataset.index;
      sel[current].dispatchEvent(new Event('change', { bubbles: true }));
      dialog.close();
    });
    $('.item-picker-head button', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => { // bấm ra ngoài hộp (vùng backdrop) để đóng
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
    });
    form.addEventListener('click', e => { // bấm nhãn (Tóc, Áo...) cũng mở hộp chọn
      const l = e.target.closest('label[for]');
      if (l && sel[l.htmlFor]) { e.preventDefault(); openPicker(l.htmlFor); }
    });
  }

  /* ---- Form, phối ngẫu nhiên, bộ mặc định ---- */
  form.addEventListener('submit', e => e.preventDefault());
  form.addEventListener('change', e => {
    render();
    if (e.target === versionSel) setStatus('Phiên bản: ' + text(versionSel.selectedOptions[0]));
  });

  function setAll(pick) {
    CATS.forEach(c => { sel[c].selectedIndex = pick(sel[c]); });
    render();
  }
  $('#randomize').addEventListener('click', () => {
    setAll(s => Math.floor(Math.random() * s.options.length));
    setStatus('Đã phối ngẫu nhiên một bộ mới.');
  });
  $('#reset').addEventListener('click', () => {
    setAll(s => Math.max(0, [...s.options].findIndex(o => o.defaultSelected)));
    setStatus('Đã về bộ mặc định.');
  });

  /* ---- Menu hamburger ---- */
  const toggle = $('#fish-menu-toggle');
  const menu = $('#fish-menu');
  function setMenu(open) {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
  }
  toggle.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('click', e => { if (!menu.hidden && !e.target.closest('.fish-nav')) setMenu(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); }
  });

  /* ---- Xuất cấu hình bộ đồ (.json) ---- */
  const snap = o => ({
    version: o.value,
    label: text(o),
    selection: Object.fromEntries(CATS.map(c => [c, { id: picked(c).dataset.itemId, value: picked(c).value, name: text(picked(c)) }]))
  });
  const wrap = body => Object.assign({
    app: 'FISH MOD Z · ALOK', kind: 'outfit-preset',
    note: 'File cấu hình bộ đồ, không phải file mod của game.', created: new Date().toISOString()
  }, body);

  function save(name, data, okMsg) {
    try {
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
      const a = document.createElement('a');
      a.href = url; a.download = name;
      document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      setStatus(okMsg);
    } catch (err) {
      setStatus('Không thể lưu file: ' + err.message, true);
    }
  }
  $('#download').addEventListener('click', () => {
    const o = versionSel.selectedOptions[0];
    save('fish-mod-z-alok-' + o.value + '.json', wrap(snap(o)), 'Đã lưu bộ đồ cho ' + text(o) + '.');
  });
  $('#download-all').addEventListener('click', () => {
    save('fish-mod-z-alok-4-phien-ban.json', wrap({ versions: [...versionSel.options].map(snap) }),
      'Đã lưu cấu hình cho cả ' + versionSel.options.length + ' phiên bản.');
  });

  render();
})();
