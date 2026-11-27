{
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = n => '$' + (Number.isInteger(+n) ? +n : (+n).toFixed(2));
let DATA = {};
try { DATA = JSON.parse($('#lga-data')?.textContent || '{}'); } catch (_) {}

/* mobile menu */
const nav = $('.nav'), menu = $('.menu');
menu?.addEventListener('click', () => { const o = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', o); });

/* hero: the section is pinned; scrolling through it steps through the slides */
const hero = $('.hero');
if (hero) {
  const slides = $$('.slide', hero), tabs = $$('[data-go]', hero);
  const pinned = () => getComputedStyle($('.pin', hero)).position === 'sticky';
  let cur = -1, ticking = false;
  const show = i => {
    if (i === cur) return; cur = i;
    slides.forEach((s, k) => {
      const on = k === i; s.classList.toggle('is-on', on);
      if (pinned()) { s.setAttribute('aria-hidden', !on); $$('a,button', s).forEach(x => x.tabIndex = on ? 0 : -1); }
    });
    tabs.forEach((b, k) => b.setAttribute('aria-current', k === i));
  };
  const update = () => {
    ticking = false;
    if (!pinned()) { slides.forEach(s => { s.classList.add('is-on'); s.removeAttribute('aria-hidden'); $$('a,button', s).forEach(x => x.tabIndex = 0); }); cur = -1; return; }
    const r = hero.getBoundingClientRect(), pin = $('.pin', hero).offsetHeight;
    const span = Math.max(1, hero.offsetHeight - pin);
    const p = Math.min(1, Math.max(0, -r.top / span)) * slides.length;
    const i = Math.min(slides.length - 1, Math.floor(p));
    show(i);
    tabs.forEach((b, k) => b.style.setProperty('--p', Math.min(1, Math.max(0, p - k))));
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  tabs.forEach(b => b.addEventListener('click', () => {
    const k = +b.dataset.go, pin = $('.pin', hero).offsetHeight, span = hero.offsetHeight - pin;
    const top = hero.getBoundingClientRect().top + scrollY + span * (k + .5) / slides.length;
    scrollTo({ top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }));
  update();
}

/* gallery filters */
const fl = $('#filters');
if (fl) {
  const go = k => {
    $$('button', fl).forEach(b => b.setAttribute('aria-pressed', b.dataset.k === k));
    $$('[data-cat]', $('#gal')).forEach(c => c.hidden = !(k === 'all' || c.dataset.cat === k));
  };
  fl.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { go(b.dataset.k); history.replaceState(null, '', b.dataset.k === 'all' ? location.pathname : '#' + b.dataset.k); } });
  const h = location.hash.slice(1); if (h && $(`[data-k="${CSS.escape(h)}"]`, fl)) go(h);
}

/* order dialog */
const dlg = $('#dlg'); let msg = '';
const openOrder = (o, text) => {
  if (!dlg) return;
  msg = text;
  $('#dlgT').textContent = o.t; $('#dlgM').textContent = o.m || '';
  $('#dlgP').textContent = o.sold ? 'Sold' : (o.p ? money(o.p) : 'Priced per piece');
  const im = $('#dlgI'); im.src = o.img; im.alt = o.a || o.t;
  $('#dlgMsg').textContent = ''; $('#dlgMsg').className = 'note';
  dlg.showModal ? dlg.showModal() : dlg.setAttribute('open', '');
};
$('#dlgX')?.addEventListener('click', () => dlg.close());
dlg?.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
$('#dlgCopy')?.addEventListener('click', async () => {
  const out = $('#dlgMsg');
  try { await navigator.clipboard.writeText(msg); out.className = 'copied'; out.textContent = 'Copied! Paste it into a message to @littlegardenart.'; }
  catch (_) { out.className = 'note'; out.textContent = msg; }
});

/* christmas card packs */
$$('.xcard').forEach(card => {
  const c = (DATA.cards || []).find(x => x.id === card.dataset.id); if (!c) return;
  let pick = Math.min(1, c.packs.length - 1);
  card.addEventListener('click', e => {
    const b = e.target.closest('[data-i]');
    if (b) { pick = +b.dataset.i; $$('[data-i]', card).forEach(x => x.setAttribute('aria-pressed', x === b)); $('.price', card).textContent = money(c.packs[pick].p); return; }
    if (e.target.closest('[data-order]')) {
      const p = c.packs[pick];
      openOrder({ t: c.t + ' Christmas card', m: p.l + (c.inside ? ' · Inside: “' + c.inside + '”' : ''), p: p.p, img: '/img/' + c.img.replace('.jpg', '-640.webp'), a: c.t },
        `Hi Patsy! I'd like to order ${c.t} Christmas cards, ${p.l.toLowerCase()} (${money(p.p)}).`);
    }
  });
});

/* painting page buy */
$('[data-buy]')?.addEventListener('click', e => {
  const a = DATA.piece; if (!a) return;
  openOrder({ t: a.t, m: [a.m, a.size].filter(Boolean).join(' · '), p: a.p, img: '/img/' + a.img.replace('.jpg', '-640.webp'), a: a.a, sold: a.sold },
    a.sold ? `Hi Patsy! I saw "${a.t}" has sold. Could you paint something similar?` : `Hi Patsy! I'd like to buy your original "${a.t}" (${money(a.p)}). Is it still available?`);
});
$$('[data-ask]').forEach(b => b.addEventListener('click', () => openOrder({ t: 'A custom painting', m: 'Commissions are priced per piece.', p: 0, img: '/img/farmhouse-640.webp', a: 'A farmhouse painted by Patsy' }, b.dataset.ask)));
}
