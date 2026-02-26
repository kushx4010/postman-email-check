export type RiskLevel = "Low" | "Medium" | "High";

export type MissingRecord = "spf" | "dkim" | "dmarc";

export interface ScanResult {
  score: number;
  riskLevel: RiskLevel;
  issues: string[];
  fixes: string[];
  domain: string;
  missing: MissingRecord[];
}

export interface ScanRequestBody {
  email: string;
  domain: string;
  /** When true, add email to the Postman list (Resend Audience or in-memory). */
  subscribe?: boolean;
}
