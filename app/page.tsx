"use client";

import { useState } from "react";
import { COMPANY_OPTIONS } from "@/lib/submissions";
import { formTranslations } from "@/lib/translations";
import { useLocale } from "./LocaleProvider";

export default function Home() {
  const { locale, setLocale } = useLocale();
  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [company, setCompany] = useState("");
  const [attendance, setAttendance] = useState<"Yes" | "No" | "">("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isRtl = locale === "ar";
  const t = locale ? formTranslations[locale] : formTranslations.en;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!t) return;
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeName,
          employeeId,
          company,
          attendance,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || t.errorSubmit);
        return;
      }

      setStatus("success");
      setEmployeeName("");
      setEmployeeId("");
      setCompany("");
      setAttendance("");
    } catch {
      setStatus("error");
      setErrorMessage(t.errorNetwork);
    }
  }

  // First screen: choose language (same video + glass UI)
  if (locale === null) {
    return (
      <div className="relative min-h-screen" dir="ltr">
        <div className="fixed inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
            aria-hidden
          >
            <source src="/videos/ramadan2.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" aria-hidden />
        </div>
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:py-16">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-white/20 bg-white/15 p-8 shadow-xl backdrop-blur-xl sm:p-10 text-center">
              <p className="text-xl font-medium text-white sm:text-2xl mb-8">
                Choose language / اختر اللغة
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => setLocale("en")}
                  className="btn-primary min-w-[100px] sm:min-w-[120px]"
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLocale("ar")}
                  className="btn-primary min-w-[100px] sm:min-w-[120px]"
                >
                  العربية
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form screen
  return (
    <div className="relative min-h-screen" dir={isRtl ? "rtl" : "ltr"}>
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
          aria-hidden
        >
          <source src="/videos/ramadan2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" aria-hidden />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-white/20 bg-white/15 p-6 shadow-xl backdrop-blur-xl sm:p-8">
            <div className={`mb-6 flex items-center justify-between gap-4 ${isRtl ? "flex-row-reverse" : ""}`}>
              <img src="/icons/logo.png" alt="" className="h-9 w-auto object-contain sm:h-10" />
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setLocale("en")}
                  className={`rounded px-2.5 py-1 text-sm font-medium transition ${
                    locale === "en" ? "bg-white/25 text-white" : "text-white/70 hover:text-white"
                  }`}
                  aria-label="English"
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLocale("ar")}
                  className={`rounded px-2.5 py-1 text-sm font-medium transition ${
                    locale === "ar" ? "bg-white/25 text-white" : "text-white/70 hover:text-white"
                  }`}
                  aria-label="العربية"
                >
                  العربية
                </button>
              </div>
            </div>

            <header className="mb-8 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {t.title}
              </h1>
              <p className="mt-2 text-white">{t.subtitle}</p>
            </header>

            {status === "success" ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-white">{t.thankYou}</p>
                <p className="mt-1 text-white">{t.recorded}</p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="btn-primary mt-6"
                >
                  {t.submitAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="employeeName" className="mb-1.5 block text-sm font-medium text-white">
                    {t.employeeName}
                  </label>
                  <input
                    id="employeeName"
                    type="text"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    placeholder={locale === "ar" ? "الاسم الكامل" : "Full name"}
                    required
                    disabled={status === "submitting"}
                    autoComplete="name"
                    className="glass-input"
                  />
                </div>

                <div>
                  <label htmlFor="employeeId" className="mb-1.5 block text-sm font-medium text-white">
                    {t.employeeId}
                  </label>
                  <input
                    id="employeeId"
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder={locale === "ar" ? "مثال: 001" : "e.g. EMP001"}
                    required
                    disabled={status === "submitting"}
                    autoComplete="off"
                    className="glass-input"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-white">
                    {t.company}
                  </label>
                  <select
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                    disabled={status === "submitting"}
                    className="glass-input"
                  >
                    <option value="">{t.selectCompany}</option>
                    {COMPANY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="mb-2 block text-sm font-medium text-white">
                    {t.willYouAttend}
                  </span>
                  <div className="flex gap-6">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="attendance"
                        value="Yes"
                        checked={attendance === "Yes"}
                        onChange={() => setAttendance("Yes")}
                        disabled={status === "submitting"}
                        className="h-4 w-4 accent-white"
                      />
                      <span className="text-white">{t.yes}</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="attendance"
                        value="No"
                        checked={attendance === "No"}
                        onChange={() => setAttendance("No")}
                        disabled={status === "submitting"}
                        className="h-4 w-4 accent-white"
                      />
                      <span className="text-white">{t.no}</span>
                    </label>
                  </div>
                </div>

                {errorMessage && (
                  <p className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-200 backdrop-blur">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting" || attendance === ""}
                  className="btn-primary w-full"
                >
                  {status === "submitting" ? t.submitting : t.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
