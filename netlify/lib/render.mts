import { IMG } from "./images.mts"

export const SITE = "Little Garden Art"
export const ARTIST = "Patricia Ann Wedel"
export const IG = "https://www.instagram.com/littlegardenart/"
const ASSET_V = "5"

export const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!))
export const money = (n: number) => "$" + (Number.isInteger(+n) ? +n : (+n).toFixed(2))
const base = (img: string) => String(img).replace(/\.jpg$/, "").replace(/[^a-z0-9-]/gi, "")
const json = (o: unknown) => JSON.stringify(o).replace(/</g, "\\u003c")
const catName: Record<string, string> = { acrylic: "Acrylic", watercolor: "Watercolor", framed: "Framed", little: "Little ones" }

export function pic(img: string, alt: string, opts: { sizes?: string; cls?: string; eager?: boolean } = {}) {
  const b = base(img), [w, h] = IMG[b] ?? [1200, 900]
  const sizes = opts.sizes ?? "(max-width: 720px) 92vw, 40vw"
  return `<picture><source type="image/webp" srcset="/img/${b}-640.webp 640w, /img/${b}-1200.webp 1200w" sizes="${sizes}"><img src="/img/${b}.jpg" width="${w}" height="${h}" alt="${esc(alt)}"${opts.cls ? ` class="${opts.cls}"` : ""}${opts.eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}></picture>`
}

const logo = `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18.5" fill="none" stroke="#c9a24c" stroke-width="1.5"/><path d="M20 30c0-7 0-12 0-16m0 6c-4-1-7-4-7-8 4 0 7 3 7 8zm0 3c4-1 7-4 7-8-4 0-7 3-7 8z" fill="none" stroke="#e2c27a" stroke-width="1.6" stroke-linecap="round"/></svg>`

const NAV = [["/", "Home"], ["/shop", "Originals"], ["/christmas-cards", "Christmas cards"], ["/about", "About Patsy"], ["/commissions", "Commissions"]]

type Page = { title: string; desc: string; path: string; origin: string; img?: string; type?: string; ld?: any[]; body: string; data?: any }

export function layout(p: Page) {
  const url = p.origin + p.path
  const ogImg = p.origin + "/img/" + base(p.img ?? "main-street") + ".jpg"
  const org = { "@type": "Organization", "@id": p.origin + "/#org", name: SITE, url: p.origin + "/", sameAs: [IG], founder: { "@id": p.origin + "/#patsy" } }
  const person = { "@type": "Person", "@id": p.origin + "/#patsy", name: ARTIST, alternateName: "Patsy Wedel", jobTitle: "Artist", sameAs: [IG] }
  const graph = { "@context": "https://schema.org", "@graph": [org, person, { "@type": "WebSite", "@id": p.origin + "/#site", url: p.origin + "/", name: SITE, publisher: { "@id": p.origin + "/#org" } }, ...(p.ld ?? [])] }
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.desc)}">
<link rel="canonical" href="${esc(url)}">
<meta property="og:site_name" content="${SITE}">
<meta property="og:type" content="${p.type ?? "website"}">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.desc)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(ogImg)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#10241f">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Nunito+Sans:wght@400;600;700;800&family=Caveat:wght@500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css?v=${ASSET_V}">
<script type="application/ld+json">${json(graph)}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="nav"><div class="wrap">
  <a class="logo" href="/" aria-label="${SITE} home">${logo}<span><b>${SITE}</b><small>by Patsy Wedel</small></span></a>
  <button class="menu" type="button" aria-expanded="false" aria-controls="sitenav">Menu</button>
  <nav id="sitenav" aria-label="Main">${NAV.map(([h, l]) => `<a href="${h}"${h === p.path ? ' aria-current="page"' : ""}>${l}</a>`).join("")}</nav>
</div></header>
<main id="main">
${p.body}
</main>
<footer><div class="wrap">
  <div class="cols">
    <div style="display:grid;gap:12px;align-content:start"><a class="logo" href="/">${logo}<span><b>${SITE}</b><small>by Patsy Wedel</small></span></a>
      <p style="color:#cfdad4;max-width:30em">Original watercolors, acrylics and hand-finished Christmas cards by ${ARTIST}.</p></div>
    <div><p class="hand" style="color:var(--gold);font-size:22px;margin-bottom:8px">Shop</p><ul><li><a href="/shop">Original paintings</a></li><li><a href="/christmas-cards">Christmas cards</a></li><li><a href="/commissions">Commissions</a></li></ul></div>
    <div><p class="hand" style="color:var(--gold);font-size:22px;margin-bottom:8px">Visit</p><ul><li><a href="/about">About Patsy</a></li><li><a href="${IG}" rel="me">Instagram @littlegardenart</a></li></ul></div>
  </div>
  <div class="fine"><span>&copy; ${new Date().getFullYear()} ${SITE}. All artwork &copy; ${ARTIST}.</span><span>Every piece made by hand.</span></div>
</div></footer>
<dialog id="dlg" aria-labelledby="dlgT"><div style="position:relative">
  <button class="x" type="button" id="dlgX" aria-label="Close">&times;</button>
  <div class="dlg"><div class="im"><img id="dlgI" alt=""></div>
  <div class="tx"><h2 id="dlgT" style="font-size:28px"></h2><p id="dlgM" class="soft"></p><div class="price" id="dlgP" style="font-size:26px"></div>
    <div class="howbuy"><b>How to order</b><p>Send Patsy a message on Instagram with what you&rsquo;d like. She&rsquo;ll reply with shipping and payment.</p>
    <div class="btns"><button class="btn gold" type="button" id="dlgCopy">Copy my order</button><a class="btn ghost" href="${IG}">Open Instagram</a></div><p id="dlgMsg" class="note" role="status"></p></div>
  </div></div></div></dialog>
<script type="application/json" id="lga-data">${json(p.data ?? {})}</script>
<script src="/assets/site.js?v=${ASSET_V}" defer></script>
</body>
</html>`
}

const artCard = (a: any) => `<a class="card" href="/shop/${esc(a.id)}" data-cat="${esc(a.c)}">
  <div class="frame"><div class="mat">${pic(a.img, a.a, { sizes: "(max-width: 600px) 80vw, 300px" })}</div></div>
  <div class="lab"><div class="row"><h3>${esc(a.t)}</h3>${a.sold ? '<span class="sold">Sold</span>' : `<span class="price">${money(a.p)}</span>`}</div>
  <span class="medium">${esc([a.m.split(",")[0], a.size].filter(Boolean).join(" · "))}</span></div></a>`

const xCard = (c: any) => {
  const pick = Math.min(1, c.packs.length - 1)
  return `<article class="xcard" data-id="${esc(c.id)}">
  <div class="ph">${pic(c.img, c.t + " Christmas card", { sizes: "(max-width: 720px) 70vw, 300px" })}</div>
  <div class="body"><h3 style="font-size:24px">${esc(c.t)}</h3><p class="soft">${esc(c.d)}</p>${c.inside ? `<p class="inside">Inside: &ldquo;${esc(c.inside)}&rdquo;</p>` : ""}
  <div class="packs" role="group" aria-label="How many ${esc(c.t)} cards">${c.packs.map((p: any, i: number) => `<button type="button" data-i="${i}" aria-pressed="${i === pick}">${esc(p.l)}</button>`).join("")}</div>
  <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><span class="price" style="font-size:26px">${money(c.packs[pick].p)}</span><button class="btn gold" type="button" data-order>Order cards</button></div>
  <p class="note">Folded card, cream envelope, sealed sleeve, hand-stamped.</p></div></article>`
}

const cardsData = (c: any) => c.cards.map((x: any) => ({ id: x.id, t: x.t, img: x.img, inside: x.inside, packs: x.packs }))
const productLd = (o: string, a: any) => ({
  "@type": ["Product", "VisualArtwork"], "@id": `${o}/shop/${a.id}#work`, name: a.t, sku: a.id, url: `${o}/shop/${a.id}`,
  image: `${o}/img/${base(a.img)}.jpg`, description: a.story || a.m, artMedium: a.m, artform: "Painting",
  ...(a.size ? { size: a.size } : {}), creator: { "@id": `${o}/#patsy` }, brand: { "@type": "Brand", name: SITE },
  offers: { "@type": "Offer", price: String(a.p), priceCurrency: "USD", url: `${o}/shop/${a.id}`, itemCondition: "https://schema.org/NewCondition",
    availability: a.sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock", seller: { "@id": `${o}/#patsy` } }
})
const crumbs = (o: string, items: [string, string][]) => ({ "@type": "BreadcrumbList", itemListElement: items.map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: o + u })) })

/* ---------- pages ---------- */

export function home(c: any, o: string) {
  const byId = (id: string) => c.art.find((a: any) => a.id === id)
  const pr = byId("pronghorn")
  const featured = c.art.filter((a: any) => a.c !== "little").slice(0, 6)
  const intro = `<section class="intro" id="intro" aria-label="Welcome">
 <div class="ipin">
  <picture class="desk empty"><source type="image/webp" srcset="/img/desk-empty-1200.webp 1200w, /img/desk-empty-1920.webp 1920w" sizes="100vw"><img src="/img/desk.jpg" alt="" width="1920" height="1080"></picture>
  <picture class="desk full"><source type="image/webp" srcset="/img/desk-1200.webp 1200w, /img/desk-1920.webp 1920w" sizes="100vw"><img src="/img/desk.jpg" alt="A paintbrush resting on Patsy's teal painted desk" width="1920" height="1080" fetchpriority="high"></picture>
  <svg class="stroke" aria-hidden="true"><defs><filter id="rough"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="7"/></filter>
   <linearGradient id="gold" x1="0" x2="1"><stop offset="0" stop-color="#b98f3a"/><stop offset=".5" stop-color="#e8c873"/><stop offset="1" stop-color="#c9a24c"/></linearGradient></defs>
   <path id="sp" fill="none" stroke="url(#gold)" stroke-width="16" stroke-linecap="round" filter="url(#rough)"/></svg>
  <div class="bfly" aria-hidden="true"><img class="brush" src="/img/brush.webp" alt="" width="1400" height="74"></div>
  <div class="itext"><span class="hand">Little Garden Art</span><h1 class="ititle">Every painting begins with a brush</h1><p class="soft">Original art by Patsy Wedel</p></div>
  <div class="iend"><p class="hand">&hellip;and ends on your wall.</p></div>
  <a class="iskip" href="#paintings">Skip to the paintings &darr;</a>
  <span class="icue" aria-hidden="true">Scroll</span>
 </div>
</section>`
  const hero = `<section class="hero teal" id="paintings" aria-label="Featured work">
 <div class="pin"><div class="wrap">
  <div class="slides">
   <article class="slide is-on" aria-roledescription="slide" aria-label="1 of 3">
    <div class="txt"><span class="count">I.</span>
      <span class="kick">Christmas cards &middot; <b>order by ${esc(c.deadline)}</b></span>
      <h2 style="font-size:clamp(36px,5.6vw,60px)">Christmas on Main Street</h2>
      <p class="lede soft">Snow falls on the soda fountain, the saddlery and the 1911 bank while a young family walks the new baby past lit shop windows. Now Patsy&rsquo;s Warmest Wishes card.</p>
      <p class="cast"><span class="hand">Starring</span> the family with the pram &middot; the patient black horse &middot; the 1911 bank</p>
      <div class="btns"><a class="btn gold" href="/christmas-cards">Shop Christmas cards</a><a class="btn ghost" href="/shop">See the originals</a></div></div>
    <div class="stage">${pic("main-street.jpg", "Patsy Wedel's acrylic painting of a snowy old-time main street with a family, a pram and a horse", { cls: "main", eager: true, sizes: "(max-width: 720px) 92vw, 55vw" })}
      <div class="lean">${pic("church.jpg", "The Christmas Blessings card: a white church in the snow", { sizes: "220px" })}<span class="hand">Christmas Blessings</span></div></div>
   </article>
   <article class="slide" aria-roledescription="slide" aria-label="2 of 3">
    <div class="txt"><span class="count">II.</span>
      <span class="kick">Original acrylic &middot; <b>one of a kind</b></span>
      <h2 class="h1" style="font-size:clamp(36px,5.6vw,60px)">Harrington Reservoir</h2>
      <p class="lede soft">A pronghorn and a curious white dog meet at the water&rsquo;s edge under red bluffs, painted on stretched canvas with the scene wrapped around its edges.</p>
      <p class="cast"><span class="hand">Starring</span> the pronghorn &middot; the white dog &middot; the old signpost</p>
      <div class="btns"><a class="btn gold" href="/shop/pronghorn">${pr && !pr.sold ? `View painting &middot; ${money(pr.p)}` : "View painting"}</a><a class="btn ghost" href="/shop">All originals</a></div></div>
    <div class="stage">${pic("pronghorn.jpg", "Painting of a pronghorn and a white dog beside a reservoir under red bluffs", { cls: "main", sizes: "(max-width: 720px) 92vw, 55vw" })}
      <div class="lean">${pic("moose.jpg", "Watercolor of a cow moose and calf in the snow", { sizes: "220px" })}<span class="hand">Moose and Calf</span></div></div>
   </article>
   <article class="slide" aria-roledescription="slide" aria-label="3 of 3">
    <div class="txt"><span class="count">III.</span>
      <span class="kick">Small watercolors &middot; <b>little gifts</b></span>
      <h2 style="font-size:clamp(36px,5.6vw,60px)">The little ones from the garden</h2>
      <p class="lede soft">Pocket-sized watercolors of the neighbors just past the garden gate: a hedgehog carrying home lavender, a mouse off to tea, and the cottage they all visit.</p>
      <p class="cast"><span class="hand">Starring</span> Hedgehog &middot; Mrs. Mouse &middot; Ivy Cottage</p>
      <div class="btns"><a class="btn gold" href="/shop#little">Shop the little ones</a><a class="btn ghost" href="/commissions">Ask for a custom one</a></div></div>
    <div class="stage trio">${pic("mouse.jpg", "Watercolor of a mouse in a yellow dress", { sizes: "200px" })}${pic("hedgehog.jpg", "Watercolor of a hedgehog holding lavender", { sizes: "200px" })}${pic("cottage.jpg", "Watercolor of an ivy-covered cottage", { sizes: "200px" })}</div>
   </article>
  </div>
  <div class="ctrls"><div class="tabs" role="group" aria-label="Jump to slide">
    <button type="button" data-go="0" aria-current="true"><span>Christmas</span><i><b></b></i></button>
    <button type="button" data-go="1"><span>The West</span><i><b></b></i></button>
    <button type="button" data-go="2"><span>Little ones</span><i><b></b></i></button></div>
    <span class="scrollhint">Scroll</span></div>
 </div></div>
</section><div class="ledge"></div>`
  const body = `${intro}${hero}
<section class="band"><div class="wrap split">
  <div class="txt"><span class="eyebrow">Welcome to the gallery</span>
    <p class="quote">Snowy main streets, red barns, country churches, and the little creatures that live just past the garden gate, all painted by hand by Patsy Wedel.</p></div>
  <div class="txt"><p class="soft">Patsy works in watercolor, acrylic and colored pencil at an old blue desk by the window. Every original is one of a kind, and every Christmas card leaves her studio sealed and stamped by hand.</p>
    <div class="btns"><a class="btn ink" href="/shop">Browse originals</a><a class="btn ghost" href="/about">Meet Patsy</a></div></div>
</div></section>
${c.cards.length ? `<section class="band mist" id="christmas"><div class="wrap">
  <div class="head"><div><span class="eyebrow">For the season</span><h2>This year&rsquo;s Christmas cards</h2></div><p class="soft">Printed from Patsy&rsquo;s original paintings. Order by ${esc(c.deadline)} for Christmas delivery.</p></div>
  <div class="xgrid">${c.cards.map(xCard).join("")}</div>
</div></section>` : ""}
<section class="band"><div class="wrap">
  <div class="head"><div><span class="eyebrow">Originals</span><h2>From the studio wall</h2></div><a class="more" href="/shop">See all ${c.art.length} pieces &rarr;</a></div>
  <div class="grid">${featured.map(artCard).join("")}</div>
</div></section>
<section class="band teal"><div class="wrap split flip">
  <div class="mat" style="transform:rotate(1deg)">${pic("studio.jpg", "Patsy's painting desk by the window with brushes and watercolor palette", { sizes: "(max-width: 720px) 92vw, 45vw" })}</div>
  <div class="txt"><span class="eyebrow">The artist</span><h2>From the blue desk by the window</h2>
    <p class="soft">A jar of brushes, a tin of pencils, a box of Cotman watercolors and a little green toy truck that sneaks into half her photos. This is where every Little Garden Art piece begins.</p>
    <div class="btns"><a class="btn gold" href="/about">Read Patsy&rsquo;s story</a><a class="btn ghost" href="${IG}">Follow on Instagram</a></div></div>
</div></section>
<section class="band"><div class="wrap split">
  <div class="txt"><span class="eyebrow">Commissions</span><h2>Your place, painted</h2><p class="soft">The family farmhouse, a hometown church, the view from the porch. Patsy takes a small number of custom paintings each season.</p>
    <div class="btns"><a class="btn ink" href="/commissions">How commissions work</a></div></div>
  <div class="mat" style="transform:rotate(-1deg)">${pic("farmhouse.jpg", "A farmhouse and barn painted by Patsy", { sizes: "(max-width: 720px) 92vw, 45vw" })}</div>
</div></section>`
  return layout({ title: `${SITE} | Original Paintings & Christmas Cards by Patsy Wedel`, desc: "Hand-painted watercolors, acrylics and Christmas cards by artist Patricia (Patsy) Wedel. Country churches, red barns, Western landscapes and little garden creatures.", path: "/", origin: o, body, data: { cards: cardsData(c) } })
}

export function shop(c: any, o: string) {
  const cats = ["all", ...Object.keys(catName).filter(k => c.art.some((a: any) => a.c === k))]
  const body = `<section class="band"><div class="wrap">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>Originals</span></nav>
  <div class="head"><div><span class="eyebrow">The collection</span><h1>Original paintings</h1><p class="soft" style="margin-top:12px;max-width:36em">Every piece is one of a kind, painted by hand by Patsy Wedel. When an original sells, it&rsquo;s gone for good.</p></div>
  <div class="filters" id="filters" role="group" aria-label="Filter by medium">${cats.map(k => `<button type="button" data-k="${k}" aria-pressed="${k === "all"}">${k === "all" ? "All" : catName[k]}</button>`).join("")}</div></div>
  <div class="grid" id="gal">${c.art.map(artCard).join("")}</div>
</div></section>`
  return layout({ title: `Original Paintings for Sale | ${SITE}`, desc: `Shop ${c.art.length} original watercolors, acrylics and framed pieces by Patsy Wedel: Western landscapes, barns, churches, seashells and storybook animals.`, path: "/shop", origin: o, body,
    ld: [crumbs(o, [["Home", "/"], ["Originals", "/shop"]]), { "@type": "ItemList", itemListElement: c.art.map((a: any, i: number) => ({ "@type": "ListItem", position: i + 1, url: `${o}/shop/${a.id}` })) }] })
}

export function piece(c: any, a: any, o: string) {
  const more = c.art.filter((x: any) => x.id !== a.id && (x.c === a.c)).concat(c.art.filter((x: any) => x.id !== a.id && x.c !== a.c)).slice(0, 4)
  const body = `<section class="band"><div class="wrap">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/shop">Originals</a><span>/</span><span>${esc(a.t)}</span></nav>
  <div class="piece">
    <div class="wallview"><div class="mat">${pic(a.img, a.a, { eager: true, sizes: "(max-width: 960px) 92vw, 60vw" })}</div></div>
    <div class="info">
      <span class="eyebrow">${esc(catName[a.c] ?? "Original")}</span>
      <h1 style="font-size:clamp(32px,4.4vw,48px)">${esc(a.t)}</h1>
      <div class="bigprice">${a.sold ? '<span class="sold" style="font-size:22px">Sold</span>' : money(a.p)}</div>
      <p class="soft">${esc(a.story || a.m)}</p>
      <dl class="museum"><div><dt>Artist</dt><dd>${ARTIST}</dd></div><div><dt>Medium</dt><dd>${esc(a.m)}</dd></div>${a.size ? `<div><dt>Size</dt><dd>${esc(a.size)}</dd></div>` : ""}<div><dt>Edition</dt><dd>Original, one of a kind</dd></div></dl>
      <div class="btns"><button class="btn gold" type="button" data-buy>${a.sold ? "Ask about something similar" : "Buy this painting"}</button><a class="btn ghost" href="/commissions">Commission one</a></div>
      <p class="note">Orders are arranged directly with Patsy. She&rsquo;ll confirm shipping or local pickup and send a secure payment link.</p>
    </div>
  </div>
</div></section>
<section class="band mist"><div class="wrap">
  <div class="head"><h2>More from the studio</h2><a class="more" href="/shop">All originals &rarr;</a></div>
  <div class="grid">${more.map(artCard).join("")}</div>
</div></section>`
  return layout({ title: `${a.t} | Original ${catName[a.c] === "Little ones" ? "Watercolor" : (catName[a.c] ?? "Painting")} by Patsy Wedel`, desc: `${a.story || a.m}`.slice(0, 158), path: `/shop/${a.id}`, origin: o, img: a.img, type: "product", body,
    ld: [productLd(o, a), crumbs(o, [["Home", "/"], ["Originals", "/shop"], [a.t, `/shop/${a.id}`]])], data: { piece: { t: a.t, m: a.m, size: a.size, p: a.p, img: a.img, a: a.a, sold: a.sold } } })
}

export function cards(c: any, o: string) {
  const body = `<section class="band"><div class="wrap">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>Christmas cards</span></nav>
  <div class="head"><div><span class="eyebrow">For the season</span><h1>Hand-finished Christmas cards</h1></div><p class="soft">Printed from Patsy&rsquo;s original paintings, each card comes with a cream envelope, sealed in a clear sleeve and stamped by hand with the Little Garden Art seal.</p></div>
  ${c.cards.length ? `<div class="xgrid">${c.cards.map(xCard).join("")}</div>` : `<p class="soft">This year&rsquo;s cards are sold out. Follow along on Instagram for next season.</p>`}
  <div class="deadline"><span>Order by ${esc(c.deadline)} for Christmas delivery</span><span class="soft">Local pickup available</span></div>
</div></section>
<section class="band mist"><div class="wrap split">
  <div class="mat">${pic("card-warmest.jpg", "A Warmest Wishes card with its envelope, sleeve and hand-drawn Little Garden Art stamp", { sizes: "(max-width: 720px) 92vw, 45vw" })}</div>
  <div class="txt"><span class="eyebrow">The details</span><h2>Made to be kept</h2><p class="soft">Each card is printed from the original painting, then sleeved and stamped by hand on the back with Patsy&rsquo;s Little Garden Art seal. A pack makes an easy gift on its own.</p>
  <div class="btns"><a class="btn ink" href="/shop/main-street">See the original painting</a></div></div>
</div></section>`
  return layout({ title: `Hand-Painted Christmas Cards | ${SITE}`, desc: `Christmas cards printed from Patsy Wedel's original paintings: Warmest Wishes and Christmas Blessings. Singles and packs. Order by ${c.deadline}.`, path: "/christmas-cards", origin: o, img: "card-warmest.jpg", body,
    ld: [crumbs(o, [["Home", "/"], ["Christmas cards", "/christmas-cards"]]), ...c.cards.map((x: any) => ({ "@type": "Product", name: `${x.t} Christmas Cards`, image: `${o}/img/${base(x.img)}.jpg`, description: x.d, brand: { "@type": "Brand", name: SITE },
      offers: { "@type": "AggregateOffer", priceCurrency: "USD", lowPrice: String(Math.min(...x.packs.map((p: any) => p.p))), highPrice: String(Math.max(...x.packs.map((p: any) => p.p))), offerCount: x.packs.length, availability: "https://schema.org/InStock" } }))],
    data: { cards: cardsData(c) } })
}

export function about(o: string) {
  const body = `<section class="band teal"><div class="wrap split">
  <div class="txt"><span class="eyebrow">About the artist</span><h1>Patsy Wedel</h1>
    <p class="lede soft">Patricia &ldquo;Patsy&rdquo; Wedel paints the places and small moments she loves: snowy main streets, red barns in spring, a country church at Christmas, and the hedgehogs and mice of her storybook garden.</p></div>
  <div class="mat" style="transform:rotate(1deg)">${pic("studio.jpg", "Patsy's painting desk with brushes, paints and a watercolor palette", { eager: true, sizes: "(max-width: 720px) 92vw, 45vw" })}</div>
</div></section><div class="ledge"></div>
<section class="band"><div class="wrap split flip">
  <div class="mat">${pic("pronghorn.jpg", "Harrington Reservoir, an acrylic painting by Patsy", { sizes: "(max-width: 720px) 92vw, 45vw" })}</div>
  <div class="txt"><span class="eyebrow">How she works</span><h2>Watercolor, acrylic and colored pencil</h2>
    <p class="soft">Some pieces start as soft watercolor washes with fine pencil detail; others are built up in acrylic on canvas, sometimes with the scene carried right around the edges so they hang without a frame. Her colored-pencil studies, like her seashells, are worked slowly over a watercolor ground.</p>
    <p class="soft">Every Christmas card is sleeved and stamped by hand with her Little Garden Art seal before it leaves the studio.</p>
    <div class="btns"><a class="btn ink" href="/shop">See the originals</a><a class="btn ghost" href="${IG}">Instagram</a></div></div>
</div></section>`
  return layout({ title: `About Patsy Wedel, Artist | ${SITE}`, desc: "Meet Patricia (Patsy) Wedel, the artist behind Little Garden Art: watercolors, acrylics, colored pencil and hand-finished Christmas cards.", path: "/about", origin: o, img: "studio.jpg", body, ld: [crumbs(o, [["Home", "/"], ["About", "/about"]])] })
}

export function commissions(o: string) {
  const body = `<section class="band"><div class="wrap split">
  <div class="txt"><nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>Commissions</span></nav><span class="eyebrow">Custom work</span><h1>Your place, painted</h1>
    <p class="lede soft">A family farmhouse, a hometown church, a favorite view. Patsy takes a small number of commissions each season, in watercolor or acrylic.</p>
    <div class="btns"><button class="btn gold" type="button" data-ask="Hi Patsy! I'd like to ask about a custom painting.">Ask about a commission</button></div></div>
  <div class="mat" style="transform:rotate(-1deg)">${pic("farmhouse.jpg", "A farmhouse and barn painted in acrylic by Patsy", { eager: true, sizes: "(max-width: 720px) 92vw, 45vw" })}</div>
</div></section>
<section class="band mist"><div class="wrap">
  <div class="head"><h2>How it works</h2></div>
  <div class="steps">
    <div class="step"><span class="eyebrow">First</span><b>Send a photo</b><p class="soft">A clear picture of the place, plus anything that matters to you: the dog, the old truck, the season.</p></div>
    <div class="step"><span class="eyebrow">Then</span><b>Pick a size</b><p class="soft">A small watercolor for a card or gift, or a larger acrylic for the wall.</p></div>
    <div class="step"><span class="eyebrow">Finally</span><b>Patsy paints it</b><p class="soft">She&rsquo;ll confirm the price and timing before she begins.</p></div>
  </div>
</div></section>`
  return layout({ title: `Custom Painting Commissions | ${SITE}`, desc: "Commission a hand-painted watercolor or acrylic of your farmhouse, church or favorite place from artist Patsy Wedel.", path: "/commissions", origin: o, img: "farmhouse.jpg", body, ld: [crumbs(o, [["Home", "/"], ["Commissions", "/commissions"]])] })
}

export function notFound(o: string) {
  return layout({ title: `Page not found | ${SITE}`, desc: "This page wandered off.", path: "/404", origin: o, body: `<section class="band"><div class="wrap" style="text-align:center;display:grid;gap:18px;justify-items:center"><span class="eyebrow">404</span><h1>This page wandered off</h1><p class="soft">Maybe the hedgehog took it. Try the gallery instead.</p><div class="btns"><a class="btn gold" href="/shop">See the originals</a><a class="btn ghost" href="/">Home</a></div></div></section>` })
}

export function sitemap(c: any, o: string) {
  const urls = ["/", "/shop", "/christmas-cards", "/about", "/commissions", ...c.art.map((a: any) => `/shop/${a.id}`)]
  const lm = (c.updated ?? new Date().toISOString()).slice(0, 10)
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.map(u => {
    const a = c.art.find((x: any) => `/shop/${x.id}` === u)
    return `<url><loc>${esc(o + u)}</loc><lastmod>${lm}</lastmod>${a ? `<image:image><image:loc>${esc(`${o}/img/${base(a.img)}.jpg`)}</image:loc></image:image>` : ""}</url>`
  }).join("\n")}\n</urlset>`
}
