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

**Routing → controllers → Inertia pages** (see `routes/web.php`): each route renders a specific `resources/js/Pages/*.tsx` component by name (e.g. `Inertia::render('Pjp/Show', [...])` ↔ `resources/js/Pages/Pjp/Show.tsx`). There's no client-side routing; `TahapanController` has one method per tahapan page, each delegating to shared private helpers so the three "which PJPs are in this stage, with what filters and status breakdown" queries stay consistent.

**File uploads**: `PjpLaporanController::store` saves to the `public` disk under `pjp-laporan/{pjp_id}/...` (served via the `storage:link` symlink) and creates the DB row in the same request. Deleting a `Pjp` (`PjpController::destroy`) explicitly deletes that whole storage subdirectory first — cascading DB deletes alone would silently orphan the files, since the FK `cascadeOnDelete()` only cleans up rows, not disk contents. Deleting a single `PjpLaporan` (`PjpLaporanController::destroy`) removes just that file. Both `update` and `destroy` on `PjpLaporanController` assert `$laporan->pjp_id === $pjp->id` (404 otherwise) to prevent cross-PJP ID-confusion via mismatched route params.

**Exports**: `GET /pjp/export` (query params: `search`/`status`/`tahapan`, same as the index filters) streams an `.xlsx` via `App\Exports\PjpExport` (maatwebsite/excel — `FromCollection`/`WithHeadings`/`WithMapping`). `GET /pjp/{pjp}/export-pdf` renders `resources/views/pdf/pjp-report.blade.php` to PDF via `barryvdh/laravel-dompdf` (`Pdf::loadView(...)->stream(...)`) — this is the one Blade view in the app; everything else is Inertia/React. Both export routes are registered *before* `Route::resource('pjp', ...)` in `routes/web.php` because `/pjp/export` would otherwise be swallowed by the `GET /pjp/{pjp}` show route's route-model-binding.

**Frontend conventions**:
- Every page wraps its content in `<AppLayout>` (`resources/js/Layouts/AppLayout.tsx`), which renders `<Sidebar>` (nav + mobile hamburger drawer, active link matched by path prefix) and `<FlashMessage>`.
- `FlashMessage` listens to Inertia's `router.on('success', ...)` event rather than a `useEffect` keyed on the `flash` prop value — Inertia can hand back a referentially-identical-content `flash` object across two different visits, so a value-dependency effect misses a second identical success message in a row. If you touch flash-message behavior, keep the event-listener approach.
- Shared small components live in `resources/js/Components/`: `PjpFormFields` is the single source of truth for the create/edit form fields (`Pages/Pjp/Create.tsx` and `Edit.tsx` both wrap it — don't re-duplicate fields into the pages), `StatusStackedBar` renders the status-percentage bar chart (fixed color mapping: aktif=green, perlu_tindak_lanjut=amber, tidak_aktif=gray — status colors are intentionally not part of any generic categorical palette), `PjpFilters` is the search/tahapan/status filter bar reused by `Pjp/Index.tsx` and (without the tahapan dropdown) by each tahapan page via `TahapanPjpSection`.
- `resources/js/types.ts` holds the shared TypeScript interfaces (`Pjp`, `PjpLaporan`) and option-label maps (`TAHAPAN_OPTIONS`, `STATUS_OPTIONS`, `JENIS_LAPORAN_OPTIONS`, `KESESUAIAN_OPTIONS`) — keep these in sync with the PHP model constants (`Pjp::TAHAPAN`/`STATUS`, `PjpLaporan::JENIS`/`KESESUAIAN`) since nothing currently generates one from the other.
- Path alias `@/*` → `resources/js/*` (configured in both `tsconfig.json` and `vite.config.ts`).

## Known workarounds worth knowing about

`resources/js/app.tsx` casts the `createInertiaApp` `resolve`/`setup` config through `as never` — the installed `@inertiajs/react` (3.7.0) and `laravel-vite-plugin` (3.2.0) type definitions don't line up cleanly for the `resolvePageComponent` + `import.meta.glob` pattern under this TypeScript version (7.x, where `baseUrl` was also removed from `tsconfig` — paths must be written as `./resources/js/*`, not `resources/js/*`). This is a type-level workaround only; behavior matches the standard Inertia+Vite bootstrap.
