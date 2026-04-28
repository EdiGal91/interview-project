# Trip Planner — Code Review Task

A small Next.js 16 (App Router) trip-planning app. Three areas:

- **`/`** — landing page with a 4-card "trip composer" (Destination / Hotel /
  Activity / Transport). _This page has the bug you're reviewing._
- **`/countries`** — browseable list of 250 countries (REST Countries),
  searchable by name and filterable by region.
- **`/countries/[code]`** — detail page: country facts + Wikipedia summary +
  7-day weather forecast for the capital. Three queries fired in parallel.
- **`/trip`** — countries you've added to your trip (cookie-backed).

This page is treated as an **important SEO landing page**, so it must keep
working with SSR (no `ssr: false` shortcuts).

---

## Stack

- Next.js 16 (App Router, RSC, Route Handlers)
- React 19
- TanStack Query 5 (server state, with SSR hydration via `HydrationBoundary`)
- axios (one instance per upstream — REST Countries / Open-Meteo / Wikipedia /
  internal `/api/trip`) with a shared `ApiError` interceptor
- Tailwind CSS v4
- TypeScript (strict)

## External APIs

All free, no key required:

- **REST Countries v3.1** — `https://restcountries.com/v3.1/...`
- **Open-Meteo** — `https://api.open-meteo.com/v1/forecast`
- **Wikipedia REST** — `https://en.wikipedia.org/api/rest_v1/page/summary/...`

## Setup

```bash
git clone <repo-url> interview-project
cd interview-project
npm install
npm run dev
# open http://localhost:3000
```

> Internal trip storage uses an HTTP-only cookie via Next.js Route Handlers
> (`app/api/trip/route.ts`). No external persistence.

## What you should observe

The home page (`/`) starts with an empty trip composer. Pick at least one
card (Destination / Hotel / Activity / Transport) — the choice is persisted
in a cookie. **Refresh the page**: now the four selection cards visibly
**jump / shift** before settling. QA reported this as "layout breaking on
reload when the user has a saved trip".

## The PR you are reviewing

There is an open pull request that attempts to fix the issue:

> **`fix/skeleton-loading-shift`** — _"Hide the grid behind a skeleton for 800ms
> on first render so the user doesn't see the shift."_

## Your task

1. Pull the PR branch and run it. Decide if you would approve, request changes,
   or reject.
2. If you reject or request changes, explain **why** and propose a better fix.
   Be specific — point at file/line, describe the underlying cause, and write
   the diff (or pseudo-diff) you would expect on `main`.
3. Be ready to discuss trade-offs (a11y, SEO, CLS, INP, hydration cost,
   maintenance) verbally during the call.

## Bonus signal

The rest of the app uses TanStack Query + axios with SSR hydration. Feel free
to comment on anything you'd improve — query key design, caching, error
handling, optimistic updates, the axios layer, the route handlers, anything.

You may use any tooling: Chrome DevTools (Performance / Elements / Lighthouse),
React DevTools, React Query DevTools, `curl`, `git log`. There is no "gotcha" —
just a real bug that has a popular wrong fix and a less popular right fix.

Good luck!
