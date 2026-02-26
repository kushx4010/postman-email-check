import type { ScanResult, RiskLevel } from "@/types/scan";
import { promises as dns } from "dns";

const SCORE = {
  NO_SPF: 25,
  NO_DKIM: 25,
  NO_DMARC: 20,
  BLACKLIST: 40,
} as const;

function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return "Low";
  if (score >= 50) return "Medium";
  return "High";
}

async function hasSPF(domain: string): Promise<boolean> {
  try {
    const records = await dns.resolveTxt(domain);
    return records.some((r) => r.join("").toLowerCase().includes("v=spf1"));
  } catch {
    return false;
  }
}

async function hasDKIM(domain: string): Promise<boolean> {
  const selectors = ["default", "dkim", "selector1", "google", "mail"];
  for (const sel of selectors) {
    try {
      const name = `${sel}._domainkey.${domain}`;
      await dns.resolveTxt(name);
      return true;
    } catch {
      continue;
    }
  }
  return false;
}

async function hasDMARC(domain: string): Promise<boolean> {
  try {
    const records = await dns.resolveTxt(`_dmarc.${domain}`);
    return records.some((r) => r.join("").toLowerCase().includes("v=dmarc1"));
  } catch {
    return false;
  }
}

async function isBlacklisted(_domain: string): Promise<boolean> {
  // Optional for MVP: could call zen.spamhaus.org or similar
  return false;
}

export async function runDomainScan(domain: string): Promise<ScanResult> {
  const issues: string[] = [];
  const fixes: string[] = [];
  const missing: ScanResult["missing"] = [];
  let score = 100;

  const [spf, dkim, dmarc, blacklisted] = await Promise.all([
    hasSPF(domain),
    hasDKIM(domain),
    hasDMARC(domain),
    isBlacklisted(domain),
  ]);

  if (!spf) {
    missing.push("spf");
    score -= SCORE.NO_SPF;
    issues.push("Your domain doesn’t tell inboxes which servers are allowed to send email for you, so your messages are less likely to be trusted.");
    fixes.push("Add a simple DNS setting (called an SPF record) that lists who can send email for your domain. Your email or hosting provider can give you the exact line to add.");
  }
  if (!dkim) {
    missing.push("dkim");
    score -= SCORE.NO_DKIM;
    issues.push("Inboxes can’t verify that your emails really come from you, so they’re more likely to treat them as suspicious or spam.");
    fixes.push("Turn on DKIM in your email provider’s settings (e.g. Gmail, Outlook, your host). They’ll give you a short “key” to add in your DNS—this lets inboxes confirm the mail is really from you.");
  }
  if (!dmarc) {
    missing.push("dmarc");
    score -= SCORE.NO_DMARC;
    issues.push("You haven’t told inboxes what to do when an email fails checks (e.g. reject or quarantine), so spoofing and mistrust are more likely.");
    fixes.push("Add a DMARC record in your DNS. It’s one line of text that says how inboxes should handle mail that doesn’t pass the other checks. Your provider or a DMARC guide can give you the exact text.");
  }
  if (blacklisted) {
    score -= SCORE.BLACKLIST;
    issues.push("Your domain may be on a blocklist, so some inboxes will reject or filter your mail.");
    fixes.push("Find out which list you’re on, fix the cause (e.g. spam or abuse), then request removal from that list’s website.");
  }

  if (issues.length === 0) {
    issues.push("No critical issues detected.");
    fixes.push("Keep your DNS email settings up to date when you add or change email services.");
  }

  const riskLevel = getRiskLevel(score);

  return {
    score: Math.max(0, score),
    riskLevel,
    issues,
    fixes,
    domain,
    missing,
  };
}
