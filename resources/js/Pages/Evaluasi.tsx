import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import PlaceholderCard from '@/Components/PlaceholderCard';

export default function Evaluasi() {
    return (
        <AppLayout>
            <div className="mx-auto max-w-5xl px-6 py-16">
                <PageHeader
                    title="3. Evaluasi"
                    description="Tahapan evaluasi menyeluruh terhadap kinerja dan kepatuhan PJP, sebagai dasar tindak lanjut pengelolaan berikutnya."
                />

                <section className="grid gap-4 sm:grid-cols-1">
                    <PlaceholderCard
                        title="Evaluasi Kinerja PJP"
                        description="Belum ada data evaluasi. Bagian ini akan dikembangkan lebih lanjut untuk mencakup hasil evaluasi dan rekomendasi tindak lanjut."
                    />
                </section>
            </div>
        </AppLayout>
    );
}
