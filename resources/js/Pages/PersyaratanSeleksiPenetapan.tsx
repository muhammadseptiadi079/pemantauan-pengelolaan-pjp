import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import PlaceholderCard from '@/Components/PlaceholderCard';
import TahapanPjpSection from '@/Components/TahapanPjpSection';
import StatusStackedBar, { StatusCounts } from '@/Components/StatusStackedBar';
import AchievementBarChart from '@/Components/AchievementBarChart';
import { TahapIcon } from '@/Components/TahapIcons';
import { SmkpScore } from '@/types';

type MiniPjp = {
    id: number;
    nama_perusahaan: string;
    status: string;
    smkpScore?: SmkpScore;
    achievement: number | null;
};

const subTahapan = [
    {
        title: 'Persyaratan',
        description: 'Kelengkapan dokumen dan syarat administratif calon PJP.',
        icon: 'persyaratan',
    },
    {
        title: 'Seleksi',
        description: 'Proses penilaian dan seleksi calon PJP.',
        icon: 'target',
    },
    {
        title: 'Penetapan',
        description: 'Penetapan resmi PJP yang lolos proses seleksi.',
        icon: 'legalitas',
    },
];

export default function PersyaratanSeleksiPenetapan({
    pjps,
    filters,
    statusCounts,
}: {
    pjps: MiniPjp[];
    filters: { search: string; status: string };
    statusCounts: StatusCounts;
}) {
    return (
        <AppLayout>
            <Head title="Persyaratan, Seleksi, dan Penetapan" />
            <div className="mx-auto max-w-5xl px-6 py-16">
                <PageHeader
                    title="Persyaratan, Seleksi, dan Penetapan"
                    description="Tahapan awal pengelolaan Perusahaan Jasa Pertambangan (PJP), mencakup pemeriksaan persyaratan, proses seleksi, hingga penetapan resmi."
                    icon="persyaratan"
                />

                <div className="mb-6">
                    <StatusStackedBar
                        title="Capaian Status Seluruh PJP"
                        counts={statusCounts}
                    />
                </div>

                <div className="mb-14">
                    <AchievementBarChart
                        title="Capaian Persyaratan PJP per Perusahaan"
                        emptyMessage="Belum ada data PJP."
                        noDataLabel="Belum diisi"
                        items={pjps.map((pjp) => ({
                            id: pjp.id,
                            label: pjp.nama_perusahaan,
                            value: pjp.achievement,
                        }))}
                    />
                </div>

                <section className="mb-14 grid gap-4 sm:grid-cols-3">
                    {subTahapan.map((sub) => (
                        <PlaceholderCard
                            key={sub.title}
                            title={sub.title}
                            description={sub.description}
                            icon={sub.icon}
                        />
                    ))}
                </section>

                <div className="mb-14 rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm text-blue-900">
                    <p className="flex items-center gap-2.5 font-semibold">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-700">
                            <TahapIcon name="persyaratan" className="h-3.5 w-3.5" />
                        </span>
                        Persyaratan PJP
                    </p>
                    <p className="mt-1">
                        Setiap PJP wajib mengisi checklist prakualifikasi SMKP (17 kategori,
                        126 pertanyaan berbobot) untuk menunjukkan tingkat kepatuhannya.
                        Klik salah satu PJP pada daftar di bawah, lalu buka tombol{' '}
                        <strong>&quot;Persyaratan PJP&quot;</strong> di halaman detailnya untuk
                        mengisi atau melihat skornya. Persentase skor tiap PJP juga
                        ditampilkan langsung pada daftar di bawah ini.
                    </p>
                </div>

                <TahapanPjpSection
                    action="/persyaratan-seleksi-penetapan"
                    pjps={pjps}
                    filters={filters}
                />
            </div>
        </AppLayout>
    );
}
