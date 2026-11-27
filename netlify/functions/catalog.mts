import type { Config, Context } from "@netlify/functions"
import { purgeCache } from "@netlify/functions"
import { COOKIE, isAuthed } from "../lib/auth.mts"
import { loadCatalog, store, KEY, CACHE_TAG } from "../lib/store.mts"

const CATS = ["acrylic", "watercolor", "framed", "little"]


const str = (v: unknown, max: number) => String(v ?? "").slice(0, max).trim()
const money = (v: unknown) => {
  const n = Math.round(Number(v) * 100) / 100
  return Number.isFinite(n) && n >= 0 && n <= 100000 ? n : null
}

// Accept only the fields the dashboard edits; anything else comes from the saved copy.
function clean(input: any, base: any) {
  if (!input || !Array.isArray(input.cards) || !Array.isArray(input.art)) throw new Error("Bad data")
  const out = structuredClone(base)
  out.deadline = str(input.deadline, 40) || base.deadline
  out.cards = base.cards.map((c: any) => {
    const n = input.cards.find((x: any) => x?.id === c.id) ?? c
    return {
      ...c,
      t: str(n.t, 80) || c.t,
      d: str(n.d, 400),
      inside: str(n.inside, 80),
      hidden: !!n.hidden,
      packs: c.packs.map((p: any, i: number) => {
        const np = Array.isArray(n.packs) ? n.packs[i] : null
        const price = money(np?.p)
        return { l: str(np?.l, 30) || p.l, p: price ?? p.p }
      })
    }
  })
  out.art = base.art.map((a: any) => {
    const n = input.art.find((x: any) => x?.id === a.id) ?? a
    const price = money(n.p)
    return {
      ...a,
      t: str(n.t, 80) || a.t,
      m: str(n.m, 120),
      story: str(n.story, 1200),
      size: str(n.size, 40),
      c: CATS.includes(n.c) ? n.c : a.c,
      p: price ?? a.p,
      sold: !!n.sold,
      hidden: !!n.hidden
    }
  })
  out.updated = new Date().toISOString()
  return out
}

const load = loadCatalog

export default async (req: Request, context: Context) => {
  if (req.method === "GET") {
    const data = await load()
    const admin = new URL(req.url).searchParams.has("admin") && isAuthed(context.cookies.get(COOKIE))
    if (!admin) {
      // public view: drop hidden items
      const pub = { ...data, cards: data.cards.filter((c: any) => !c.hidden), art: data.art.filter((a: any) => !a.hidden) }
      return Response.json(pub, { headers: { "cache-control": "public, max-age=0, must-revalidate" } })
    }
    return Response.json(data, { headers: { "cache-control": "no-store" } })
  }

  if (!isAuthed(context.cookies.get(COOKIE))) {
    return Response.json({ error: "Please sign in again." }, { status: 401 })
  }
  try {
    const next = clean(await req.json(), await load())
    await store().setJSON(KEY, next)
    // refresh every cached page so new prices show right away
    try { await purgeCache({ tags: [CACHE_TAG] }) } catch (e) { console.error("purge failed", e) }
    return Response.json(next, { headers: { "cache-control": "no-store" } })
  } catch (e) {
    console.error("catalog save failed", e)
    return Response.json({ error: "Couldn't save. Nothing was changed." }, { status: 400 })
  }
}

export const config: Config = { path: "/api/catalog", method: ["GET", "PUT"] }
