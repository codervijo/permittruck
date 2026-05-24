import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CITIES } from "@/lib/cities";

interface Permit {
  id: string;
  city: string;
  business_name: string;
  permit_number: string | null;
  issued_date: string | null;
  expires_date: string | null;
  status: string;
}

export const Route = createFileRoute("/_authenticated/app/")({
  component: Dashboard,
});

function Dashboard() {
  const [permits, setPermits] = useState<Permit[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("permits")
      .select("id, city, business_name, permit_number, issued_date, expires_date, status")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setPermits(data as Permit[]);
      });
  }, []);

  function cityName(slug: string) {
    return CITIES.find((c) => c.slug === slug)?.name ?? slug;
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your permits</h1>
        <Link
          to="/app/permits/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Add permit
        </Link>
      </div>

      {error && <p className="mt-6 text-sm text-destructive">{error}</p>}

      {permits === null ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : permits.length === 0 ? (
        <div className="mt-12 rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">No permits yet.</p>
          <Link
            to="/app/permits/new"
            className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Add your first permit
          </Link>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-border rounded-lg border border-border">
          {permits.map((p) => (
            <li key={p.id}>
              <Link
                to="/app/permits/$id"
                params={{ id: p.id }}
                className="flex items-center justify-between px-4 py-3 hover:bg-accent"
              >
                <div>
                  <div className="font-medium">{p.business_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {cityName(p.city)} · {p.permit_number ?? "No #"}
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div>{p.status}</div>
                  <div className="text-muted-foreground">
                    {p.expires_date ? `Expires ${p.expires_date}` : "No expiry"}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}