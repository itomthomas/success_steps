export const prerender = false;

// Browser -> Astro, receive the api call
export async function GET({ request }) {
  
  const token = request.headers.get("x-assessment-token");
  if (!token) {
    //console.log("All headers:", Object.fromEntries(request.headers)); // Debug
    return new Response(
      JSON.stringify({ error: "Astro: Missing token" }),
      { status: 401 }
    );
  }

  const PSYCHO_GAS_URL = import.meta.env.PSYCHO_GAS_URL;
  // Pass the token to the GAS backend in the query parameters, as custom header is inconsistent (GAS issue)
  const gasurl = new URL(`${PSYCHO_GAS_URL}/exec`);
  gasurl.searchParams.set("action", "tests");
  gasurl.searchParams.set("token", token);

  const res = await fetch(gasurl.toString());
  const data = await res.text();

  return new Response(data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
