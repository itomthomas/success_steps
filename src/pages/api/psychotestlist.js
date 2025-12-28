export async function GET() {
  const res = await fetch(
    "https://script.google.com/macros/s/AKfycbxODy-v_PBY3S0Au9ibTFY8bwy2MEqnnDuqR47csGj7Nxy6u6TrAkohEJXGIQTRJjOG/exec?action=tests"
  );

  const data = await res.text();

  return new Response(data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
