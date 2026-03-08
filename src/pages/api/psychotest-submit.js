export const prerender = false;

export async function POST({ request }) {
  const token = request.headers.get("x-assessment-token");
  if (!token) {
    return new Response(JSON.stringify({ error: "Astro: Missing token" }), { status: 401 });
  }

  const body = await request.json();
  const { test_ids, answers } = body;

  if (!test_ids || !test_ids.length || !answers) {
    return new Response(JSON.stringify({ error: "Astro:Invalid answer payload" }), { status: 400 });
  }

  const PSYCHO_GAS_URL = import.meta.env.PSYCHO_GAS_URL;
// Not passing test_id to GAS
  const submitRes = await fetch(`${PSYCHO_GAS_URL}/exec`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "submit_test",
      token,
      answers
    })
  });
  console.log("Submit response status:", submitRes.status);
  const submitData = await submitRes.json();

   // ✅ Explicitly check GAS-level success, not just HTTP status
  if (!submitData.success) {
    return new Response(
      JSON.stringify({ error: submitData.error || "Submit failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
