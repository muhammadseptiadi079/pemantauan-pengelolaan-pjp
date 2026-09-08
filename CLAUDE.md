# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Laravel + Inertia.js + React (TypeScript) app for monitoring and managing Perusahaan Jasa Pertambangan (PJP — mining services companies) through three fixed stages ("tahapan"):

1. Persyaratan, Seleksi, dan Penetapan (`persyaratan-seleksi-penetapan`)
2. Tanggung Jawab, Pemantauan, dan Pelaporan (`tanggung-jawab-pemantauan-pelaporan`)
3. Evaluasi (`evaluasi`)

There is no authentication yet — every route is publicly accessible. This is a known, deliberate gap (see git history) planned to be closed with a login system before the app is used by more than a trusted few.

## Commands

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan storage:link   # required for uploaded PJP documents to be servable
```

Run backend + Vite together:

```bash
composer run dev
```

Or separately:

```bash
php artisan serve
npm run dev       # dev server with HMR
npm run build     # production build (also run this to sanity-check before committing)
```

Tests: `composer test` (aliases `php artisan config:clear && php artisan test`) or `php artisan test --filter=TestName` for a single test. Currently only the Laravel-default `tests/Unit/ExampleTest.php` and `tests/Feature/ExampleTest.php` exist — no feature-specific tests have been written yet.

Type-check the frontend (no separate script defined): `npx tsc --noEmit`.

PHP lint a single file: `php -l path/to/File.php`.

## Architecture

**Data model**: two Eloquent models carry the whole domain.

- `App\Models\Pjp` — a company record. Notable statics: `Pjp::TAHAPAN` and `Pjp::STATUS` are the canonical label maps (keys are the DB values, e.g. `aktif`, `perlu_tindak_lanjut`, `tidak_aktif`); `Pjp::statusCountsFor(?Builder $query)` returns status→count always including every status key; `scopeFilter($search, $status, $tahapan)` is the shared search/filter query logic used by both `PjpController` and `TahapanController` — extend this scope rather than re-adding `->when(...)` chains in a controller.
- `App\Models\PjpLaporan` — an uploaded compliance document belonging to a `Pjp` (`belongsTo`), one of four `jenis` (`PjpLaporan::JENIS`: `spip`, `tsp`, `laporan_bulanan`, `laporan_triwulan`). Business rules live here as model constants/methods, not in the controller:
  - `BATAS_TANGGAL_LAPORAN = 3` — every document type is "tepat waktu" (on time) only if uploaded on or before the 3rd of the month; this is a computed `tepat_waktu` accessor (always present via `$appends`), not a stored column.
  - `BULAN_TRIWULAN_DIBUKA` — Laporan Triwulan can only be uploaded in April/July/October/January (TW1–TW4); `PjpLaporan::triwulanSedangDibuka()` gates the upload endpoint (`PjpLaporanController::store` rejects uploads outside the window) and also drives the frontend (`PjpController::show` passes `triwulanTerbuka` so the upload form is hidden client-side too — both checks must stay in sync if this rule changes).
  - `kesesuaian_isi` (`PjpLaporan::KESESUAIAN`: `sesuai` / `tidak_sesuai` / null) is a manual reviewer judgment set via `PjpLaporanController::update`, independent of the automatic `tepat_waktu` flag.

**Checklist prakualifikasi SMKP** (Tahap 1): `App\Models\SmkpChecklistCategory` (17 rows: `LEGALITAS` + `A`-`P`) and `SmkpChecklistItem` (126 leaf questions, each with a fixed `bobot`) are reference/lookup data seeded once by the data migration `2026_09_07_040003_seed_smkp_checklist_data` from `database/seeders/data/smkp-checklist.json` (parsed from the source prequalification Excel — company branding stripped, "SMK3PLM"/"SMKPLH" normalized to "SMKP") — treat this as fixed reference data, not something to reseed via `db:seed`. `SmkpChecklistAnswer` holds one row per `(pjp_id, smkp_checklist_item_id)` with `jawaban` (Y/T/N/A) and `nilai` (`0`-`3`/`na`), filled in by the PJP itself via `GET|POST /pjp/{pjp}/checklist-smkp` (`SmkpChecklistController`, page `Pjp/ChecklistSmkp.tsx`) — there's no PJP login, so anyone with the link can fill it in, consistent with the rest of the app being unauthenticated. `Pjp::smkpScore()` computes the weighted percentage from answered items (an item with `nilai = 'na'` is excluded from both the score and its bobot denominator; an unanswered item still counts toward the denominator at 0) and maps it to a `kategori_risiko` band (Kritis/Tinggi/Sedang/Rendah/Sangat Rendah — the source document's bands describe the minimum score needed to qualify for a given job-risk level, not the PJP's own riskiness) — the `LEGALITAS` category is a separate pass/fail gate and is excluded from this score entirely. `TahapanController::renderTahapan` attaches `smkpScore` to each PJP only on the `persyaratan-seleksi-penetapan` page, where `PjpMiniList` renders it as a percentage badge.

**Tahapan advancement**: `Pjp::NEXT_TAHAPAN` maps each tahap to the next one (`persyaratan-seleksi-penetapan` → `tanggung-jawab-pemantauan-pelaporan` → `evaluasi`, with `evaluasi` having no successor). `PjpController::advanceTahapan` (route `POST /pjp/{pjp}/advance-tahapan`) is the only way this transition happens through the UI — a plain "Lanjutkan ke ..." button on `Pjp/Show.tsx`, shown whenever `NEXT_TAHAPAN` has an entry for the PJP's current tahapan. Deliberately unconditional: it does **not** check `smkpScore()` or anything else before allowing the move, because management can decide to keep using a PJP even below the expected prequalification score — the score is shown alongside the button for context, not as a gate. (The manual "Ubah Data" edit form can still change `tahapan` directly to any value, bypassing this flow entirely — that's intentional, not a bug to fix.)

**Evaluasi kinerja (Tahap 3)**: `App\Models\PjpEvaluasi` is one row per `(pjp_id, tahun, semester)` (`PjpEvaluasi::SEMESTER`: `1` = Jan-Jun, `2` = Jul-Dec), holding three independent 0-100 scores — `skor_teknis`, `skor_keselamatan_kesehatan`, `skor_lingkungan` — plus a computed `skor_rata_rata` accessor (simple mean of the three, always appended). `PjpEvaluasiController::store` (`POST /pjp/{pjp}/evaluasi`) is an `updateOrCreate` keyed on `(pjp_id, tahun, semester)`, so resubmitting the same semester overwrites it rather than erroring or duplicating — there's no separate edit endpoint. The form (`EvaluasiCard.tsx`) is embedded on `Pjp/Show.tsx` unconditionally (not gated on `tahapan === 'evaluasi'`), same as the Persyaratan PJP checklist button, so evaluation history can be recorded regardless of which tahap the PJP is currently in. `TahapanController::renderTahapan` attaches each PJP's single latest `PjpEvaluasi` (or explicit `null`) as `latestEvaluasi` only on the `evaluasi` page, and `PjpMiniList` renders it as a badge (distinguishing "no evaluation yet" from an evaluation scored 0).

**Per-tahap achievement chart**: each of the 3 tahap pages renders an `AchievementBarChart` — a horizontal bar per PJP, sorted ascending (lowest/most-needs-follow-up first), colored by a fixed 4-band status scale (good/warning/serious/critical, same hex steps as `StatusStackedBar`'s status colors). On the Tahap 2 page the value is `Pjp::pelaporanScore()` — the average of "% laporan tepat waktu" and "% laporan dinilai sesuai" (the latter only counts laporan that have actually been reviewed via `kesesuaian_isi`); returns `null` (rendered as a distinct muted "belum ada laporan" row, never a colored 0%) when the PJP hasn't uploaded anything yet, so "no data" is never visually confused with "scored zero". `Pjp::achievement()` picks the right metric for whatever tahap the PJP is currently in (smkpScore/pelaporanScore/latest evaluasi) — `TahapanController::renderTahapan` calls it for every tahap page's PJP list under the same `achievement: number | null` key, which is what makes one chart component work for all three pages, and `HomeController` reuses the same method to build the cross-tahap "PJP Paling Perlu Perhatian" widget on Beranda (any PJP with `achievement < 80`, sorted ascending, top 5). Each bar/row links to `/pjp/{id}` — the chart doubles as a "who needs follow-up" worklist, not just a summary.

**SMKP score drill-down**: `Pjp::smkpCategoryBreakdown()` returns the same weighted-score calculation as `smkpScore()` but per category (A-P) instead of one total — shown as mini bars on `Pjp/ChecklistSmkp.tsx` so it's obvious which category is dragging the score down, not just the overall percentage. `Pjp::smkpLegalitasStatus()` is a separate `{total, lengkap}` count of the `LEGALITAS` category's items answered `jawaban === 'ya'` (a plain completion count, not a 0-3 score like the rest of the checklist) — shown as a badge on both `ChecklistSmkp.tsx` and `Pjp/Show.tsx`, since Dokumen Legalitas is a pass/fail gate outside the 178-point score.

**Excel export gotcha**: `PjpExport::map()` deliberately renders every score column as a **string** (`'1.5%'`, not the raw float `1.5`) — PhpSpreadsheet/maatwebsite writes a literal numeric `0` as a blank cell (indistinguishable from a genuinely missing value once opened), so a PJP that legitimately scored 0% would render as an empty cell instead of "0%". Casting to string sidesteps this; don't change these back to raw numbers without re-checking that a real zero survives the round-trip.

**Sidebar summary widget**: `HandleInertiaRequests::share()` adds a `sidebarStats` prop (`{total, perluPerhatian}`, both lazy closures) to *every* Inertia response, not just Home's — it's how `Sidebar.tsx` shows a live "Total PJP" + "Perlu Perhatian" badge (linking to `/`) on every page without each controller having to remember to pass it. `Pjp::perluPerhatianCount()` reuses `Pjp::achievement()` the same way `HomeController`'s "PJP Paling Perlu Perhatian" list does, so the sidebar badge count and the Beranda widget never disagree. The `<aside>` is `sticky top-0 h-screen overflow-y-auto` — without that it stretches to match `<main>`'s height (flexbox default `align-items: stretch` on the `flex md:flex-row` root in `AppLayout`), which on any page taller than one screen pushed this widget and the footer off-screen at the bottom of the whole page instead of staying pinned in the visible sidebar.

**Routing → controllers → Inertia pages** (see `routes/web.php`): each route renders a specific `resources/js/Pages/*.tsx` component by name (e.g. `Inertia::render('Pjp/Show', [...])` ↔ `resources/js/Pages/Pjp/Show.tsx`). There's no client-side routing; `TahapanController` has one method per tahapan page, each delegating to shared private helpers so the three "which PJPs are in this stage, with what filters and status breakdown" queries stay consistent.

**File uploads**: `PjpLaporanController::store` saves to the `public` disk under `pjp-laporan/{pjp_id}/...` (served via the `storage:link` symlink) and creates the DB row in the same request. Deleting a `Pjp` (`PjpController::destroy`) explicitly deletes that whole storage subdirectory first — cascading DB deletes alone would silently orphan the files, since the FK `cascadeOnDelete()` only cleans up rows, not disk contents. Deleting a single `PjpLaporan` (`PjpLaporanController::destroy`) removes just that file. Both `update` and `destroy` on `PjpLaporanController` assert `$laporan->pjp_id === $pjp->id` (404 otherwise) to prevent cross-PJP ID-confusion via mismatched route params.

**Exports**: `GET /pjp/export` (query params: `search`/`status`/`tahapan`, same as the index filters) streams an `.xlsx` via `App\Exports\PjpExport` (maatwebsite/excel — `FromCollection`/`WithHeadings`/`WithMapping`). `GET /pjp/{pjp}/export-pdf` renders `resources/views/pdf/pjp-report.blade.php` to PDF via `barryvdh/laravel-dompdf` (`Pdf::loadView(...)->stream(...)`) — this is the one Blade view in the app; everything else is Inertia/React. Both export routes are registered *before* `Route::resource('pjp', ...)` in `routes/web.php` because `/pjp/export` would otherwise be swallowed by the `GET /pjp/{pjp}` show route's route-model-binding.

**Frontend conventions**:
- Every page wraps its content in `<AppLayout>` (`resources/js/Layouts/AppLayout.tsx`), which renders `<Sidebar>` (nav + mobile hamburger drawer, active link matched by path prefix) and `<FlashMessage>`.
- `FlashMessage` listens to Inertia's `router.on('success', ...)` event rather than a `useEffect` keyed on the `flash` prop value — Inertia can hand back a referentially-identical-content `flash` object across two different visits, so a value-dependency effect misses a second identical success message in a row. If you touch flash-message behavior, keep the event-listener approach.
- Shared small components live in `resources/js/Components/`: `PjpFormFields` is the single source of truth for the create/edit form fields (`Pages/Pjp/Create.tsx` and `Edit.tsx` both wrap it — don't re-duplicate fields into the pages), `StatusStackedBar` renders the status-percentage bar chart (fixed color mapping: aktif=green, perlu_tindak_lanjut=amber, tidak_aktif=gray — status colors are intentionally not part of any generic categorical palette), `PjpFilters` is the search/tahapan/status filter bar reused by `Pjp/Index.tsx` and (without the tahapan dropdown) by each tahapan page via `TahapanPjpSection`, `ConfirmDialog` replaces the browser's native `confirm()` for delete actions (controlled via local `useState<T | null>` holding the record pending deletion, not a boolean), `Pagination` renders a Laravel paginator's `links` array (used only by `Pjp/Index.tsx` currently).
- Every page sets its browser tab title via `<Head title="..." />` (`@inertiajs/react`) rendered as the first child inside `<AppLayout>`; the ` - Pemantauan & Pengelolaan PJP` suffix is appended centrally by the `title` callback in `resources/js/app.tsx`, so pass just the page-specific part (e.g. `"Data PJP"`, or a PJP's own name on `Pjp/Show.tsx`).
- `Pjp/Index.tsx` renders two parallel layouts for the same `pjps.data` — a `<table>` (`hidden md:block`) and a stacked card list (`md:hidden`) — instead of one responsive table, since an HTML table's columns don't collapse sensibly at phone widths. Keep both in sync if you change what's shown per row.
- `resources/js/types.ts` holds the shared TypeScript interfaces (`Pjp`, `PjpLaporan`) and option-label maps (`TAHAPAN_OPTIONS`, `STATUS_OPTIONS`, `JENIS_LAPORAN_OPTIONS`, `KESESUAIAN_OPTIONS`) — keep these in sync with the PHP model constants (`Pjp::TAHAPAN`/`STATUS`, `PjpLaporan::JENIS`/`KESESUAIAN`) since nothing currently generates one from the other.
- Path alias `@/*` → `resources/js/*` (configured in both `tsconfig.json` and `vite.config.ts`).

## Known workarounds worth knowing about

`resources/js/app.tsx` casts the `createInertiaApp` `resolve`/`setup` config through `as never` — the installed `@inertiajs/react` (3.7.0) and `laravel-vite-plugin` (3.2.0) type definitions don't line up cleanly for the `resolvePageComponent` + `import.meta.glob` pattern under this TypeScript version (7.x, where `baseUrl` was also removed from `tsconfig` — paths must be written as `./resources/js/*`, not `resources/js/*`). This is a type-level workaround only; behavior matches the standard Inertia+Vite bootstrap.
