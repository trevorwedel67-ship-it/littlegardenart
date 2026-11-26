import { createHmac, timingSafeEqual, createHash } from "node:crypto"

export const COOKIE = "lga_admin"
const DAYS = 30

function key(): string | null {
  const pw = Netlify.env.get("ADMIN_PASSWORD")
  return pw && pw.length >= 8 ? pw : null
}

function sign(payload: string, k: string) {
  return createHmac("sha256", k).update(payload).digest("base64url")
}

function same(a: string, b: string) {
  // hash first so lengths always match for timingSafeEqual
  const ha = createHash("sha256").update(a).digest()
  const hb = createHash("sha256").update(b).digest()
  return timingSafeEqual(ha, hb)
}

export function passwordConfigured() {
  return key() !== null
}

export function checkPassword(input: string) {
  const k = key()
  return !!k && typeof input === "string" && same(input, k)
}

export function makeToken() {
  const k = key()!
  const exp = String(Date.now() + DAYS * 86400000)
  return `${exp}.${sign(exp, k)}`
}

export function cookieMaxAge() {
  return DAYS * 86400
}

export function isAuthed(token: string | undefined | null) {
  const k = key()
  if (!k || !token) return false
  const [exp, sig] = token.split(".")
  if (!exp || !sig || !/^\d+$/.test(exp)) return false
  if (Number(exp) < Date.now()) return false
  return same(sig, sign(exp, k))
}
