import { Resend } from "resend";

/**
 * Add a contact to the Postman email list (Resend Audience).
 * If RESEND_AUDIENCE_ID is not set, does nothing and returns { ok: true } so the scan still succeeds.
 */
export async function addToEmailList(email: string): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    return { ok: true }; // Skip without failing the request
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.contacts.create({
      audienceId,
      email,
      unsubscribed: false,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to add to list";
    return { ok: false, error: message };
  }
}
