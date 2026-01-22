export const prerender = false;

export async function GET({ request, url }) {
  const testId = url.searchParams.get("test_id");

  if (!testId) {
    return new Response(
      JSON.stringify({ error: "Astro: Missing test_id" }),
      { status: 400 }
    );
  }
  const token = request.headers.get("x-assessment-token");
  if (!token) {
    //console.log("All headers:", Object.fromEntries(request.headers)); // Debug
    return new Response(
      JSON.stringify({ error: "Astro: Missing token" }),
      { status: 401 }
    );
  }

  const PSYCHO_GAS_URL = import.meta.env.PUBLIC_GS_API;

  // Pass the token to the GAS backend in the query parameters, as custom header is inconsistent (GAS issue)
  const gasurl = new URL(`${PSYCHO_GAS_URL}/exec`);
  gasurl.searchParams.set("action", "test_bundle");
  gasurl.searchParams.set("test_id", testId);
  gasurl.searchParams.set("token", token);

  const res = await fetch(gasurl.toString());

  const data = await res.text();

  return new Response(data, {
    headers: { "Content-Type": "application/json" }
  });
}

/*
Email → GAS (token in URL)
      ↓
SessionStorage (browser)
      ↓
Browser → Astro (token in header)
      ↓
Astro → GAS (token in query param)
*/