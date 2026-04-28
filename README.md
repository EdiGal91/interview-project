# Trip Planner — Code Review Task

A small Next.js 16 (App Router) landing page for planning a trip. Four selection
cards (Destination / Hotel / Activity / Transport). Each card opens a picker
modal; filled cards have a small "✕" swap button to clear the choice.

This page is treated as an **important SEO landing page**, so it must keep
working with SSR (no `ssr: false` shortcuts).

---

## Setup

```bash
git clone <repo-url> interview-project
cd interview-project
npm install
npm run dev
# open http://localhost:3000
```

> Images are fetched from `https://picsum.photos` (free, no auth, no rate limit
> for normal use). If you have no internet, the `next/image` component will
> still render the layout — you'll just see broken image placeholders.

## What you should observe

When the page first loads (or after a hard refresh / cmd+shift+R), the four
cards visibly **jump / shift** before settling. QA reported this as
"layout breaking on initial load".

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

You may use any tooling: Chrome DevTools (Performance / Elements / Lighthouse),
React DevTools, `curl`, `git log`, anything else. There is no "gotcha" — just a
real bug that has a popular wrong fix and a less popular right fix.

Good luck!
