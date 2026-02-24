/**
 * In-memory store for form submissions.
 * Replace this with Google Sheets or a database for production persistence.
 */

export const COMPANY_OPTIONS = [
  "IRC",
  "Daem",
  "Fatimah Ali Aseeri Law Firm",
  "APSG",
] as const;

export type Company = (typeof COMPANY_OPTIONS)[number];

export interface Submission {
  id: string;
  employeeName: string;
  employeeId: string;
  company: Company;
  attendance: "Yes" | "No";
  submittedAt: string; // ISO string
}

const submissions: Submission[] = [];

export function addSubmission(data: Omit<Submission, "id" | "submittedAt">): Submission {
  const submission: Submission = {
    ...data,
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
  };
  submissions.push(submission);
  // Log for now (as requested)
  console.log("[Ramadan Suhoor] New submission:", submission);
  return submission;
}

export function getSubmissions(): Submission[] {
  return [...submissions].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
}
