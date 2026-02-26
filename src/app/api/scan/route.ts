import { NextResponse } from "next/server";
import type { ScanRequestBody } from "@/types/scan";
import { runDomainScan } from "@/lib/scan";
import { sendReportEmail } from "@/lib/email";
import { addToEmailList } from "@/lib/audience";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DOMAIN_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/;

function domainFromEmail(email: string): string | null {
  const part = email.trim().split("@")[1];
  return part ? part.toLowerCase() : null;
}

function validate(body: unknown): { email: string; domain: string; subscribe: boolean } | null {
  if (!body || typeof body !== "object") return null;
  const { email, domain, subscribe } = body as Record<string, unknown>;
  if (typeof email !== "string") return null;
  const emailTrimmed = email.trim();
  if (!EMAIL_REGEX.test(emailTrimmed)) return null;

  let d: string;
  if (typeof domain === "string" && domain.trim()) {
    d = domain.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
    if (!DOMAIN_REGEX.test(d)) return null;
  } else {
    const fromEmail = domainFromEmail(emailTrimmed);
    if (!fromEmail || !DOMAIN_REGEX.test(fromEmail)) return null;
    d = fromEmail;
  }

  return {
    email: emailTrimmed,
    domain: d,
    subscribe: subscribe === true,
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = validate(body);
  if (!parsed) {
    return NextResponse.json(
      { error: "Invalid email or domain" },
      { status: 400 }
    );
  }

  const { email, domain, subscribe } = parsed;

  try {
    const result = await runDomainScan(domain);
    const [emailResult, listResult] = await Promise.all([
      sendReportEmail(email, result),
      subscribe ? addToEmailList(email) : Promise.resolve({ ok: true }),
    ]);
    return NextResponse.json({
      ...result,
      emailSent: emailResult.ok,
      emailError: emailResult.error ?? undefined,
      listAdded: subscribe ? listResult.ok : undefined,
      listError: subscribe && !listResult.ok ? listResult.error : undefined,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Scan failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
