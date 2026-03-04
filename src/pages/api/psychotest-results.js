export const prerender = false;

export async function GET({ request }) {
  const token = request.headers.get("x-assessment-token");
  if (!token)
    return new Response(JSON.stringify({ error: "Missing token" }), { status: 401 });

  const gasUrl = `${import.meta.env.PUBLIC_GS_API}/exec?action=get_results&token=${encodeURIComponent(token)}`;
  const res  = await fetch(gasUrl);
  const text = await res.text();

  return new Response(text, { headers: { "Content-Type": "application/json" } });
}