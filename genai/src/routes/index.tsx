import { createFileRoute, Link } from "@tanstack/react-router";
import { CITIES } from "@/lib/cities";

const TITLE = "Food Truck Permits — City Guides & Permit Tracker";
const DESC =
  "City-by-city guides for food truck permits in the US, plus a simple dashboard to track issue dates, expirations, and renewals.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Food Truck Permits",
          description: DESC,
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-semibold">Food Truck Permits</Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/login" className="text-muted-foreground hover:text-foreground">Sign in</Link>
            <Link to="/app" className="rounded-md bg-primary px-3 py-1.5 text-primary-foreground hover:bg-primary/90">Dashboard</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        <section className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Food truck permits, by city.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            City-specific guides on what permit you need, what it costs, and how long it
            takes — plus a simple tracker so you never miss a renewal.
          </p>
        </section>

        <section className="mt-16">
          <h2 className="mb-6 text-xl font-semibold">Browse city permit guides</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CITIES.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/food-truck-permits/$city"
                  params={{ city: c.slug }}
                  className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary"
                >
                  <div className="font-medium">{c.name}, {c.state}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{c.agency}</div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Food Truck Permits
        </div>
      </footer>
    </div>
  );
}
