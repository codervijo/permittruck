import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CITIES, getCity } from "@/lib/cities";

export const Route = createFileRoute("/food-truck-permits/$city")({
  loader: ({ params }) => {
    const city = getCity(params.city);
    if (!city) throw notFound();
    return { city };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {};
    const { city } = loaderData;
    const title = `Food Truck Permit in ${city.name}, ${city.state} — Requirements, Fees & Process`;
    const description = `How to get a food truck permit in ${city.name}, ${city.state}. ${city.agency}. Fees ${city.feeRange}. Processing ${city.processingTime}.`;
    const url = `/food-truck-permits/${params.city}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description,
            about: `Food truck permits in ${city.name}, ${city.state}`,
            mainEntityOfPage: url,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "Food Truck Permits", item: "/" },
              { "@type": "ListItem", position: 3, name: `${city.name}, ${city.state}`, item: url },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold">City not found</h1>
      <p className="mt-2 text-muted-foreground">We don't have a guide for that city yet.</p>
      <Link to="/" className="mt-6 inline-block text-primary underline">Back to all cities</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: CityPage,
});

function CityPage() {
  const { city } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-semibold">Food Truck Permits</Link>
          <Link to="/app" className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90">
            Track my permit
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <span>{city.name}, {city.state}</span>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Food Truck Permit in {city.name}, {city.state}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          What you need to operate a mobile food unit in {city.name}, including the
          issuing agency, typical fees, and renewal cadence.
        </p>

        <dl className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card label="Issuing agency" value={city.agency} />
          <Card label="Fees" value={city.feeRange} />
          <Card label="Processing time" value={city.processingTime} />
          <Card label="Renewal" value={city.renewal} />
        </dl>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">What to know</h2>
          <p className="mt-3 text-muted-foreground">{city.notes}</p>
        </section>

        <section className="mt-10 rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Don't lose track of your renewal</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Log your {city.name} permit and we'll keep its expiration date front and center.
          </p>
          <Link
            to="/app/permits/new"
            className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Add my permit
          </Link>
        </section>

        <section className="mt-12">
          <h2 className="text-lg font-semibold">Other cities</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {CITIES.filter((c) => c.slug !== city.slug).map((c) => (
              <li key={c.slug}>
                <Link
                  to="/food-truck-permits/$city"
                  params={{ city: c.slug }}
                  className="rounded-full border border-border px-3 py-1 text-sm hover:border-primary"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-8 text-sm text-muted-foreground">
          This guide is informational and not legal advice. Verify requirements with {city.agency}.
        </div>
      </footer>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}