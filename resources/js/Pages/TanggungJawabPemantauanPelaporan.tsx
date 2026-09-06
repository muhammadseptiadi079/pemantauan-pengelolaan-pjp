import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import PlaceholderCard from '@/Components/PlaceholderCard';
import TahapanPjpSection from '@/Components/TahapanPjpSection';

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
}: {
    pjps: MiniPjp[];
}) {
    return (
        <AppLayout>
            <div className="mx-auto max-w-5xl px-6 py-16">
                <PageHeader
                    title="2. Tanggung Jawab, Pemantauan, dan Pelaporan"
                    description="Tahapan pengelolaan berkelanjutan PJP, mencakup tanggung jawab operasional, pemantauan rutin, dan pelaporan hasil pemantauan."
                />

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
                    pjps={pjps}
                />
            </div>
        </AppLayout>
    );
}
