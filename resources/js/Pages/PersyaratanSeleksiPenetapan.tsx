import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import PlaceholderCard from '@/Components/PlaceholderCard';
import TahapanPjpSection from '@/Components/TahapanPjpSection';
import StatusStackedBar, { StatusCounts } from '@/Components/StatusStackedBar';
import { SmkpScore } from '@/types';

type MiniPjp = {
    id: number;
    nama_perusahaan: string;
    status: string;
    smkpScore?: SmkpScore;
};

const subTahapan = [
    {
        title: 'Persyaratan',
        description: 'Kelengkapan dokumen dan syarat administratif calon PJP.',
    },
    {
        title: 'Seleksi',
        description: 'Proses penilaian dan seleksi calon PJP.',
    },
    {
        title: 'Penetapan',
        description: 'Penetapan resmi PJP yang lolos proses seleksi.',
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
                    title="1. Persyaratan, Seleksi, dan Penetapan"
                    description="Tahapan awal pengelolaan Perusahaan Jasa Pertambangan (PJP), mencakup pemeriksaan persyaratan, proses seleksi, hingga penetapan resmi."
                />

                <div className="mb-10">
                    <StatusStackedBar
                        title="Capaian Status pada Tahap Ini"
                        counts={statusCounts}
                    />
                </div>

                <section className="mb-14 grid gap-4 sm:grid-cols-3">
                    {subTahapan.map((sub) => (
                        <PlaceholderCard
                            key={sub.title}
                            title={sub.title}
                            description={sub.description}
                        />
                    ))}
                </section>

                <div className="mb-14 rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm text-blue-900">
                    <p className="font-semibold">Checklist Prakualifikasi SMKP</p>
                    <p className="mt-1">
                        Setiap PJP wajib mengisi checklist prakualifikasi SMKP (17 kategori,
                        126 pertanyaan berbobot) untuk menunjukkan tingkat kepatuhannya.
                        Klik salah satu PJP pada daftar di bawah, lalu buka tombol{' '}
                        <strong>&quot;Checklist SMKP&quot;</strong> di halaman detailnya untuk
                        mengisi atau melihat skornya. Persentase skor tiap PJP juga
                        ditampilkan langsung pada daftar di bawah ini.
                    </p>
                </div>

                <TahapanPjpSection
                    tahapan="persyaratan-seleksi-penetapan"
                    action="/persyaratan-seleksi-penetapan"
                    pjps={pjps}
                    filters={filters}
                />
            </div>
        </AppLayout>
    );
}
