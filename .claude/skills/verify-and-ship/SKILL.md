---
name: verify-and-ship
description: Use this whenever you finish a code change to this app (frontend or backend) and are about to consider it done. Covers type-checking, linting, building, running the automated test suite, visually verifying the change in a real browser at desktop and mobile sizes, updating CLAUDE.md, and committing/pushing. Trigger on phrases like "bangun web", "lanjut kerjakan", or any request to add/fix/change a feature in this repo — not just when the user explicitly asks to test or deploy.
---

# Verify and ship a change to Pemantauan & Pengelolaan PJP

This is a Laravel + Inertia.js + React (TypeScript) app. A change is not done when the
code compiles — it's done when it's been checked and pushed. Follow every step below
for any non-trivial change; skip only the steps that are genuinely irrelevant (e.g. a
pure-copy text edit doesn't need a browser check, a backend-only change doesn't need
`tsc`).

Read `CLAUDE.md` at the repo root first if you haven't already this session — it holds
the domain rules, past gotchas, and frontend/backend conventions specific to this app.
Don't rediscover a bug that's already documented there.

## 1. Static checks

- `npx tsc --noEmit` for any `.tsx`/`.ts` change.
- `php -l path/to/File.php` for every changed PHP file.
- `npm run build` — must finish clean. This is the single best early-warning check;
  never skip it.

## 2. Automated tests

- If the change touches business logic under `app/` (scoring, dates, tahapan
  transitions, anything in `app/Models` or `app/Http/Controllers`), run
  `composer test` (or `php artisan test`) and make sure it's green before moving on.
- If you added or changed a business rule, add or update a test in `tests/Feature/`
  for it — this app has a documented history of silent regressions (see CLAUDE.md's
  "Automated test coverage" note) that only static checks won't catch.

## 3. Visual verification (do not skip for any UI change)

Static checks and passing tests verify correctness, not how it looks or whether it's
usable — this app has repeatedly had real bugs (truncated labels, overflowing mobile
headers, invisible badges, a column-selection bug that silently zeroed out a whole
chart) that only showed up on an actual screenshot, never in `tsc` or a test run.

1. Start both dev servers in the background: `php artisan serve` and `npm run dev`.
2. If the pages you touched need data to look realistic (not empty-state), seed a
   handful of `Pjp` records via `php artisan tinker` covering a spread of tahapan,
   status, and score bands — don't just eyeball an empty list.
3. Use Playwright (Chromium is pre-installed; see the environment notes for the
   executable path) to screenshot every page you changed at two viewports:
   desktop (~1280×900) and mobile (~390×844). Read the screenshots back and actually
   look at them.
4. On the mobile screenshots, also check programmatically for horizontal overflow —
   `document.documentElement.scrollWidth` should equal the viewport width. A row that
   silently overflows or clips content will not show up as a console error.
5. Check the browser console for errors on each page load.
6. Once you're done looking, decide what to do with the data you seeded:
   - If it was only for your own visual check, delete it and confirm the PJP count
     is back to what it was before.
   - If the user asked to see populated data themselves (e.g. "isi beberapa
     perusahaan biar kelihatan"), leave it in the database — don't delete it — and
     say so explicitly, since it only lives in this session's local database, not
     in git.
7. Stop the `php artisan serve` / `npm run dev` background processes when you're
   done, unless the user is actively going to view the running app themselves.

## 4. Documentation

If the change introduces a new architectural pattern, a non-obvious business rule, a
gotcha you had to work around, or a convention future edits should follow, add a
short paragraph to `CLAUDE.md`. Match the existing style: dense, specific, references
real file/method names, explains *why* not just *what*. Don't restate things already
documented there.

## 5. Commit and push

- `git status` before staging anything — review what's actually changed, don't blind
  `git add -A` without looking.
- Write the commit message in Indonesian (matching every prior commit in this repo's
  history — check `git log` if unsure of tone), focused on why the change was made.
- End the commit message with the attribution footer currently in effect for this
  session (check the system reminder for the exact `Co-Authored-By` / session-link
  lines — don't hardcode stale ones).
- Push directly to `main` — this repo has no PR workflow and the owner has
  standing-authorized direct pushes to `main` for this personal project. Don't ask
  for confirmation on every push; do ask before anything destructive (force-push,
  history rewrite, deleting data).
