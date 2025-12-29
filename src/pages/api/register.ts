export const prerender = false;
import type { APIRoute } from "astro";

const TOKEN_SUFFIX = "SS_ASTRO";
const MAX_TOKEN_AGE_MS = 5 * 60 * 1000; // 5 minutes

export const POST: APIRoute = async ({ request }) => {
  try {
    /* ---------------------------------
     * 1. Header validation
     * --------------------------------- */
    const client = request.headers.get("X-Client");
    if (client !== "success-steps-astro") {
      return reject(403, "Invalid client");
    }

    /* ---------------------------------
     * 2. Parse body
     * --------------------------------- */
    const body = await request.json();

    const {
      name,
      mobile,
      email,
      address,
      userType,
      age,
      company,       // honeypot
      securityToken
    } = body;

    /* ---------------------------------
     * 3. Honeypot check
     * --------------------------------- */
    if (company && company.trim() !== "") {
      return reject(400, "Bot detected");
    }

    /* ---------------------------------
     * 4. Token validation
     * --------------------------------- */
    if (!securityToken) {
      return reject(400, "Missing security token");
    }

    let decoded: string;
    try {
      decoded = Buffer.from(securityToken, "base64").toString("utf-8");
    } catch {
      return reject(400, "Invalid token encoding");
    }

    const [timestampStr, suffix] = decoded.split(".");
    const timestamp = Number(timestampStr);

    if (suffix !== TOKEN_SUFFIX || isNaN(timestamp)) {
      return reject(400, "Invalid token format");
    }

    if (Date.now() - timestamp > MAX_TOKEN_AGE_MS) {
      return reject(401, "Token expired");
    }

    /* ---------------------------------
     * 5. Field validation
     * --------------------------------- */
    if (!name || !mobile || !email || !userType || !age) {
      return reject(400, "Missing required fields");
    }

    /* ---------------------------------
     * 6. Generate registration ID
     * --------------------------------- */
    const regId = crypto.randomUUID();

    /* ---------------------------------
     * 7. Send to Google Apps Script
     * --------------------------------- */
    const GAS_URL = import.meta.env.USR_REGISTER_GS_API;

    const gasRes = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        regId,
        name,
        mobile,
        email,
        address,
        userType,
        age,
        createdAt: new Date().toISOString()
      })
    });

    if (!gasRes.ok) {
      return reject(502, "Failed to store registration");
    }

    /* ---------------------------------
     * 8. Success
     * --------------------------------- */
    return json({ success: true, regId });

  } catch (err) {
    return reject(500, "Server error");
  }
};

/* ---------------------------------
 * Helpers
 * --------------------------------- */
function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

function reject(status: number, message: string) {
  return json({ error: message }, status);
}
