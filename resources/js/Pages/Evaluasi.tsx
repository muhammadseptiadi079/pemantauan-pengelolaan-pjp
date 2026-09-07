import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import PlaceholderCard from '@/Components/PlaceholderCard';
import TahapanPjpSection from '@/Components/TahapanPjpSection';
import StatusStackedBar, { StatusCounts } from '@/Components/StatusStackedBar';

type MiniPjp = { id: number; nama_perusahaan: string; status: string };

export default function Evaluasi({
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
            <Head title="Evaluasi" />
            <div className="mx-auto max-w-5xl px-6 py-16">
                <PageHeader
                    title="3. Evaluasi"
                    description="Tahapan evaluasi menyeluruh terhadap kinerja dan kepatuhan PJP, sebagai dasar tindak lanjut pengelolaan berikutnya."
                />

                <div className="mb-10">
                    <StatusStackedBar
                        title="Capaian Status pada Tahap Ini"
                        counts={statusCounts}
                    />
                </div>

                <section className="grid gap-4 sm:grid-cols-1">
                    <PlaceholderCard
                        title="Evaluasi Kinerja PJP"
                        description="Belum ada data evaluasi. Bagian ini akan dikembangkan lebih lanjut untuk mencakup hasil evaluasi dan rekomendasi tindak lanjut."
                    />
                </section>

                <TahapanPjpSection
                    tahapan="evaluasi"
                    action="/evaluasi"
                    pjps={pjps}
                    filters={filters}
                />
            </div>
        </AppLayout>
    );
}
