export const prerender = false;

export async function POST({ request }) {
  const token = request.headers.get("x-assessment-token");
  if (!token)
    return new Response(JSON.stringify({ error: "Astro: Missing token" }), { status: 401 });

  const body = await request.json();
  const { test_ids } = body;

  if (!test_ids || !test_ids.length)
    return new Response(JSON.stringify({ error: "Astro: Missing test_ids" }), { status: 400 });

  const gasUrl = `${import.meta.env.PSYCHO_GAS_URL}/exec`;

  // Fire-and-forget to GAS — don't block the response
  fetch(gasUrl, {
    method: "POST",
    redirect: "follow",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "compute_scores", token, test_ids })
  }).catch(err => console.error("Scoring trigger failed:", err));

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}