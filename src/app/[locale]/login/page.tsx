"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getDict, type Locale } from "@/lib/i18n";

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = use(params);
  const locale = (raw === "en" ? "en" : "zh") as Locale;
  const t = getDict(locale);
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: fd.get("email"),
        password: fd.get("password"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }
    router.push(`/${locale}/account`);
    router.refresh();
  }

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-md">
        <h1 className="section-title">{t.nav.login}</h1>
        <form onSubmit={onSubmit} className="card mt-6 grid gap-4 p-6">
          <div>
            <label className="label">{t.form.email}</label>
            <input name="email" type="email" className="input" required />
          </div>
          <div>
            <label className="label">{t.form.password}</label>
            <input name="password" type="password" className="input" required />
          </div>
          {error && <p className="text-sm text-accent">{error}</p>}
          <button className="btn btn-primary" disabled={loading} type="submit">
            {loading ? t.form.submitting : t.form.login}
          </button>
          <p className="text-sm text-muted">
            {t.form.noAccount}{" "}
            <Link className="font-semibold text-accent" href={`/${locale}/apply`}>
              {t.nav.apply}
            </Link>
          </p>
          <p className="text-xs text-muted">
            Demo: demo@goldenwok.us / demo1234 · Admin: admin@kitchenlink.us / admin123
          </p>
        </form>
      </div>
    </div>
  );
}
