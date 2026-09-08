import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import StatusBadge from '@/Components/StatusBadge';
import LaporanUploadCard from '@/Components/LaporanUploadCard';
import EvaluasiCard from '@/Components/EvaluasiCard';
import ConfirmDialog from '@/Components/ConfirmDialog';
import {
    Pjp,
    PjpEvaluasi,
    PjpLaporan,
    SmkpLegalitasStatus,
    SmkpScore,
    TAHAPAN_OPTIONS,
    JENIS_LAPORAN_OPTIONS,
} from '@/types';

export default function Show({
    pjp,
    laporans,
    evaluasis,
    smkpScore,
    legalitasStatus,
    pelaporanScore,
    nextTahapan,
    triwulanTerbuka,
    bulanTriwulanDibuka,
}: {
    pjp: Pjp;
    laporans: PjpLaporan[];
    evaluasis: PjpEvaluasi[];
    smkpScore: SmkpScore;
    legalitasStatus: SmkpLegalitasStatus;
    pelaporanScore: number | null;
    nextTahapan: string | null;
    triwulanTerbuka: boolean;
    bulanTriwulanDibuka: string;
}) {
    const [confirmAdvance, setConfirmAdvance] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const advance = () => {
        router.post(`/pjp/${pjp.id}/advance-tahapan`, {}, { preserveScroll: true });
        setConfirmAdvance(false);
    };

    const destroy = () => {
        router.delete(`/pjp/${pjp.id}`);
        setConfirmDelete(false);
    };

    return (
        <AppLayout>
            <Head title={pjp.nama_perusahaan} />
            <div className="mx-auto max-w-3xl px-6 py-16">
                <div className="mb-8 flex items-start justify-between gap-4">
                    <PageHeader
                        title={pjp.nama_perusahaan}
                        description={TAHAPAN_OPTIONS[pjp.tahapan] ?? pjp.tahapan}
                    />
                    <div className="flex shrink-0 gap-2">
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

                <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-slate-200 bg-white p-5 text-sm">
                    <StatusBadge status={pjp.status} />
                    <span className="text-slate-600">
                        Persyaratan PJP: {smkpScore.persentase}%
                    </span>
                    <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            legalitasStatus.lengkap === legalitasStatus.total
                                ? 'bg-green-50 text-green-700'
                                : 'bg-amber-50 text-amber-700'
                        }`}
                    >
                        Dokumen Legalitas: {legalitasStatus.lengkap}/{legalitasStatus.total}
                    </span>
                    <span className="text-slate-600">
                        Kepatuhan Pelaporan:{' '}
                        {pelaporanScore !== null ? `${pelaporanScore}%` : 'Belum ada laporan'}
                    </span>
                    {pjp.nib && (
                        <span className="text-slate-600">NIB: {pjp.nib}</span>
                    )}
                    {pjp.penanggung_jawab && (
                        <span className="text-slate-600">
                            Penanggung Jawab: {pjp.penanggung_jawab}
                        </span>
                    )}
                    {nextTahapan && (
                        <button
                            type="button"
                            onClick={() => setConfirmAdvance(true)}
                            className="ml-auto rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                        >
                            Lanjutkan ke {TAHAPAN_OPTIONS[nextTahapan] ?? nextTahapan} &rarr;
                        </button>
                    )}
                </div>

                {pjp.catatan && (
                    <div className="mb-10 rounded-xl border border-amber-200 bg-amber-50 p-5">
                        <h2 className="text-sm font-semibold text-amber-900">Catatan</h2>
                        <p className="mt-1 whitespace-pre-line text-sm text-amber-800">
                            {pjp.catatan}
                        </p>
                    </div>
                )}

                <h2 className="mb-4 text-lg font-semibold text-slate-900">
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

                <h2 className="mb-4 mt-10 text-lg font-semibold text-slate-900">
                    Evaluasi Kinerja
                </h2>
                <EvaluasiCard pjpId={pjp.id} evaluasis={evaluasis} />
            </div>

            <ConfirmDialog
                open={confirmAdvance}
                title="Lanjutkan Tahap"
                message={`Lanjutkan "${pjp.nama_perusahaan}" ke tahap "${nextTahapan ? TAHAPAN_OPTIONS[nextTahapan] ?? nextTahapan : ''}"? Perpindahan ini tidak memerlukan skor minimum tertentu — bisa dilanjutkan sesuai keputusan manajemen.`}
                confirmLabel="Lanjutkan"
                variant="primary"
                onConfirm={advance}
                onCancel={() => setConfirmAdvance(false)}
            />

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
