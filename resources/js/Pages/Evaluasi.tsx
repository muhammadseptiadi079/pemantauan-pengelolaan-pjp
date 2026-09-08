import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import TahapanPjpSection from '@/Components/TahapanPjpSection';
import StatusStackedBar, { StatusCounts } from '@/Components/StatusStackedBar';
import AchievementBarChart from '@/Components/AchievementBarChart';
import EvaluasiTrendComparison from '@/Components/EvaluasiTrendComparison';
import { TahapIcon } from '@/Components/TahapIcons';
import { PjpEvaluasi, SmkpScore } from '@/types';

type MiniPjp = {
    id: number;
    nama_perusahaan: string;
    status: string;
    smkpScore?: SmkpScore;
    latestEvaluasi?: PjpEvaluasi | null;
    evaluasiHistory?: PjpEvaluasi[];
    achievement: number | null;
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
                    title="Evaluasi"
                    description="Evaluasi kinerja PJP setiap semester, mencakup aspek Teknis, Keselamatan &amp; Kesehatan, dan Lingkungan, sebagai dasar tindak lanjut pengelolaan berikutnya."
                    icon="evaluasi"
                />

                <div className="mb-6">
                    <StatusStackedBar
                        title="Capaian Status pada Tahap Ini"
                        counts={statusCounts}
                    />
                </div>

                <div className="mb-10">
                    <AchievementBarChart
                        title="Skor Evaluasi Kinerja per Perusahaan"
                        emptyMessage="Belum ada PJP pada tahap ini."
                        noDataLabel="Belum dievaluasi"
                        items={pjps.map((pjp) => ({
                            id: pjp.id,
                            label: pjp.nama_perusahaan,
                            value: pjp.achievement,
                        }))}
                    />
                </div>

                <EvaluasiTrendComparison
                    series={pjps.map((pjp) => ({
                        id: pjp.id,
                        label: pjp.nama_perusahaan,
                        points: pjp.evaluasiHistory ?? [],
                    }))}
                />

                <div className="mb-14 rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm text-blue-900">
                    <p className="flex items-center gap-2.5 font-semibold">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-700">
                            <TahapIcon name="evaluasi" className="h-3.5 w-3.5" />
                        </span>
                        Evaluasi Kinerja Semester
                    </p>
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
