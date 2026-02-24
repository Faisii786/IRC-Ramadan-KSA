"use client";

import { useEffect, useState } from "react";
import type { Submission } from "@/lib/submissions";
import { commonTranslations } from "@/lib/translations";
import { useLocale } from "@/app/LocaleProvider";

export default function AdminPage() {
  const { locale, setLocale } = useLocale();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isRtl = locale === "ar";
  const t = locale ? commonTranslations[locale] : commonTranslations.en;

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/submissions");
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setSubmissions(data.submissions);
      } catch {
        setError("load_failed");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString(isRtl ? "ar" : undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return (
    <div className="relative min-h-screen" dir={isRtl ? "rtl" : "ltr"}>
      {/* Same background video as form page */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
          aria-hidden
        >
          <source src="/videos/ramadan1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" aria-hidden />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-4xl">
          <div className="rounded-2xl border border-white/20 bg-white/15 p-6 shadow-xl backdrop-blur-xl sm:p-8">
            <header className="mb-8">
              <div className={`flex items-center justify-between gap-4 mb-4 ${isRtl ? "flex-row-reverse" : ""}`}>
                <div className="flex items-center gap-3">
                  <img src="/icons/logo.png" alt="" className="h-8 w-auto object-contain sm:h-9" />
                  <p className="text-sm font-medium uppercase tracking-wider text-white/80">
                    {t.adminPanel}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setLocale("en")}
                    className={`rounded px-2.5 py-1 text-sm font-medium transition ${locale === "en" ? "bg-white/25 text-white" : "text-white/70 hover:text-white"
                      }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocale("ar")}
                    className={`rounded px-2.5 py-1 text-sm font-medium transition ${locale === "ar" ? "bg-white/25 text-white" : "text-white/70 hover:text-white"
                      }`}
                  >
                    العربية
                  </button>
                </div>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {t.submissions}
              </h1>
              <p className="mt-1 text-white/90">{t.submissionsDesc}</p>
            </header>

            <div className="overflow-hidden rounded-xl border border-white/20 bg-black/20 backdrop-blur">
              {loading ? (
                <div className="p-12 text-center text-white/80">{t.loading}</div>
              ) : error ? (
                <div className="p-8 text-center text-red-200">{t.errorLoad}</div>
              ) : submissions.length === 0 ? (
                <div className="p-12 text-center text-white/80">{t.noSubmissions}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[580px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/20 bg-white/10">
                        <th className="px-4 py-3 font-medium text-white">{t.name}</th>
                        <th className="px-4 py-3 font-medium text-white">{t.employeeId}</th>
                        <th className="px-4 py-3 font-medium text-white">{t.company}</th>
                        <th className="px-4 py-3 font-medium text-white">{t.attendance}</th>
                        <th className="px-4 py-3 font-medium text-white/80">{t.submitted}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((s) => (
                        <tr
                          key={s.id}
                          className="border-b border-white/10 last:border-0 text-white hover:bg-white/5 transition"
                        >
                          <td className="px-4 py-3 font-medium">{s.employeeName}</td>
                          <td className="px-4 py-3">{s.employeeId}</td>
                          <td className="px-4 py-3">{s.company}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${s.attendance === "Yes"
                                ? "bg-emerald-400/30 text-emerald-200"
                                : "bg-white/20 text-white/90"
                                }`}
                            >
                              {s.attendance}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-white/80">{formatDate(s.submittedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
