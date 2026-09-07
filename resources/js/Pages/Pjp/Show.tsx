import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import StatusBadge from '@/Components/StatusBadge';
import LaporanUploadCard from '@/Components/LaporanUploadCard';
import { Pjp, PjpLaporan, TAHAPAN_OPTIONS, JENIS_LAPORAN_OPTIONS } from '@/types';

export default function Show({
    pjp,
    laporans,
    triwulanTerbuka,
    bulanTriwulanDibuka,
}: {
    pjp: Pjp;
    laporans: PjpLaporan[];
    triwulanTerbuka: boolean;
    bulanTriwulanDibuka: string;
}) {
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
                    </div>
                </div>

                <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-slate-200 bg-white p-5 text-sm">
                    <StatusBadge status={pjp.status} />
                    {pjp.nib && (
                        <span className="text-slate-600">NIB: {pjp.nib}</span>
                    )}
                    {pjp.penanggung_jawab && (
                        <span className="text-slate-600">
                            Penanggung Jawab: {pjp.penanggung_jawab}
                        </span>
                    )}
                </div>

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
            </div>
        </AppLayout>
    );
}
