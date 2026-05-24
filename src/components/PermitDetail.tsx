import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { CITIES } from "../lib/cities";
import AppShell from "./AppShell";

interface PermitRow {
  id: string;
  business_name: string;
  city: string;
  permit_number: string | null;
  issued_date: string | null;
  expires_date: string | null;
  status: string;
  notes: string | null;
}

export default function PermitDetail() {
  const [id, setId] = useState<string | null>(null);
  const [permit, setPermit] = useState<PermitRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramId = params.get("id");
    if (!paramId) {
      setLoading(false);
      return;
    }
    setId(paramId);
    supabase
      .from("permits")
      .select("id, business_name, city, permit_number, issued_date, expires_date, status, notes")
      .eq("id", paramId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setPermit(data as PermitRow | null);
        setLoading(false);
      });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!permit || !id) return;
    setBusy(true);
    setError(null);
    const { error } = await supabase
      .from("permits")
      .update({
        business_name: permit.business_name,
        city: permit.city,
        permit_number: permit.permit_number || null,
        issued_date: permit.issued_date || null,
        expires_date: permit.expires_date || null,
        status: permit.status,
        notes: permit.notes || null,
      })
      .eq("id", id);
    setBusy(false);
    if (error) setError(error.message);
  }

  async function remove() {
    if (!id) return;
    if (!confirm("Delete this permit?")) return;
    const { error } = await supabase.from("permits").delete().eq("id", id);
    if (error) setError(error.message);
    else window.location.href = "/app";
  }

  function update<K extends keyof PermitRow>(k: K, v: PermitRow[K]) {
    setPermit((p) => (p ? { ...p, [k]: v } : p));
  }

  return (
    <AppShell>
      {loading ? (
        <main className="mx-auto max-w-2xl px-6 py-10 text-sm text-muted-foreground">Loading…</main>
      ) : !permit ? (
        <main className="mx-auto max-w-2xl px-6 py-10">
          <p className="text-muted-foreground">Permit not found.</p>
          <a href="/app" className="mt-4 inline-block text-primary underline">Back to dashboard</a>
        </main>
      ) : (
        <main className="mx-auto max-w-2xl px-6 py-10">
          <a href="/app" className="text-sm text-muted-foreground hover:text-foreground">← Back</a>
          <h1 className="mt-4 text-2xl font-semibold">Edit permit</h1>
          <form onSubmit={save} className="mt-6 space-y-4">
            <Field label="Business name">
              <input
                required
                value={permit.business_name}
                onChange={(e) => update("business_name", e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </Field>
            <Field label="City">
              <select
                value={permit.city}
                onChange={(e) => update("city", e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {CITIES.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}, {c.state}</option>
                ))}
              </select>
            </Field>
            <Field label="Permit number">
              <input
                value={permit.permit_number ?? ""}
                onChange={(e) => update("permit_number", e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Issued date">
                <input
                  type="date"
                  value={permit.issued_date ?? ""}
                  onChange={(e) => update("issued_date", e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </Field>
              <Field label="Expires date">
                <input
                  type="date"
                  value={permit.expires_date ?? ""}
                  onChange={(e) => update("expires_date", e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </Field>
            </div>
            <Field label="Status">
              <select
                value={permit.status}
                onChange={(e) => update("status", e.target.value)}
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
                value={permit.notes ?? ""}
                onChange={(e) => update("notes", e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </Field>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex justify-between">
              <button
                type="submit"
                disabled={busy}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {busy ? "Saving…" : "Save changes"}
              </button>
              <button
                type="button"
                onClick={remove}
                className="rounded-md border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                Delete
              </button>
            </div>
          </form>
        </main>
      )}
    </AppShell>
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
