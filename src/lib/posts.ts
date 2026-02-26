export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  body: string;
};

export const posts: Post[] = [
  {
    slug: "what-is-spf-dkim-dmarc",
    title: "What Are SPF, DKIM, and DMARC? A Simple Guide",
    description: "Learn how these three DNS records protect your domain and help your emails land in the inbox instead of spam.",
    date: "2025-02-20",
    body: `
<p>If you send email from your own domain—whether for business, newsletters, or transactional messages—you’ve probably heard of SPF, DKIM, and DMARC. They’re the three main ways inbox providers check that your messages are legitimate. Here’s what each one does in plain terms.</p>

<h2>SPF (Sender Policy Framework)</h2>
<p>SPF is a DNS record that says which mail servers are allowed to send email for your domain. When someone receives a message from you@yourdomain.com, their mail server can look up your domain’s SPF record and check: “Is this email coming from a server that the domain owner approved?” If the sending server isn’t on the list, the message is more likely to be marked as suspicious or spam.</p>
<p>Your SPF record is a single line of text (a TXT record) that usually includes things like <code>include:_spf.google.com</code> if you use Gmail/Google Workspace, or similar entries for other providers. One domain can only have one SPF record, so if you use multiple services (e.g. Google and SendGrid), you need to include them all in that one record.</p>

<h2>DKIM (DomainKeys Identified Mail)</h2>
<p>DKIM adds a digital signature to your emails. Your mail server signs each message with a private key, and the receiving server checks the signature using a public key that you publish in DNS. If the signature matches, the receiver knows the message wasn’t altered in transit and that it really came from your domain.</p>
<p>Unlike SPF, DKIM doesn’t say who can send—it proves that a specific message was authorized by the domain. That’s why many providers recommend having both SPF and DKIM. You get your DKIM “key” (the TXT record value) from your email or hosting provider; they’ll tell you the exact name (e.g. <code>default._domainkey.yourdomain.com</code>) and value to add in your DNS.</p>

<h2>DMARC (Domain-based Message Authentication, Reporting & Conformance)</h2>
<p>DMARC is a policy record that tells receiving servers what to do when a message fails SPF or DKIM checks. You publish a DMARC record at <code>_dmarc.yourdomain.com</code> with a policy: for example, <code>p=none</code> (monitor only), <code>p=quarantine</code> (send to spam), or <code>p=reject</code> (reject the message). You can also specify an address to receive reports about failed messages, which helps you spot spoofing or misconfigurations.</p>
<p>Starting with <code>p=none</code> is a safe way to see how your domain is doing without affecting delivery. Once you’re confident your legitimate mail is correctly signed and aligned, you can tighten the policy to protect your domain and your recipients.</p>

<h2>Why They Matter Together</h2>
<p>SPF, DKIM, and DMARC work together: SPF and DKIM prove that your mail is legitimate, and DMARC tells the world what to do when something doesn’t match. Missing or weak records make it easier for your mail to be filtered or for others to impersonate your domain. Checking your domain’s records—and fixing any gaps—is one of the best steps you can take for better deliverability and trust.</p>
`,
  },
  {
    slug: "why-emails-go-to-spam",
    title: "Why Do My Emails Go to Spam? Common Causes and Fixes",
    description: "Understand the main reasons inboxes filter or block your messages and what you can do about it.",
    date: "2025-02-21",
    body: `
<p>Finding your emails in the spam folder is frustrating, whether you’re reaching out to customers, sending newsletters, or just trying to get a message through. Inbox providers (Gmail, Outlook, Yahoo, etc.) use a mix of signals to decide whether a message is safe. Here are the most common reasons mail gets filtered and how to improve your odds.</p>

<h2>Missing or Weak Authentication (SPF, DKIM, DMARC)</h2>
<p>If your domain doesn’t have proper SPF, DKIM, and DMARC set up, providers have less proof that the mail is really from you. Messages that fail these checks are often quarantined or rejected. Fixing authentication is usually the highest-impact step: add or correct your SPF record, enable DKIM with your provider, and publish a DMARC policy (starting with <code>p=none</code> for monitoring).</p>

<h2>Content and Sending Patterns</h2>
<p>Spam filters also look at what you send and how you send it. Too many links, certain trigger words (“free,” “act now,” “click here”), heavy use of images with little text, or misleading subject lines can increase the chance of filtering. So can sending a sudden burst of messages to many people who don’t know you—that looks like typical spam behavior. Sending at a steady, reasonable pace and writing clear, honest content helps.</p>

<h2>Reputation and List Quality</h2>
<p>Your domain and IP reputation matter. If you’ve sent to a lot of invalid addresses, had high bounce or spam-complaint rates, or been on a blocklist, providers will treat your mail with more suspicion. Use a clean, permission-based list, remove bounces and unsubscribes quickly, and avoid buying or renting lists. Over time, good behavior improves reputation.</p>

<h2>Being on a Blocklist</h2>
<p>If your domain or IP is listed on a blocklist (e.g. Spamhaus, SORBS), some providers will reject or filter your mail until you’re removed. You can check whether you’re listed using the list’s lookup tool, then fix the underlying issue (e.g. a compromised server or past abuse) and request delisting according to that list’s process.</p>

<h2>Next Steps</h2>
<p>Start by checking your domain’s DNS: do you have valid SPF, DKIM, and DMARC? Use a free spam risk or deliverability check (like Postman) to see what’s missing. Then fix the gaps, watch your DMARC reports if you have them, and keep your sending practices and content above board. Small, consistent improvements often lead to better inbox placement over time.</p>
`,
  },
  {
    slug: "how-to-add-spf-record",
    title: "How to Add an SPF Record to Your Domain",
    description: "Step-by-step guide to creating and publishing an SPF TXT record for better email deliverability.",
    date: "2025-02-22",
    body: `
<p>An SPF (Sender Policy Framework) record tells the world which mail servers are allowed to send email for your domain. Adding one is one of the first steps toward better deliverability and fewer “why did this go to spam?” moments. Here’s how to do it.</p>

<h2>What You Need</h2>
<p>You need access to your domain’s DNS (where you add or edit records). That might be at your registrar (e.g. GoDaddy, Namecheap, Google Domains) or at a DNS provider like Cloudflare. You also need to know which services send email for you: your web host, your email provider (Gmail, Outlook, etc.), and any tools like Mailchimp, SendGrid, or your CRM.</p>

<h2>Get the Right SPF Value</h2>
<p>Each service that sends on your behalf will give you an “include” to add. For example:</p>
<ul>
<li><strong>Google Workspace / Gmail:</strong> <code>include:_spf.google.com</code></li>
<li><strong>Microsoft 365 / Outlook:</strong> <code>include:spf.protection.outlook.com</code></li>
<li><strong>SendGrid:</strong> <code>include:sendgrid.net</code></li>
<li><strong>Mailchimp:</strong> <code>include:servers.mailchimpapp.com</code></li>
</ul>
<p>You can have multiple includes, but you must have exactly one SPF record. So you combine them into a single TXT value. A simple example for Google only:</p>
<p><code>v=spf1 include:_spf.google.com ~all</code></p>
<p>The <code>~all</code> means “soft fail” for any server not listed (recommended when you’re starting). Your provider’s documentation will usually give you the exact string to use.</p>

<h2>Add the TXT Record in DNS</h2>
<p>In your DNS dashboard, add a new record:</p>
<ul>
<li><strong>Type:</strong> TXT</li>
<li><strong>Name:</strong> @ (or your root domain, e.g. yourdomain.com—depends on your host)</li>
<li><strong>Value:</strong> your full SPF string, e.g. <code>v=spf1 include:_spf.google.com ~all</code></li>
</ul>
<p>Save the record. DNS can take a few minutes to several hours to update globally.</p>

<h2>Check That It Worked</h2>
<p>Use an online SPF lookup tool, or run a domain spam-risk check (like Postman). They’ll look up your domain’s TXT records and confirm that an SPF record with <code>v=spf1</code> is present. Once it’s there and correct, receiving servers can use it to validate mail from your domain—one big step toward better deliverability.</p>
`,
  },
  {
    slug: "dmarc-basics-for-beginners",
    title: "DMARC Basics: What It Is and How to Start",
    description: "A beginner-friendly intro to DMARC and how to set up your first policy without breaking delivery.",
    date: "2025-02-23",
    body: `
<p>DMARC (Domain-based Message Authentication, Reporting & Conformance) is a DNS policy that tells receiving mail servers what to do when a message from your domain fails SPF or DKIM checks. It also lets you receive reports so you can see who’s sending as your domain and whether they’re legitimate. Here’s a simple way to think about it and how to get started.</p>

<h2>What Problem Does DMARC Solve?</h2>
<p>Without DMARC, when someone receives an email that claims to be from you@yourdomain.com but fails SPF or DKIM, the receiver decides on their own whether to deliver it, quarantine it, or reject it. You have no say and often no visibility. With DMARC, you publish a policy (e.g. “quarantine failures” or “reject them”) and optionally get reports about those failures. That helps you protect your domain from spoofing and fix misconfigurations in your own sending.</p>

<h2>Your First DMARC Record</h2>
<p>You add DMARC as a TXT record at <code>_dmarc.yourdomain.com</code>. A minimal, safe record for beginners looks like this:</p>
<p><code>v=DMARC1; p=none; rua=mailto:you@yourdomain.com</code></p>
<p>Explanation:</p>
<ul>
<li><strong>v=DMARC1</strong> – Required. Identifies the record as DMARC.</li>
<li><strong>p=none</strong> – Policy: “none” means “don’t change how you treat failing messages; just monitor.” This is the best way to start. You can later move to <code>p=quarantine</code> or <code>p=reject</code> when you’re ready.</li>
<li><strong>rua=mailto:...</strong> – Where to send aggregate reports (optional but useful). Use an address you check. Some providers send daily digests; others use report-processing services.</li>
</ul>

<h2>Adding the Record</h2>
<p>In your DNS provider, create a new TXT record:</p>
<ul>
<li><strong>Name:</strong> _dmarc</li>
<li><strong>Value:</strong> the full DMARC string above (with your email)</li>
</ul>
<p>Save, wait for DNS to propagate, then verify with a DMARC lookup tool or a domain check like Postman.</p>

<h2>What Happens Next?</h2>
<p>With <code>p=none</code>, delivery doesn’t change—you’re only asking for visibility. Once you get reports, you can see which sources are sending as your domain and whether they pass or fail. When you’re confident that all legitimate mail is correctly set up (SPF and DKIM), you can consider tightening to <code>p=quarantine</code> or <code>p=reject</code> to better protect your domain and your recipients.</p>
`,
  },
  {
    slug: "email-deliverability-checklist",
    title: "Email Deliverability Checklist: 5 Things to Do Now",
    description: "A practical checklist to improve your domain’s email deliverability and avoid the spam folder.",
    date: "2025-02-24",
    body: `
<p>Better email deliverability usually comes from a few clear steps: authentication, reputation, and good sending habits. This checklist gives you five actions you can take right now to improve the chance that your messages land in the inbox.</p>

<h2>1. Add or Fix SPF, DKIM, and DMARC</h2>
<p>Make sure your domain has a valid SPF record (one TXT record that lists all services allowed to send for you), DKIM enabled with the correct public key in DNS, and a DMARC record at <code>_dmarc.yourdomain.com</code>. Start with <code>p=none</code> so you can monitor without affecting delivery. Use a free domain or spam-risk checker to see what’s missing and get copy-paste values.</p>

<h2>2. Use a Consistent “From” Domain</h2>
<p>Send from addresses that match your domain (e.g. hello@yourdomain.com). Avoid sending from a shared or unrelated domain when you want to build trust for your brand. Align the “From” domain with the domain used in SPF and DKIM (alignment is what DMARC checks).</p>

<h2>3. Clean Your List and Send Steadily</h2>
<p>Remove invalid addresses and hard bounces, honor unsubscribes immediately, and don’t buy or rent lists. Send at a consistent, reasonable volume rather than huge spikes. This helps your domain and IP reputation and reduces the chance of being flagged or blocklisted.</p>

<h2>4. Check for Blocklists</h2>
<p>Search for your domain and sending IP on major blocklists (e.g. Spamhaus, SORBS). If you’re listed, follow that list’s process to fix the issue and request delisting. Even one listing can cause significant delivery problems.</p>

<h2>5. Monitor and Iterate</h2>
<p>Review DMARC reports if you have them, watch bounce and complaint rates in your sending platform, and run a domain check periodically (e.g. with Postman) to confirm SPF, DKIM, and DMARC are still correct after any DNS or provider changes. Small, regular checks prevent big deliverability surprises later.</p>

<p>Start with step one—authentication—then work through the list. You don’t have to do everything in one day; consistent progress will improve your results over time.</p>
`,
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return posts.map((p) => p.slug);
}
