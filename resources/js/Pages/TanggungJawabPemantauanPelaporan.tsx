import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import PlaceholderCard from '@/Components/PlaceholderCard';
import TahapanPjpSection from '@/Components/TahapanPjpSection';
import StatusStackedBar, { StatusCounts } from '@/Components/StatusStackedBar';
import AchievementBarChart from '@/Components/AchievementBarChart';

type MiniPjp = {
    id: number;
    nama_perusahaan: string;
    status: string;
    achievement: number | null;
};

const subTahapan = [
    {
        title: 'Tanggung Jawab',
        description: 'Pembagian tanggung jawab PJP dalam menjalankan operasinya.',
        icon: 'tanggungjawab',
    },
    {
        title: 'Pemantauan',
        description: 'Pemantauan berkala terhadap kinerja dan kepatuhan PJP.',
        icon: 'check',
    },
    {
        title: 'Pelaporan',
        description: 'Pelaporan hasil pemantauan dan kondisi terkini PJP.',
        icon: 'document',
    },
];

export default function TanggungJawabPemantauanPelaporan({
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
            <Head title="Tanggung Jawab, Pemantauan, dan Pelaporan" />
            <div className="mx-auto max-w-5xl px-6 py-16">
                <PageHeader
                    title="Tanggung Jawab, Pemantauan, dan Pelaporan"
                    description="Tahapan pengelolaan berkelanjutan PJP, mencakup tanggung jawab operasional, pemantauan rutin, dan pelaporan hasil pemantauan."
                    icon="tanggungjawab"
                />

                <div className="mb-6">
                    <StatusStackedBar
                        title="Capaian Status Seluruh PJP"
                        counts={statusCounts}
                    />
                </div>

                <div className="mb-10">
                    <AchievementBarChart
                        title="Kepatuhan Pelaporan per Perusahaan"
                        emptyMessage="Belum ada data PJP."
                        noDataLabel="Belum ada laporan"
                        items={pjps.map((pjp) => ({
                            id: pjp.id,
                            label: pjp.nama_perusahaan,
                            value: pjp.achievement,
                        }))}
                    />
                </div>

                <section className="grid gap-4 sm:grid-cols-3">
                    {subTahapan.map((sub) => (
                        <PlaceholderCard
                            key={sub.title}
                            title={sub.title}
                            description={sub.description}
                            icon={sub.icon}
                        />
                    ))}
                </section>

                <TahapanPjpSection
                    action="/tanggung-jawab-pemantauan-pelaporan"
                    pjps={pjps}
                    filters={filters}
                />
            </div>
        </AppLayout>
    );
}
