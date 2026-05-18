// src/pages/api/admin/login.ts
// POST { password: "..." }
// Sets an httpOnly admin_session cookie valid for 8 hours.

export const prerender = false;
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies }) => {
  let body: any;
  try   { body = await request.json(); }
  catch { return respond({ error: "Invalid JSON" }, 400); }

  const { password } = body;
  const expected     = import.meta.env.ADMIN_PASSWORD;

  if (!expected || password !== expected) {
    return respond({ error: "Incorrect password" }, 401);
  }

  cookies.set("admin_session", expected, {
    httpOnly: true,
    sameSite: "strict",
    secure:   import.meta.env.PROD,   // true in production, false in dev
    maxAge:   60 * 60 * 8,            // 8 hours
    path:     "/"
  });

  return respond({ success: true }, 200);
};

function respond(body: object, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}