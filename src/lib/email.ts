import { Resend } from "resend";
import type { ScanResult } from "@/types/scan";

const FROM = "Postman <onboarding@resend.dev>";

function formatReport(result: ScanResult): string {
  const lines = [
    "POSTMAN — Your Domain Spam Risk Report",
    "────────────────────────────────────",
    "",
    `Domain: ${result.domain}`,
    `Spam Score: ${result.score}/100`,
    `Risk Level: ${result.riskLevel}`,
    "",
    "Issues found:",
    ...result.issues.map((i) => `  • ${i}`),
    "",
    "Recommended fixes:",
    ...result.fixes.map((f) => `  • ${f}`),
    "",
    "────────────────────────────────────",
    "Postman — Instant spam risk check for your domain.",
  ];
  return lines.join("\n");
}

export async function sendReportEmail(to: string, result: ScanResult): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY is not set" };
  }

  const resend = new Resend(apiKey);
  const body = formatReport(result);

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: [to],
      subject: "Postman: Your Domain Spam Risk Report",
      text: body,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to send email";
    return { ok: false, error: message };
  }
}
