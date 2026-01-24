export const prerender = false;

export async function GET({ request }) {
  const token = request.headers.get("x-assessment-token");
  if (!token) return new Response("Astro: Missing token", { status: 401 });

  const GAS = import.meta.env.PUBLIC_GS_API;
  const res = await fetch(`${GAS}/exec?action=bundle&token=${token}`);
  return new Response(await res.text(), {
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