# Server-side TODOs (dropped during TanStack Start → Astro port)

The source project used TanStack Start server handlers for these
routes. Astro's static-output model doesn't translate them
verbatim. Notes below for whoever revives them.

## TODO: sitemap

- Source: `genai/src/routes/sitemap[.]xml.ts` — server handler that
  emitted `<urlset>` from the CITIES list at request time.
- Astro replacement options:
  1. The `@astrojs/sitemap` integration (already wired in
     `astro.config.mjs`) auto-generates `/sitemap-index.xml` and
     `/sitemap-0.xml` for all built pages — the home page, every
     `/food-truck-permits/<city>` route, and login/app shells. This
     is the current behavior; the stub at `public/sitemap.xml`
     should be removed before production so the integration's
     output is what's served.
  2. If a hand-curated sitemap is needed, write a
     `src/pages/sitemap.xml.ts` Astro endpoint (Astro supports
     non-page endpoints in static builds — they emit at build time).

## TODO: robots.txt

- Source: `genai/src/routes/robots[.]txt.ts` — server handler that
  returned a static body with `Disallow: /app` and
  `Disallow: /login`.
- Astro replacement: `public/robots.txt` (already present, updated
  to match the source's disallow list).

## TODO: Supabase server-side helpers

- Source: `genai/src/integrations/supabase/client.server.ts`,
  `auth-attacher.ts`, `auth-middleware.ts` — wired auth middleware
  into TanStack Start's request lifecycle.
- Astro replacement: not applicable while `output: 'static'`.
  Auth is handled entirely client-side via the Supabase JS SDK in
  `src/lib/supabase.ts` and React islands under `/app/*` and
  `/login`. If we ever move to SSR (Astro adapter), port the
  middleware then.
