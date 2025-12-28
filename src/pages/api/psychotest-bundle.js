export const prerender = false;

export async function GET({ url }) {
  const testId = url.searchParams.get("test_id");

  if (!testId) {
    return new Response(
      JSON.stringify({ error: "Missing test_id" }),
      { status: 400 }
    );
  }

  const res = await fetch(
    `https://script.google.com/macros/s/AKfycbwfmH8mj3I2b5nrA6HnUp3XJO5mAcqHrXMWxiE_5EZj7ZF1-kpWSVbujJ7EhkFMUB36/exec?action=test_bundle&test_id=${testId}`
  );

  const data = await res.text();

  return new Response(data, {
    headers: { "Content-Type": "application/json" }
  });
}

