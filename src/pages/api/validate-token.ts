export const prerender = false;

import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const { token } = await request.json();
  if (!token) return reject("missing");
        console.log("/api/validate-token.ts:", token);
  const GAS_URL = import.meta.env.USR_REGISTER_GS_API;
  // Fetch from Google Sheet (via GAS endpoint)
  const res = await fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "validateToken", token })
  });

  const result = await res.json();
    console.log("/validate-token.ts:", result);

  if (!result.valid) {
    return reject(result.reason);
  }

  return json({ success: true });
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

function reject(reason: string) {
  return json({ reason }, 401);
}
