import type { Config, Context } from "@netlify/functions"
import { loadCatalog, CACHE_TAG } from "../lib/store.mts"
import { home, shop, piece, cards, about, commissions, notFound, sitemap } from "../lib/render.mts"

const publicView = (c: any) => ({ ...c, cards: c.cards.filter((x: any) => !x.hidden), art: c.art.filter((a: any) => !a.hidden) })

// Pages are cached at Netlify's edge until Patsy saves in the dashboard (which purges the tag).
const cached = (body: string, type = "text/html; charset=utf-8", status = 200) => new Response(body, {
  status,
  headers: {
    "content-type": type,
    "cache-control": "public, max-age=0, must-revalidate",
    "netlify-cdn-cache-control": "public, durable, s-maxage=31536000, stale-while-revalidate=86400",
    "netlify-cache-tag": CACHE_TAG
  }
})

export default async (req: Request, context: Context) => {
  const url = new URL(req.url)
  const o = url.origin
  const path = url.pathname.replace(/\/+$/, "") || "/"
  if (path === "/robots.txt") return cached(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: ${o}/sitemap.xml\n`, "text/plain; charset=utf-8")
  const c = publicView(await loadCatalog())
  switch (path) {
    case "/": return cached(home(c, o))
    case "/shop": return cached(shop(c, o))
    case "/christmas-cards": return cached(cards(c, o))
    case "/about": return cached(about(o))
    case "/commissions": return cached(commissions(o))
    case "/sitemap.xml": return cached(sitemap(c, o), "application/xml; charset=utf-8")
  }
  const m = path.match(/^\/shop\/([a-z0-9-]+)$/)
  const a = m && c.art.find((x: any) => x.id === m[1])
  if (a) return cached(piece(c, a, o))
  return cached(notFound(o), "text/html; charset=utf-8", 404)
}

export const config: Config = {
  path: ["/", "/shop", "/shop/*", "/christmas-cards", "/about", "/commissions", "/sitemap.xml", "/robots.txt"],
  excludedPath: ["/shop/*.*"],
  method: ["GET", "HEAD"]
}
