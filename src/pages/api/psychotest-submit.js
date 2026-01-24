export const prerender = false;

export async function POST({ request }) {
  const token = request.headers.get("x-assessment-token");
  if (!token) {
    return new Response(JSON.stringify({ error: "Astro: Missing token" }), { status: 401 });
  }

  const body = await request.json();
  const { test_id, answers } = body;

  if (!test_id || !answers) {
    return new Response(JSON.stringify({ error: "Astro:Invalid answer payload" }), { status: 400 });
  }

  const PSYCHO_GAS_URL = import.meta.env.PUBLIC_GS_API;
// Not passing test_id to GAS
  const res = await fetch(`${PSYCHO_GAS_URL}/exec`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "submit_test",
      token,
      answers
    })
  });

  const data = await res.text();

  return new Response(data, {
    headers: { "Content-Type": "application/json" }
  });
}