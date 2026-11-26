import type { Config, Context } from "@netlify/functions"
import { COOKIE, checkPassword, makeToken, cookieMaxAge, isAuthed, passwordConfigured } from "../lib/auth.mts"

export default async (req: Request, context: Context) => {
  if (req.method === "GET") {
    return Response.json({ signedIn: isAuthed(context.cookies.get(COOKIE)), ready: passwordConfigured() },
      { headers: { "cache-control": "no-store" } })
  }
  if (req.method === "DELETE") {
    context.cookies.delete({ name: COOKIE, path: "/" })
    return Response.json({ ok: true })
  }
  if (!passwordConfigured()) {
    return Response.json({ error: "The admin password hasn't been set up yet." }, { status: 503 })
  }
  let body: { password?: string } = {}
  try { body = await req.json() } catch { /* empty body */ }
  if (!checkPassword(String(body.password ?? ""))) {
    return Response.json({ error: "That password didn't match. Try again." }, { status: 401 })
  }
  context.cookies.set({
    name: COOKIE, value: makeToken(), path: "/", httpOnly: true, secure: true,
    sameSite: "Strict", maxAge: cookieMaxAge()
  })
  return Response.json({ ok: true })
}

export const config: Config = {
  path: "/api/login",
  method: ["GET", "POST", "DELETE"],
  rateLimit: { windowLimit: 10, windowSize: 60, aggregateBy: ["ip", "domain"] }
}
