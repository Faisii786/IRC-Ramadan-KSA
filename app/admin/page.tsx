"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Submission } from "@/lib/submissions";

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/submissions");
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setSubmissions(data.submissions);
      } catch {
        setError("Could not load submissions.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return (
    <div className="min-h-screen px-4 py-10 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">
              Submissions
            </h1>
            <p className="mt-1 text-[var(--text-muted)]">
              Ramadan Suhoor attendance confirmations
            </p>
          </div>
          <Link href="/" className="btn-ghost inline-flex w-fit">
            ← Back to form
          </Link>
        </header>

        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-[var(--text-muted)]">
              Loading…
            </div>
          ) : error ? (
            <div className="p-8 text-center text-[var(--error)]">{error}</div>
          ) : submissions.length === 0 ? (
            <div className="p-12 text-center text-[var(--text-muted)]">
              No submissions yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[580px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--bg)]">
                    <th className="px-4 py-3 font-medium text-[var(--text)]">Name</th>
                    <th className="px-4 py-3 font-medium text-[var(--text)]">Employee ID</th>
                    <th className="px-4 py-3 font-medium text-[var(--text)]">Company</th>
                    <th className="px-4 py-3 font-medium text-[var(--text)]">Attendance</th>
                    <th className="px-4 py-3 font-medium text-[var(--text-muted)]">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg)]/50"
                    >
                      <td className="px-4 py-3 font-medium text-[var(--text)]">
                        {s.employeeName}
                      </td>
                      <td className="px-4 py-3 text-[var(--text)]">{s.employeeId}</td>
                      <td className="px-4 py-3 text-[var(--text)]">{s.company}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${
                            s.attendance === "Yes"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-100 text-[var(--text-muted)]"
                          }`}
                        >
                          {s.attendance}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--text-muted)]">
                        {formatDate(s.submittedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
