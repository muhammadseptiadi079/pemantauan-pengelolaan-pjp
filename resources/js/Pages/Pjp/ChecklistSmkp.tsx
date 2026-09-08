import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import AnimatedNumber from '@/Components/AnimatedNumber';
import Spinner from '@/Components/Spinner';
import SmkpDonutChart from '@/Components/SmkpDonutChart';
import { TahapIcon } from '@/Components/TahapIcons';
import {
    SmkpCategoryBreakdown,
    SmkpChecklistAnswer,
    SmkpChecklistCategory,
    SmkpLegalitasStatus,
    SmkpScore,
    SMKP_JAWABAN_OPTIONS,
    SMKP_NILAI_OPTIONS,
} from '@/types';

type JawabanForm = {
    item_id: number;
    jawaban: string;
    nilai: string;
    penjelasan: string;
};

function scoreColor(persentase: number): string {
    if (persentase > 75) return 'text-green-700';
    if (persentase >= 55) return 'text-blue-700';
    if (persentase >= 36) return 'text-amber-700';
    return 'text-red-700';
}

function barColor(persentase: number): string {
    if (persentase >= 80) return '#0ca30c';
    if (persentase >= 60) return '#fab219';
    if (persentase >= 40) return '#ec835a';
    return '#d03b3b';
}

function decimalsFor(value: number): number {
    return Number.isInteger(value) ? 0 : 1;
}

const DONUT_R = 28;
const DONUT_STROKE = 9;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_R;

function CategoryDonut({
    category,
    grown,
    onClick,
}: {
    category: SmkpCategoryBreakdown;
    grown: boolean;
    onClick: () => void;
}) {
    const filled = grown ? Math.max((category.persentase / 100) * DONUT_CIRCUMFERENCE, 2) : 0;

    return (
        <button
            type="button"
            onClick={onClick}
            title={`${category.kode}. ${category.nama}: ${category.persentase}%`}
            className="row-in flex flex-col items-center gap-1.5 rounded-lg p-2 text-center transition-colors hover:bg-slate-50"
        >
            <svg viewBox="0 0 72 72" className="h-16 w-16">
                <circle cx="36" cy="36" r={DONUT_R} fill="none" stroke="#e2e8f0" strokeWidth={DONUT_STROKE} />
                <circle
                    cx="36"
                    cy="36"
                    r={DONUT_R}
                    fill="none"
                    stroke={barColor(category.persentase)}
                    strokeWidth={DONUT_STROKE}
                    strokeLinecap="round"
                    strokeDasharray={`${filled} ${DONUT_CIRCUMFERENCE}`}
                    transform="rotate(-90 36 36)"
                    style={{ transition: 'stroke-dasharray 0.7s ease-out' }}
                />
                <text x="36" y="40" textAnchor="middle" className="fill-slate-900 font-semibold" style={{ fontSize: '13px' }}>
                    {decimalsFor(category.persentase) === 0
                        ? Math.round(category.persentase)
                        : category.persentase}
                    %
                </text>
            </svg>
            <span className="text-xs font-semibold text-slate-500">{category.kode}</span>
        </button>
    );
}

export default function ChecklistSmkp({
    pjp,
    categories,
    answers,
    score,
    categoryBreakdown,
    legalitasStatus,
}: {
    pjp: { id: number; nama_perusahaan: string };
    categories: SmkpChecklistCategory[];
    answers: Record<number, SmkpChecklistAnswer>;
    score: SmkpScore;
    categoryBreakdown: SmkpCategoryBreakdown[];
    legalitasStatus: SmkpLegalitasStatus;
}) {
    const initial: Record<number, JawabanForm> = {};
    categories.forEach((category) =>
        category.items.forEach((item) => {
            const answer = answers[item.id];
            initial[item.id] = {
                item_id: item.id,
                jawaban: answer?.jawaban ?? '',
                nilai: answer?.nilai ?? '',
                penjelasan: answer?.penjelasan ?? '',
            };
        }),
    );

    const { data, setData, post, processing } = useForm<{
        jawaban: Record<number, JawabanForm>;
    }>({ jawaban: initial });

    const [grown, setGrown] = useState(false);
    useEffect(() => {
        const frame = requestAnimationFrame(() => setGrown(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    const setField = (
        itemId: number,
        field: 'jawaban' | 'nilai' | 'penjelasan',
        value: string,
    ) => {
        setData('jawaban', {
            ...data.jawaban,
            [itemId]: { ...data.jawaban[itemId], [field]: value },
        });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/pjp/${pjp.id}/checklist-smkp`, { preserveScroll: true });
    };

    const weakestCategory =
        categoryBreakdown.length > 0
            ? [...categoryBreakdown].sort((a, b) => a.persentase - b.persentase)[0]
            : null;

    const scrollToBreakdown = () => {
        document
            .getElementById('rincian-skor-kategori')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const openCategory = (kode: string) => {
        const el = document.getElementById(`kategori-${kode}`);
        if (el instanceof HTMLDetailsElement) {
            el.open = true;
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const scrollToWeakestCategory = () => {
        if (weakestCategory) openCategory(weakestCategory.kode);
    };

    return (
        <AppLayout>
            <Head title={`Persyaratan PJP - ${pjp.nama_perusahaan}`} />
            <div className="mx-auto max-w-4xl px-6 py-16">
                <div className="mb-8 flex items-start justify-between gap-4">
                    <PageHeader
                        title="Persyaratan PJP"
                        description={pjp.nama_perusahaan}
                        icon="persyaratan"
                    />
                    <Link
                        href={`/pjp/${pjp.id}`}
                        className="shrink-0 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        &larr; Kembali
                    </Link>
                </div>

                <div className="glass-card mb-8 grid gap-4 p-5 sm:grid-cols-3">
                    <div>
                        <span className="mb-2 flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                            <TahapIcon name="persyaratan" className="h-4 w-4" />
                        </span>
                        <p className="text-sm text-slate-500">Total Skor</p>
                        <p className="mt-1 text-2xl font-bold text-slate-900">
                            <AnimatedNumber
                                value={score.total_skor}
                                decimals={decimalsFor(score.total_skor)}
                            />{' '}
                            / {score.total_bobot}
                        </p>
                    </div>
                    <div>
                        <span className="mb-2 flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                            <TahapIcon name="check" className="h-4 w-4" />
                        </span>
                        <p className="text-sm text-slate-500">Persentase Kepatuhan</p>
                        <p
                            className={`mt-1 text-2xl font-bold ${scoreColor(score.persentase)}`}
                        >
                            <AnimatedNumber
                                value={score.persentase}
                                decimals={decimalsFor(score.persentase)}
                            />
                            %
                        </p>
                    </div>
                    <div>
                        <span className="mb-2 flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                            <TahapIcon name="alert" className="h-4 w-4" />
                        </span>
                        <p className="text-sm text-slate-500">
                            Layak untuk Pekerjaan Risiko
                        </p>
                        <p
                            className={`mt-1 text-2xl font-bold ${scoreColor(score.persentase)}`}
                        >
                            {score.kategori_risiko}
                        </p>
                    </div>
                </div>

                <div className="glass-card mb-6 p-5">
                    <div className="mb-3 flex items-center gap-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                            <TahapIcon name="check" className="h-4 w-4" />
                        </span>
                        <h3 className="text-sm font-semibold text-slate-900">
                            Kelengkapan Checklist
                        </h3>
                    </div>
                    <SmkpDonutChart
                        persentase={score.persentase}
                        onAchievedClick={scrollToBreakdown}
                        onGapClick={weakestCategory ? scrollToWeakestCategory : undefined}
                    />
                </div>

                <div className="glass-card mb-6 flex flex-wrap items-center justify-between gap-3 p-4">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                            <TahapIcon name="legalitas" className="h-4 w-4" />
                        </span>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                Dokumen Legalitas (syarat wajib)
                            </p>
                            <p className="text-xs text-slate-500">
                                Terpisah dari skor 178 di atas — harus lengkap semua.
                            </p>
                        </div>
                    </div>
                    <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                            legalitasStatus.lengkap === legalitasStatus.total
                                ? 'bg-green-50 text-green-700'
                                : 'bg-amber-50 text-amber-700'
                        }`}
                    >
                        {legalitasStatus.lengkap} / {legalitasStatus.total} Lengkap
                    </span>
                </div>

                <div id="rincian-skor-kategori" className="glass-card mb-6 p-5">
                    <div className="mb-3 flex items-center gap-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                            <TahapIcon name="persyaratan" className="h-4 w-4" />
                        </span>
                        <h3 className="text-sm font-semibold text-slate-900">
                            Rincian Skor per Kategori
                        </h3>
                    </div>
                    <p className="mb-3 text-xs text-slate-500">
                        Klik salah satu donat untuk langsung membuka kategori itu di
                        formulir checklist di bawah.
                    </p>
                    <div className="grid grid-cols-3 gap-1 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                        {categoryBreakdown.map((category, index) => (
                            <div
                                key={category.kode}
                                style={{ animationDelay: `${Math.min(index, 16) * 30}ms` }}
                            >
                                <CategoryDonut
                                    category={category}
                                    grown={grown}
                                    onClick={() => openCategory(category.kode)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <p className="mb-6 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    Kolom <strong>Nilai</strong> menentukan skor (0 = tidak ada, 1 =
                    belum terpenuhi, 2 = cukup memadai perlu perbaikan, 3 = sudah
                    memadai, N/A = tidak berlaku). Kategori{' '}
                    <strong>Dokumen Legalitas</strong> adalah syarat wajib terpisah dan
                    tidak dihitung dalam skor di atas.
                </p>

                <form onSubmit={submit} className="space-y-4">
                    {categories.map((category) => (
                        <details
                            key={category.id}
                            id={`kategori-${category.kode}`}
                            className="glass-card group"
                            open={category.kode === 'LEGALITAS'}
                        >
                            <summary className="flex cursor-pointer items-center justify-between gap-3 p-4 text-sm font-semibold text-slate-900">
                                <span className="flex items-center gap-2.5">
                                    {category.kode === 'LEGALITAS' && (
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                                            <TahapIcon name="legalitas" className="h-4 w-4" />
                                        </span>
                                    )}
                                    <span>
                                        {category.kode !== 'LEGALITAS' && `${category.kode}. `}
                                        {category.nama}
                                    </span>
                                </span>
                                <span className="flex shrink-0 items-center gap-2">
                                    {category.kode !== 'LEGALITAS' && (
                                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                                            Bobot {category.bobot}
                                        </span>
                                    )}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </span>
                            </summary>
                            <div className="space-y-5 border-t border-slate-100 p-4">
                                {category.items.map((item, index) => {
                                    const showGrup =
                                        item.grup_kode &&
                                        category.items[index - 1]?.grup_kode !==
                                            item.grup_kode;
                                    const value = data.jawaban[item.id];

                                    return (
                                        <div key={item.id}>
                                            {showGrup && (
                                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                    {item.grup_kode} &middot; {item.grup_nama}
                                                </p>
                                            )}
                                            <div className="rounded-lg border border-slate-100 p-3">
                                                <p className="whitespace-pre-line text-sm font-medium text-slate-800">
                                                    {item.nomor}. {item.pertanyaan}
                                                </p>
                                                {item.petunjuk && (
                                                    <p className="mt-1 whitespace-pre-line text-xs italic text-slate-400">
                                                        {item.petunjuk}
                                                    </p>
                                                )}
                                                <div className="mt-3 grid gap-2 sm:grid-cols-[100px_1fr_2fr]">
                                                    <select
                                                        value={value.jawaban}
                                                        onChange={(e) =>
                                                            setField(item.id, 'jawaban', e.target.value)
                                                        }
                                                        className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                                                    >
                                                        <option value="">Jawaban</option>
                                                        {Object.entries(SMKP_JAWABAN_OPTIONS).map(
                                                            ([val, label]) => (
                                                                <option key={val} value={val}>
                                                                    {label}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                    {category.kode !== 'LEGALITAS' && (
                                                        <select
                                                            value={value.nilai}
                                                            onChange={(e) =>
                                                                setField(item.id, 'nilai', e.target.value)
                                                            }
                                                            className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                                                        >
                                                            <option value="">Nilai</option>
                                                            {Object.entries(SMKP_NILAI_OPTIONS).map(
                                                                ([val, label]) => (
                                                                    <option key={val} value={val}>
                                                                        {label}
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                    )}
                                                    <input
                                                        type="text"
                                                        placeholder="Penjelasan (opsional)"
                                                        value={value.penjelasan}
                                                        onChange={(e) =>
                                                            setField(
                                                                item.id,
                                                                'penjelasan',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </details>
                    ))}

                    <div className="sticky bottom-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing && <Spinner />}
                            Simpan Checklist
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
