"use client";

import { useEffect, useState } from "react";
import type { Submission } from "@/lib/submissions";
import { commonTranslations } from "@/lib/translations";
import { useLocale } from "@/app/LocaleProvider";

const ADMIN_AUTH_KEY = "suhoor_admin_auth";
const ADMIN_PASSWORD = "yadu@irc123";

function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!(localStorage.getItem(ADMIN_AUTH_KEY) || sessionStorage.getItem(ADMIN_AUTH_KEY));
}

export default function AdminPage() {
  const { locale, setLocale } = useLocale();
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isRtl = locale === "ar";
  const t = locale ? commonTranslations[locale] : commonTranslations.en;

  useEffect(() => {
    setAuthChecked(true);
    setAuthenticated(isAuthenticated());
  }, []);

  useEffect(() => {
    if (!authenticated) return;
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
  }, [authenticated]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    if (password !== ADMIN_PASSWORD) {
      setLoginError(t.wrongPassword);
      return;
    }
    if (rememberMe) {
      localStorage.setItem(ADMIN_AUTH_KEY, "1");
    } else {
      sessionStorage.setItem(ADMIN_AUTH_KEY, "1");
    }
    setAuthenticated(true);
    setPassword("");
  }

  function handleLogout() {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    setAuthenticated(false);
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString(isRtl ? "ar" : undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  if (!authChecked) {
    return (
      <div className="relative flex min-h-screen items-center justify-center">
        <div className="text-white/80">{t.loading}</div>
      </div>
    );
  }

  if (!authenticated) {
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
            <source src="/videos/ramadan1.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" aria-hidden />
        </div>
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:py-16">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-white/20 bg-white/15 p-6 shadow-xl backdrop-blur-xl sm:p-8">
              <div className={`mb-6 flex items-center justify-between gap-4 ${isRtl ? "flex-row-reverse" : ""}`}>
                <img src="/icons/logo.png" alt="" className="h-8 w-auto object-contain" />
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setLocale("en")}
                    className={`rounded px-2.5 py-1 text-sm font-medium ${locale === "en" ? "bg-white/25 text-white" : "text-white/70 hover:text-white"}`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocale("ar")}
                    className={`rounded px-2.5 py-1 text-sm font-medium ${locale === "ar" ? "bg-white/25 text-white" : "text-white/70 hover:text-white"}`}
                  >
                    العربية
                  </button>
                </div>
              </div>
              <p className="mb-6 text-sm font-medium uppercase tracking-wider text-white/80">
                {t.adminPanel}
              </p>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-white">
                    {t.adminPassword}
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=""
                    required
                    autoComplete="current-password"
                    className="glass-input"
                  />
                </div>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded accent-white"
                  />
                  <span className="text-sm text-white">{t.rememberMe}</span>
                </label>
                {loginError && (
                  <p className="text-sm text-red-200">{loginError}</p>
                )}
                <button type="submit" className="btn-primary w-full">
                  {t.signIn}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded px-2.5 py-1 text-sm font-medium text-white/70 hover:text-white transition"
                  >
                    {t.logOut}
                  </button>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setLocale("en")}
                      className={`rounded px-2.5 py-1 text-sm font-medium transition ${locale === "en" ? "bg-white/25 text-white" : "text-white/70 hover:text-white"}`}
                    >
                      EN
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocale("ar")}
                      className={`rounded px-2.5 py-1 text-sm font-medium transition ${locale === "ar" ? "bg-white/25 text-white" : "text-white/70 hover:text-white"}`}
                    >
                      العربية
                    </button>
                  </div>
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
                              className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${
                                s.attendance === "Yes"
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
