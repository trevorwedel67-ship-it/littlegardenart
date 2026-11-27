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

/* intro brush */
{
const intro = document.getElementById('intro');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
if (intro && !reduce.matches) {
  intro.classList.add('anim');
  const pin = intro.querySelector('.ipin'), fly = intro.querySelector('.bfly'), brushImg = fly.querySelector('img');
  const path = intro.querySelector('#sp'), svg = intro.querySelector('.stroke');
  // where the brush lies in the desk photo (2400x1350 source): tip and butt end
  const PH = { w: 2400, h: 1350, tip: [2362, 730], butt: [38, 625] };
  let W = 0, H = 0, len = 0, raf = 0;
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  function layout() {
    W = pin.clientWidth; H = pin.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const m = W < 720;
    const d = m
      ? `M ${W*.16} ${H*.62} C ${W*.45} ${H*.48}, ${W*.9} ${H*.58}, ${W*.6} ${H*.70} S ${W*.15} ${H*.84}, ${W*.82} ${H*.86}`
      : `M ${W*.14} ${H*.70} C ${W*.30} ${H*.42}, ${W*.42} ${H*.95}, ${W*.58} ${H*.68} S ${W*.78} ${H*.34}, ${W*.88} ${H*.52}`;
    path.setAttribute('d', d); len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.setAttribute('stroke-width', m ? 11 : 16);
    update();
  }
  function landing() {
    const s = Math.max(W / PH.w, H / PH.h), dx = W < 720 ? .96 : .5, ox = (W - PH.w * s) * dx, oy = (H - PH.h * s) / 2;
    const tx = ox + PH.tip[0] * s, ty = oy + PH.tip[1] * s, bx = ox + PH.butt[0] * s, by = oy + PH.butt[1] * s;
    const L = Math.hypot(tx - bx, ty - by);
    return { x: tx, y: ty, a: Math.atan2(ty - by, tx - bx) * 180 / Math.PI, w: L * 2152 / 2132 };
  }
  function update() {
    raf = 0;
    const r = intro.getBoundingClientRect(), span = Math.max(1, intro.offsetHeight - H);
    const p = clamp(-r.top / span), m = W < 720;
    const AR = 114 / 2152;                                   // brush height / width
    // starts standing vertical, tip down, sized to the screen height
    const big = H * (m ? .5 : .54);
    const blow = H * .86, mid = H * .62, drawW = Math.min(W * (m ? .55 : .3), 480);
    // phases
    const pA = ease(clamp(p / .13));                         // blow up
    const pB = ease(clamp((p - .13) / .09));                 // shrink back
    const pC = clamp((p - .22) / .18);                       // vertical spin, swelling in the middle
    const pD = ease(clamp((p - .40) / .10));                 // shrink and move to the start of the stroke
    const paint = clamp((p - .50) / .26);
    const land = ease(clamp((p - .77) / .13));
    const swap = clamp((p - .90) / .06);
    // size
    let w = lerp(big, blow, pA); w = lerp(w, mid, pB);
    w = w * (1 + .42 * Math.sin(Math.PI * pC));
    w = lerp(w, drawW, pD);
    // angle (butt -> tip direction) and vertical spin
    const spinZ = 360 * ease(pC), tilt = 22 * Math.sin(Math.PI * pC);
    const held = 128;
    let ang = 90 + spinZ;
    { let d = held - ang; d = ((d + 540) % 360) - 180; ang += d * pD; }
    // tip follows the stroke while painting
    const at = Math.max(.001, paint) * len, pt = path.getPointAtLength(at), pb = path.getPointAtLength(Math.max(0, at - 8));
    if (paint > 0) ang = held + Math.sin(Math.atan2(pt.y - pb.y, pt.x - pb.x)) * 14;
    const L = landing();
    { let d = L.a - ang; d = ((d + 540) % 360) - 180; ang += d * land; }
    w = lerp(w, L.w, land);
    const rad = ang * Math.PI / 180, ux = Math.cos(rad), uy = Math.sin(rad);
    // centre: floating in the middle, then tip-anchored on the stroke, then on the desk
    const tipAt = (tx, ty, ww) => ({ x: tx - ux * ww * .49, y: ty - uy * ww * .49 });
    const C0 = { x: W / 2, y: lerp(H * (m ? .66 : .71), H * .53, Math.max(pA, 1 - (1 - pA) * 1)) };
    let c = { x: C0.x, y: C0.y };
    const start = path.getPointAtLength(0);
    const cs = tipAt(start.x, start.y, w);
    c = { x: lerp(C0.x, cs.x, pD), y: lerp(C0.y, cs.y, pD) };
    if (paint > 0) c = tipAt(pt.x, pt.y, w);
    const cl = tipAt(L.x, L.y, w);
    const lift = Math.sin(Math.PI * land) * -40;
    c = { x: lerp(c.x, cl.x, land), y: lerp(c.y, cl.y, land) + lift };
    const h = w * AR;
    fly.style.setProperty('--bw', w + 'px');
    fly.style.transform = `translate(${c.x - w / 2}px, ${c.y - h / 2}px) perspective(1600px) rotate(${ang}deg) rotateX(${tilt}deg)`;
    // light and shadow: soft and far while high, tight on landing; light rolls across during the spin
    const air = 1 - land, sh = 10 + 34 * air, bl = 8 + 30 * air, al = .55 - .2 * air;
    const lightv = .86 + .14 * Math.cos(2 * spinZ * Math.PI / 180);
    fly.style.filter = `brightness(${lightv}) drop-shadow(0 ${sh}px ${bl}px rgba(0,0,0,${al}))`;
    fly.style.opacity = 1 - swap;
    fly.classList.toggle('idle', p < .02);
    path.style.strokeDashoffset = len * (1 - paint);
    path.style.opacity = 1 - land;
    intro.style.setProperty('--swap', swap);
    intro.style.setProperty('--desk', land);
    intro.style.setProperty('--t1', 1 - clamp(p / .07));
    intro.style.setProperty('--t1o', clamp(p / .07) * 30 + 'px');
    intro.style.setProperty('--t2', clamp((p - .92) / .06));
  }
  const tick = () => { if (!raf) raf = requestAnimationFrame(update); };
  addEventListener('scroll', tick, { passive: true });
  addEventListener('resize', layout);
  if (brushImg.complete) layout(); else brushImg.addEventListener('load', layout);
  layout();
}
}
}
