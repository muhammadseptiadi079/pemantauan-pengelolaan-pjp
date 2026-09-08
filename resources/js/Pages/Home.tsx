import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import StatusStackedBar, { StatusCounts } from '@/Components/StatusStackedBar';
import GradientStatCard from '@/Components/GradientStatCard';
import LogoMark from '@/Components/Logo';
import { TahapIcon } from '@/Components/TahapIcons';
import { TAHAPAN_OPTIONS } from '@/types';

const tahapan = [
    {
        href: '/persyaratan-seleksi-penetapan',
        icon: 'persyaratan',
        title: 'Persyaratan, Seleksi, dan Penetapan',
        description:
            'Proses awal penilaian persyaratan, seleksi, hingga penetapan Perusahaan Jasa Pertambangan (PJP).',
    },
    {
        href: '/tanggung-jawab-pemantauan-pelaporan',
        icon: 'tanggungjawab',
        title: 'Tanggung Jawab, Pemantauan, dan Pelaporan',
        description:
            'Pengelolaan tanggung jawab, pemantauan berkala, dan pelaporan kinerja PJP yang telah ditetapkan.',
    },
    {
        href: '/evaluasi',
        icon: 'evaluasi',
        title: 'Evaluasi',
        description:
            'Evaluasi menyeluruh terhadap kinerja dan kepatuhan PJP sebagai dasar tindak lanjut.',
    },
];

type MiniPjp = { id: number; nama_perusahaan: string };

type PerluPerhatian = {
    id: number;
    nama_perusahaan: string;
    tahapan: string;
    achievement: number;
};

type HomeProps = {
    stats: {
        total: number;
        aktifDipantau: number;
        perluTindakLanjut: number;
    };
    statusCounts: StatusCounts;
    pjpBelumLaporanBulanan: MiniPjp[];
    perluPerhatian: PerluPerhatian[];
};

function achievementColor(value: number): string {
    if (value >= 60) return 'text-amber-800 bg-amber-100';
    if (value >= 40) return 'text-orange-800 bg-orange-100';
    return 'text-red-800 bg-red-100';
}

export default function Home({
    stats,
    statusCounts,
    pjpBelumLaporanBulanan,
    perluPerhatian,
}: HomeProps) {
    return (
        <AppLayout>
            <Head title="Beranda" />
            <div className="mx-auto max-w-5xl px-6 py-16">
                <header className="mb-12 text-center">
                    <div className="mb-4 flex justify-center">
                        <LogoMark className="h-14 w-14" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                        Pemantauan &amp; Pengelolaan PJP
                    </h1>
                    <p className="mx-auto mt-3 max-w-2xl text-slate-600">
                        Aplikasi untuk memantau dan mengelola Perusahaan Jasa Pertambangan
                        (PJP) di seluruh tahapan pengelolaannya.
                    </p>
                </header>

                {pjpBelumLaporanBulanan.length > 0 && (
                    <div className="mb-8 rounded-2xl border border-amber-200/70 bg-amber-50/60 p-5 shadow-lg shadow-amber-100/40 backdrop-blur-xl">
                        <p className="flex items-center gap-2.5 text-sm font-semibold text-amber-900">
                            <span className="pulse-ring flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                                <TahapIcon name="alert" className="h-4 w-4" />
                            </span>
                            {pjpBelumLaporanBulanan.length} PJP belum/terlambat
                            mengirim Laporan Bulanan bulan ini
                        </p>
                        <ul className="mt-2 flex flex-wrap gap-2">
                            {pjpBelumLaporanBulanan.map((pjp, index) => (
                                <li
                                    key={pjp.id}
                                    className="row-in"
                                    style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
                                >
                                    <Link
                                        href={`/pjp/${pjp.id}`}
                                        className="rounded-full bg-white px-3 py-1 text-sm font-medium text-amber-800 hover:bg-amber-100"
                                    >
                                        {pjp.nama_perusahaan}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {perluPerhatian.length > 0 && (
                    <div className="glass-card mb-8 p-5">
                        <p className="mb-3 flex items-center gap-2.5 text-sm font-semibold text-slate-900">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                                <TahapIcon name="alert" className="h-4 w-4" />
                            </span>
                            PJP Paling Perlu Perhatian
                        </p>
                        <ul className="divide-y divide-slate-100">
                            {perluPerhatian.map((pjp) => (
                                <li key={pjp.id}>
                                    <Link
                                        href={`/pjp/${pjp.id}`}
                                        className="flex items-center justify-between gap-3 py-2.5 text-sm hover:bg-slate-50"
                                    >
                                        <span>
                                            <span className="font-medium text-slate-800">
                                                {pjp.nama_perusahaan}
                                            </span>
                                            <span className="ml-2 text-xs text-slate-400">
                                                {TAHAPAN_OPTIONS[pjp.tahapan] ?? pjp.tahapan}
                                            </span>
                                        </span>
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${achievementColor(pjp.achievement)}`}
                                        >
                                            {pjp.achievement}%
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <section className="mb-12 grid gap-4 sm:grid-cols-3">
                    <GradientStatCard
                        value={stats.total}
                        label="Total PJP Terdaftar"
                        icon="building"
                        color="blue"
                        href="/pjp"
                    />
                    <GradientStatCard
                        value={stats.aktifDipantau}
                        label="Aktif Dipantau"
                        icon="check"
                        color="green"
                        href="/pjp?status=aktif"
                    />
                    <GradientStatCard
                        value={stats.perluTindakLanjut}
                        label="Perlu Tindak Lanjut"
                        icon="alert"
                        color="amber"
                        href="/pjp?status=perlu_tindak_lanjut"
                    />
                </section>

                {stats.total === 0 ? (
                    <div className="glass-empty mb-12 p-6 text-center text-sm text-slate-500">
                        Belum ada data PJP. Tambahkan data untuk mulai memantau dan
                        mengelola PJP.
                    </div>
                ) : (
                    <div className="mb-12">
                        <StatusStackedBar
                            title="Capaian Status Seluruh PJP"
                            counts={statusCounts}
                        />
                    </div>
                )}

                <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {tahapan.map((tahap) => (
                        <Link
                            key={tahap.href}
                            href={tahap.href}
                            className="glass-card group flex flex-col p-6 transition hover:-translate-y-1 hover:shadow-2xl"
                        >
                            <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                                <TahapIcon name={tahap.icon} className="h-5 w-5" />
                            </span>
                            <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-700">
                                {tahap.title}
                            </h2>
                            <p className="mt-2 flex-1 text-sm text-slate-600">
                                {tahap.description}
                            </p>
                            <span className="mt-4 text-sm font-medium text-blue-600 group-hover:text-blue-800">
                                Lihat detail &rarr;
                            </span>
                        </Link>
                    ))}
                </section>
            </div>
        </AppLayout>
    );
}
