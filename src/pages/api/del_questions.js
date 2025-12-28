export const prerender = false;

export async function GET({ url }) {
  console.log(url);
  const testId = url.searchParams.get("test_id");
  console.log(testId);

  if (!testId) {
    return new Response(
      JSON.stringify({ error: "Missing test_id" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  const gasUrl =
    "https://script.google.com/macros/s/AKfycbxODy-v_PBY3S0Au9ibTFY8bwy2MEqnnDuqR47csGj7Nxy6u6TrAkohEJXGIQTRJjOG/exec" +
    `?action=questions&test_id=${encodeURIComponent(testId)}`;

  const res = await fetch(gasUrl);
  const data = await res.text();

  return new Response(data, {
    headers: { "Content-Type": "application/json" }
  });
}
