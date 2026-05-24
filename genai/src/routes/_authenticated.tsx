import { createFileRoute, Outlet, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (!s) navigate({ to: "/login" });
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
      if (!data.session) navigate({ to: "/login" });
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/app" className="font-semibold">Permit Tracker</Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">{session.user.email}</span>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/login" });
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}