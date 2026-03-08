export const prerender = false;  // optional, this (false) is the default in Astro v5+ , this makes it a serverless function

export async function GET({ request }) {
  const token = request.headers.get("x-assessment-token");
  if (!token) return new Response("Astro: Missing token", { status: 401 });

  const GAS = import.meta.env.PSYCHO_GAS_URL;
  try {
    const res = await fetch(`${GAS}/exec?action=bundle&token=${token}`);
    if (!res.ok) {
      return new Response(`Upstream error: ${res.status} ${res.statusText}`, {
        status: res.status,
      });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response("Astro: Internal error", { status: 500 });
  }
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