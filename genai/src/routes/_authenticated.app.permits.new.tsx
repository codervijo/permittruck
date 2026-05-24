import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CITIES } from "@/lib/cities";

export const Route = createFileRoute("/_authenticated/app/permits/new")({
  component: NewPermit,
});

function NewPermit() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    business_name: "",
    city: CITIES[0].slug,
    permit_number: "",
    issued_date: "",
    expires_date: "",
    status: "active",
    notes: "",
  });

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setError("Not signed in");
      setBusy(false);
      return;
    }
    const { error } = await supabase.from("permits").insert({
      user_id: userData.user.id,
      business_name: form.business_name,
      city: form.city,
      permit_number: form.permit_number || null,
      issued_date: form.issued_date || null,
      expires_date: form.expires_date || null,
      status: form.status,
      notes: form.notes || null,
    });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    navigate({ to: "/app" });
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <Link to="/app" className="text-sm text-muted-foreground hover:text-foreground">← Back</Link>
      <h1 className="mt-4 text-2xl font-semibold">Add a permit</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Field label="Business name">
          <input
            required
            value={form.business_name}
            onChange={(e) => set("business_name", e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </Field>
        <Field label="City">
          <select
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}, {c.state}</option>
            ))}
          </select>
        </Field>
        <Field label="Permit number">
          <input
            value={form.permit_number}
            onChange={(e) => set("permit_number", e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Issued date">
            <input
              type="date"
              value={form.issued_date}
              onChange={(e) => set("issued_date", e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Expires date">
            <input
              type="date"
              value={form.expires_date}
              onChange={(e) => set("expires_date", e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
        </div>
        <Field label="Status">
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="expired">Expired</option>
          </select>
        </Field>
        <Field label="Notes">
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </Field>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save permit"}
        </button>
      </form>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}