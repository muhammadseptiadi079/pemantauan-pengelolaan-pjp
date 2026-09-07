import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import PlaceholderCard from '@/Components/PlaceholderCard';
import TahapanPjpSection from '@/Components/TahapanPjpSection';
import StatusStackedBar, { StatusCounts } from '@/Components/StatusStackedBar';

type MiniPjp = { id: number; nama_perusahaan: string; status: string };

const subTahapan = [
    {
        title: 'Tanggung Jawab',
        description: 'Pembagian tanggung jawab PJP dalam menjalankan operasinya.',
    },
    {
        title: 'Pemantauan',
        description: 'Pemantauan berkala terhadap kinerja dan kepatuhan PJP.',
    },
    {
        title: 'Pelaporan',
        description: 'Pelaporan hasil pemantauan dan kondisi terkini PJP.',
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
            <div className="mx-auto max-w-5xl px-6 py-16">
                <PageHeader
                    title="2. Tanggung Jawab, Pemantauan, dan Pelaporan"
                    description="Tahapan pengelolaan berkelanjutan PJP, mencakup tanggung jawab operasional, pemantauan rutin, dan pelaporan hasil pemantauan."
                />

                <div className="mb-10">
                    <StatusStackedBar
                        title="Capaian Status pada Tahap Ini"
                        counts={statusCounts}
                    />
                </div>

                <section className="grid gap-4 sm:grid-cols-3">
                    {subTahapan.map((sub) => (
                        <PlaceholderCard
                            key={sub.title}
                            title={sub.title}
                            description={sub.description}
                        />
                    ))}
                </section>

                <TahapanPjpSection
                    tahapan="tanggung-jawab-pemantauan-pelaporan"
                    action="/tanggung-jawab-pemantauan-pelaporan"
                    pjps={pjps}
                    filters={filters}
                />
            </div>
        </AppLayout>
    );
}
