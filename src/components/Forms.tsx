"use client";

import { useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";

export function ApplyForm({ locale, t }: { locale: Locale; t: Dictionary }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, locale }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus("err");
      setMsg(data.error || "Error");
      return;
    }
    setStatus("ok");
    setMsg(t.form.success);
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="card grid gap-4 p-6 md:grid-cols-2">
      <Field name="contactName" label={t.form.name} required />
      <Field name="email" label={t.form.email} type="email" required />
      <Field name="phone" label={t.form.phone} required />
      <Field name="companyName" label={t.form.company} required />
      <div>
        <label className="label">{t.form.businessType}</label>
        <select name="businessType" className="input" required defaultValue="restaurant">
          <option value="restaurant">{t.form.restaurant}</option>
          <option value="supermarket">{t.form.supermarket}</option>
          <option value="distributor">{t.form.distributor}</option>
        </select>
      </div>
      <Field name="cityState" label={t.form.cityState} required />
      <Field name="monthlyVolume" label={t.form.volume} />
      <div className="md:col-span-2">
        <label className="label">{t.form.message}</label>
        <textarea name="message" className="input min-h-28" />
      </div>
      <div className="md:col-span-2">
        <button className="btn btn-primary" disabled={status === "loading"} type="submit">
          {status === "loading" ? t.form.submitting : t.form.submit}
        </button>
        {msg && <p className="mt-3 text-sm text-accent-2">{msg}</p>}
      </div>
    </form>
  );
}

export function CustomForm({ locale, t }: { locale: Locale; t: Dictionary }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    const res = await fetch("/api/custom-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, locale }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus("err");
      setMsg(data.error || "Error");
      return;
    }
    setStatus("ok");
    setMsg(t.form.success);
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="card grid gap-4 p-6 md:grid-cols-2">
      <Field name="contactName" label={t.form.name} required />
      <Field name="email" label={t.form.email} type="email" required />
      <Field name="phone" label={t.form.phone} required />
      <Field name="companyName" label={t.form.company} required />
      <div className="md:col-span-2">
        <label className="label">{t.form.productNeed}</label>
        <textarea name="productNeed" className="input min-h-24" required />
      </div>
      <Field name="quantity" label={t.form.quantity} required />
      <Field name="targetPrice" label={t.form.targetPrice} />
      <Field name="deadline" label={t.form.deadline} />
      <div className="md:col-span-2">
        <label className="label">{t.form.notes}</label>
        <textarea name="notes" className="input min-h-24" />
      </div>
      <div className="md:col-span-2">
        <button className="btn btn-primary" disabled={status === "loading"} type="submit">
          {status === "loading" ? t.form.submitting : t.form.submit}
        </button>
        {msg && <p className="mt-3 text-sm text-accent-2">{msg}</p>}
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <input id={name} name={name} type={type} className="input" required={required} />
    </div>
  );
}
