import { getStore } from "@netlify/blobs"
import { DEFAULT_CATALOG } from "./catalog-default.mts"

export const STORE = "littlegardenart"
export const KEY = "catalog"
export const CACHE_TAG = "lga-pages"
export const store = () => getStore({ name: STORE, consistency: "strong" })

// Saved catalog, with any field it lacks filled from the defaults (so new
// fields like `story` appear even on catalogs saved before they existed).
export async function loadCatalog(): Promise<any> {
  const saved: any = await store().get(KEY, { type: "json" })
  if (!saved) return structuredClone(DEFAULT_CATALOG)
  const byId = (list: any[], id: string) => list.find((x: any) => x.id === id) ?? {}
  return {
    ...DEFAULT_CATALOG, ...saved,
    cards: DEFAULT_CATALOG.cards.map((d: any) => ({ ...d, ...byId(saved.cards ?? [], d.id) })),
    art: DEFAULT_CATALOG.art.map((d: any) => ({ ...d, ...byId(saved.art ?? [], d.id) }))
  }
}
