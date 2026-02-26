"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const DNS_PROVIDERS = [
  { name: "Cloudflare", help: "https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/" },
  { name: "GoDaddy", help: "https://www.godaddy.com/help/add-a-txt-record-19232" },
  { name: "Namecheap", help: "https://www.namecheap.com/support/knowledgebase/article.aspx/317/2237/how-do-i-add-txt-spf-dkim-and-dmarc-records-for-my-domain/" },
  { name: "Google Domains", help: "https://support.google.com/a/answer/2716800" },
];

const DKIM_PROVIDERS = [
  { name: "Gmail / Google Workspace", url: "https://support.google.com/a/answer/174124" },
  { name: "Microsoft 365 / Outlook", url: "https://learn.microsoft.com/en-us/microsoft-365/security/office-365-security/email-authentication-dkim-configure" },
  { name: "Zoho Mail", url: "https://www.zoho.com/mail/help/adminconsole/dkim-configuration.html" },
];

function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button type="button" onClick={copy} className="text-sm font-medium text-accent hover:underline">
      {copied ? "Copied!" : label}
    </button>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const styles = {
    Low: "bg-risk-low/15 text-risk-low border-risk-low/30",
    Medium: "bg-risk-medium/15 text-risk-medium border-risk-medium/30",
    High: "bg-risk-high/15 text-risk-high border-risk-high/30",
  };
  const s = styles[risk as keyof typeof styles] ?? styles.Medium;
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${s}`}>
      {risk} risk
    </span>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const score = searchParams.get("score") ?? "0";
  const risk = searchParams.get("risk") ?? "Medium";
  const domain = searchParams.get("domain") ?? "";
  const issues = (searchParams.get("issues") ?? "").split("|").filter(Boolean);
  const fixes = (searchParams.get("fixes") ?? "").split("|").filter(Boolean);
  const missing = (searchParams.get("missing") ?? "").split(",").filter(Boolean) as ("spf" | "dkim" | "dmarc")[];

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-neutral-200/80 bg-neutral-50/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-5 flex items-center justify-between">
          <Link href="/" className="text-lg font-display font-semibold tracking-tight text-neutral-900">
            Postman
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/blog" className="text-sm text-neutral-600 hover:text-neutral-900">
              Blog
            </Link>
            <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
              Check another
            </Link>
          </nav>
        </div>
      </header>

      <section className="flex-1 px-6 sm:px-8 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto">
          {domain && (
            <p className="text-neutral-500 text-sm mb-2">Report for</p>
          )}
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-neutral-900 mb-10">
            {domain || "Your domain"}
          </h1>

          <div className="mb-14">
            <p className="text-sm font-medium text-neutral-600 mb-2">Spam score</p>
            <div
              className="text-6xl sm:text-7xl font-bold tracking-tight text-neutral-900 tabular-nums"
              style={{ fontFeatureSettings: '"tnum"' }}
            >
              {score}
              <span className="text-3xl sm:text-4xl font-normal text-neutral-400">/100</span>
            </div>
            <div className="mt-4">
              <RiskBadge risk={risk} />
            </div>
            <div className="mt-10 w-36 h-28 relative">
              <Image
                src="/postman/Artboard 1.png"
                alt=""
                fill
                className="object-contain object-center"
                sizes="144px"
              />
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-3">
                Issues found
              </h2>
              <ul className="space-y-2">
                {issues.length > 0 ? (
                  issues.map((issue, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-neutral-700"
                    >
                      <span className="text-neutral-400 mt-0.5">—</span>
                      <span>{issue}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-neutral-500">No issues reported.</li>
                )}
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-3">
                Recommended fixes
              </h2>
              <ul className="space-y-2">
                {fixes.length > 0 ? (
                  fixes.map((fix, i) => (
                    <li key={i} className="flex gap-3 text-neutral-700">
                      <span className="text-accent mt-0.5 font-medium">→</span>
                      <span>{fix}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-neutral-500">No fixes needed.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Fix your domain: copyable records and provider links (no extra step) */}
          {missing.length > 0 && domain && (
            <div className="mt-14 pt-10 border-t border-neutral-200">
              <h2 className="font-display text-xl font-semibold text-neutral-900 mb-2">
                Fix your domain
              </h2>
              <p className="text-sm text-neutral-600 mb-8">Add these records for <strong>{domain}</strong></p>
              <div className="space-y-8">
                {missing.includes("spf") && (
                  <div className="border border-neutral-200 rounded-lg p-6 bg-white">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-1">1. SPF record</h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      Tells inboxes which servers are allowed to send email for your domain.
                    </p>
                    <div className="bg-neutral-100 rounded-md p-4 font-mono text-sm break-all">
                      <div className="text-neutral-500 text-xs mb-1">Type: TXT · Name: @ (or your domain)</div>
                      <div className="text-neutral-900">v=spf1 include:_spf.google.com ~all</div>
                      <div className="mt-2"><CopyButton value="v=spf1 include:_spf.google.com ~all" /></div>
                    </div>
                    <p className="text-xs text-neutral-500 mt-3">
                      If you don’t use Google, replace <code className="bg-neutral-100 px-1">_spf.google.com</code> with your provider’s include.
                    </p>
                    <div className="mt-4 pt-4 border-t border-neutral-200">
                      <p className="text-xs font-medium text-neutral-700 mb-2">Add this in your DNS:</p>
                      <div className="flex flex-wrap gap-2">
                        {DNS_PROVIDERS.map((p) => (
                          <a key={p.name} href={p.help} target="_blank" rel="noopener noreferrer" className="text-sm px-3 py-1.5 border border-neutral-300 rounded-md hover:bg-neutral-100">
                            {p.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {missing.includes("dkim") && (
                  <div className="border border-neutral-200 rounded-lg p-6 bg-white">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-1">2. DKIM record</h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      A key from your email provider that lets inboxes verify mail is really from you.
                    </p>
                    <div className="bg-neutral-100 rounded-md p-4">
                      <p className="text-sm text-neutral-700 mb-3">
                        Turn on DKIM in your email provider’s admin panel, then add the <strong>TXT record</strong> they give you (e.g. <code className="bg-neutral-200 px-1">default._domainkey</code>).
                      </p>
                      <p className="text-xs font-medium text-neutral-700 mb-2">Where to get your DKIM key:</p>
                      <div className="flex flex-wrap gap-2">
                        {DKIM_PROVIDERS.map((p) => (
                          <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="text-sm px-3 py-1.5 border border-neutral-300 rounded-md hover:bg-neutral-100">
                            {p.name}
                          </a>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-neutral-200">
                      <p className="text-xs font-medium text-neutral-700 mb-2">Where to add the record:</p>
                      <div className="flex flex-wrap gap-2">
                        {DNS_PROVIDERS.map((p) => (
                          <a key={p.name} href={p.help} target="_blank" rel="noopener noreferrer" className="text-sm px-3 py-1.5 border border-neutral-300 rounded-md hover:bg-neutral-100">
                            {p.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {missing.includes("dmarc") && (
                  <div className="border border-neutral-200 rounded-lg p-6 bg-white">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-1">3. DMARC record</h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      Tells inboxes what to do with mail that fails SPF or DKIM. <code className="bg-neutral-100 px-1">p=none</code> means “monitor only” to start.
                    </p>
                    <div className="bg-neutral-100 rounded-md p-4 font-mono text-sm break-all">
                      <div className="text-neutral-500 text-xs mb-1">Type: TXT · Name: _dmarc</div>
                      <div className="text-neutral-900">{`v=DMARC1; p=none; rua=mailto:admin@${domain}`}</div>
                      <div className="mt-2"><CopyButton value={`v=DMARC1; p=none; rua=mailto:admin@${domain}`} /></div>
                    </div>
                    <p className="text-xs text-neutral-500 mt-3">
                      Change <code className="bg-neutral-100 px-1">admin@{domain}</code> to an email where you want reports.
                    </p>
                    <div className="mt-4 pt-4 border-t border-neutral-200">
                      <p className="text-xs font-medium text-neutral-700 mb-2">Add this in your DNS:</p>
                      <div className="flex flex-wrap gap-2">
                        {DNS_PROVIDERS.map((p) => (
                          <a key={p.name} href={p.help} target="_blank" rel="noopener noreferrer" className="text-sm px-3 py-1.5 border border-neutral-300 rounded-md hover:bg-neutral-100">
                            {p.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-neutral-500 mt-6">
                After adding records, wait a few minutes (up to 48 hours in rare cases), then run a new scan to confirm.
              </p>
            </div>
          )}

          <div className="mt-14 pt-10 border-t border-neutral-200">
            <Link
              href="/"
              className="inline-flex items-center justify-center py-3 px-6 border border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-colors"
            >
              Check another
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-neutral-200/80 py-6">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center text-sm text-neutral-500">
          Postman — instant spam risk check for your domain.
        </div>
      </footer>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p className="text-neutral-500">Loading report…</p>
      </main>
    }>
      <ResultsContent />
    </Suspense>
  );
}
