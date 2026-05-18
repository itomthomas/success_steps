// src/pages/api/admin/users.ts
// GET /api/admin/users
// Returns all registered users with result and reportToken status.
// Protected by the admin_session cookie.

export const prerender = false;
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies }) => {
  // Verify admin session cookie
  const session = cookies.get("admin_session")?.value;
  if (!session || session !== import.meta.env.ADMIN_PASSWORD) {
    return respond({ error: "Unauthorized" }, 401);
  }

  const GAS_URL       = import.meta.env.PSYCHO_GAS_URL;
  const ADMIN_GAS_KEY = import.meta.env.ADMIN_GAS_KEY;
  if (!GAS_URL || !ADMIN_GAS_KEY) return respond({ error: "Server misconfiguration" }, 500);

  try {
    const gasUrl = new URL(GAS_URL);
    gasUrl.searchParams.set("action",   "list_users");
    gasUrl.searchParams.set("adminKey", ADMIN_GAS_KEY);

    const res  = await fetch(gasUrl.toString());
    const text = await res.text();

    return new Response(text, {
      status:  200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("[admin/users]", err);
    return respond({ error: "Failed to fetch users" }, 500);
  }
};

function respond(body: object, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}