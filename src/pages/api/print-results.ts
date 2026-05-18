// src/pages/api/print-results.ts
// GET /api/print-results?rt=rt_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//
// Proxies the permanent reportToken to GAS and returns
// { profile, results } for the print page to render.
// No session or auth required — the token IS the credential.

export const prerender = false;
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ url }) => {
  const reportToken = url.searchParams.get("rt");

  if (!reportToken || !reportToken.startsWith("rt_")) {
    return respond({ error: "Missing or invalid report token" }, 400);
  }

  const GAS_URL = import.meta.env.PSYCHO_GAS_URL;
  if (!GAS_URL) return respond({ error: "Server misconfiguration" }, 500);

  try {
    const gasUrl = new URL(GAS_URL);
    gasUrl.searchParams.set("action",      "get_results_by_token");
    gasUrl.searchParams.set("reportToken", reportToken);

    const res  = await fetch(gasUrl.toString());
    const text = await res.text();

    let parsed: any;
    try { parsed = JSON.parse(text); } catch { parsed = null; }

    if (parsed?.error) {
      // Surface GAS errors with appropriate HTTP status codes
      const status = parsed.error.includes("not found") ? 404
                   : parsed.error.includes("column missing") ? 500
                   : 400;
      return respond({ error: parsed.error }, status);
    }

    return new Response(text, {
      status:  200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("[print-results]", err);
    return respond({ error: "Failed to fetch results from backend" }, 500);
  }
};

function respond(body: object, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}