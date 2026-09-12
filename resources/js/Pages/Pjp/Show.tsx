import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import StatusBadge from '@/Components/StatusBadge';
import LaporanUploadCard from '@/Components/LaporanUploadCard';
import EvaluasiCard from '@/Components/EvaluasiCard';
import CatatanHistoryCard from '@/Components/CatatanHistoryCard';
import ConfirmDialog from '@/Components/ConfirmDialog';
import BackButton from '@/Components/BackButton';
import AnimatedNumber from '@/Components/AnimatedNumber';
import { TahapIcon } from '@/Components/TahapIcons';
import {
    Pjp,
    PjpCatatan,
    PjpEvaluasi,
    PjpLaporan,
    SmkpLegalitasStatus,
    SmkpScore,
    JENIS_LAPORAN_OPTIONS,
} from '@/types';

function scoreColor(value: number): string {
    if (value >= 80) return 'text-green-700';
    if (value >= 60) return 'text-blue-700';
    if (value >= 40) return 'text-amber-700';
    return 'text-red-700';
}

function decimalsFor(value: number): number {
    return Number.isInteger(value) ? 0 : 1;
}

function StatTile({
    icon,
    label,
    value,
    suffix = '',
    valueColorClass,
}: {
    icon: string;
    label: string;
    value: number | null;
    suffix?: string;
    valueColorClass: string;
}) {
    return (
        <div className="rounded-lg p-2 transition-colors hover:bg-slate-50">
            <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                <TahapIcon name={icon} className="h-4 w-4" />
            </div>
            <p className="text-xs text-slate-500">{label}</p>
            <p className={`mt-0.5 text-xl font-bold ${valueColorClass}`}>
                {value !== null ? (
                    <>
                        <AnimatedNumber value={value} decimals={decimalsFor(value)} />
                        {suffix}
                    </>
                ) : (
                    '—'
                )}
            </p>
        </div>
    );
}

export default function Show({
    pjp,
    laporans,
    evaluasis,
    catatans,
    smkpScore,
    legalitasStatus,
    pelaporanScore,
    triwulanTerbuka,
    bulanTriwulanDibuka,
}: {
    pjp: Pjp;
    laporans: PjpLaporan[];
    evaluasis: PjpEvaluasi[];
    catatans: PjpCatatan[];
    smkpScore: SmkpScore;
    legalitasStatus: SmkpLegalitasStatus;
    pelaporanScore: number | null;
    triwulanTerbuka: boolean;
    bulanTriwulanDibuka: string;
}) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const destroy = () => {
        router.delete(`/pjp/${pjp.id}`);
        setConfirmDelete(false);
    };

    const latestEvaluasi = evaluasis[0] ?? null;

    return (
        <AppLayout>
            <Head title={pjp.nama_perusahaan} />
            <div className="mx-auto max-w-3xl px-6 py-16">
                <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                    <PageHeader
                        title={pjp.nama_perusahaan}
                        description="Perusahaan Jasa Pertambangan (PJP) yang dipantau melalui checklist persyaratan, pelaporan, dan evaluasi kinerja."
                        icon="building"
                    />
                    <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:shrink-0 sm:justify-end">
                        <BackButton />
                        <Link
                            href={`/pjp/${pjp.id}/checklist-smkp`}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Persyaratan PJP
                        </Link>
                        <a
                            href={`/pjp/${pjp.id}/export-pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Export PDF
                        </a>
                        <Link
                            href={`/pjp/${pjp.id}/edit`}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Ubah Data
                        </Link>
                        <button
                            type="button"
                            onClick={() => setConfirmDelete(true)}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                            Hapus
                        </button>
                    </div>
                </div>

                <div className="glass-card mb-6 p-5">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                        <StatusBadge status={pjp.status} />
                        {pjp.nib && <span className="text-slate-600">NIB: {pjp.nib}</span>}
                        {pjp.penanggung_jawab && (
                            <span className="text-slate-600">
                                Penanggung Jawab: {pjp.penanggung_jawab}
                            </span>
                        )}
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-5 sm:grid-cols-4">
                        <StatTile
                            icon="persyaratan"
                            label="Persyaratan PJP"
                            value={smkpScore.persentase}
                            suffix="%"
                            valueColorClass={scoreColor(smkpScore.persentase)}
                        />
                        <StatTile
                            icon="legalitas"
                            label="Dokumen Legalitas"
                            value={legalitasStatus.lengkap}
                            suffix={`/${legalitasStatus.total}`}
                            valueColorClass={
                                legalitasStatus.lengkap === legalitasStatus.total
                                    ? 'text-green-700'
                                    : 'text-amber-700'
                            }
                        />
                        <StatTile
                            icon="tanggungjawab"
                            label="Kepatuhan Pelaporan"
                            value={pelaporanScore}
                            suffix="%"
                            valueColorClass={pelaporanScore !== null ? scoreColor(pelaporanScore) : 'text-slate-300'}
                        />
                        <StatTile
                            icon="evaluasi"
                            label="Evaluasi Terakhir"
                            value={latestEvaluasi?.skor_rata_rata ?? null}
                            valueColorClass={
                                latestEvaluasi ? scoreColor(latestEvaluasi.skor_rata_rata) : 'text-slate-300'
                            }
                        />
                    </div>
                </div>

                {pjp.catatan && (
                    <div className="mb-10 rounded-2xl border border-amber-200/70 bg-amber-50/60 p-5 shadow-lg shadow-amber-100/40 backdrop-blur-xl">
                        <h2 className="text-sm font-semibold text-amber-900">Catatan</h2>
                        <p className="mt-1 whitespace-pre-line text-sm text-amber-800">
                            {pjp.catatan}
                        </p>
                    </div>
                )}

                <div className="mb-10">
                    <CatatanHistoryCard pjpId={pjp.id} catatans={catatans} />
                </div>

                <h2 className="mb-4 flex items-center gap-2.5 text-lg font-semibold text-slate-900">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                        <TahapIcon name="document" className="h-4 w-4" />
                    </span>
                    Dokumen &amp; Laporan
                </h2>
                <div className="space-y-4">
                    {Object.entries(JENIS_LAPORAN_OPTIONS).map(([jenis, label]) => (
                        <LaporanUploadCard
                            key={jenis}
                            pjpId={pjp.id}
                            jenis={jenis}
                            label={label}
                            laporans={laporans.filter((l) => l.jenis === jenis)}
                            uploadDisabledMessage={
                                jenis === 'laporan_triwulan' && !triwulanTerbuka
                                    ? `Laporan Triwulan hanya bisa diunggah pada bulan ${bulanTriwulanDibuka}.`
                                    : undefined
                            }
                        />
                    ))}
                </div>

                <h2 className="mb-4 mt-10 flex items-center gap-2.5 text-lg font-semibold text-slate-900">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                        <TahapIcon name="evaluasi" className="h-4 w-4" />
                    </span>
                    Evaluasi Kinerja
                </h2>
                <EvaluasiCard pjpId={pjp.id} evaluasis={evaluasis} />
            </div>

            <ConfirmDialog
                open={confirmDelete}
                title="Hapus Data PJP"
                message={`Hapus data PJP "${pjp.nama_perusahaan}"? Semua dokumen, checklist, dan evaluasi terkait akan ikut terhapus. Tindakan ini tidak bisa dibatalkan.`}
                onConfirm={destroy}
                onCancel={() => setConfirmDelete(false)}
            />
        </AppLayout>
    );
}
