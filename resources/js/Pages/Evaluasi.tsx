import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import TahapanPjpSection from '@/Components/TahapanPjpSection';
import StatusStackedBar, { StatusCounts } from '@/Components/StatusStackedBar';
import { PjpEvaluasi, SmkpScore } from '@/types';

type MiniPjp = {
    id: number;
    nama_perusahaan: string;
    status: string;
    smkpScore?: SmkpScore;
    latestEvaluasi?: PjpEvaluasi | null;
};

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
                    description="Evaluasi kinerja PJP setiap semester, mencakup aspek Teknis, Keselamatan &amp; Kesehatan, dan Lingkungan, sebagai dasar tindak lanjut pengelolaan berikutnya."
                />

                <div className="mb-10">
                    <StatusStackedBar
                        title="Capaian Status pada Tahap Ini"
                        counts={statusCounts}
                    />
                </div>

                <div className="mb-14 rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm text-blue-900">
                    <p className="font-semibold">Evaluasi Kinerja Semester</p>
                    <p className="mt-1">
                        Klik salah satu PJP pada daftar di bawah untuk mengisi skor evaluasi
                        semesteran (Teknis, Keselamatan &amp; Kesehatan, Lingkungan) pada bagian
                        &quot;Evaluasi Kinerja&quot; di halaman detailnya. Skor rata-rata evaluasi
                        terakhir tiap PJP juga ditampilkan langsung pada daftar di bawah ini.
                    </p>
                </div>

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
