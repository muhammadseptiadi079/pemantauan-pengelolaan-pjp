import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import StatusStackedBar, { StatusCounts } from '@/Components/StatusStackedBar';

const tahapan = [
    {
        href: '/persyaratan-seleksi-penetapan',
        nomor: '1',
        title: 'Persyaratan, Seleksi, dan Penetapan',
        description:
            'Proses awal penilaian persyaratan, seleksi, hingga penetapan Perusahaan Jasa Pertambangan (PJP).',
    },
    {
        href: '/tanggung-jawab-pemantauan-pelaporan',
        nomor: '2',
        title: 'Tanggung Jawab, Pemantauan, dan Pelaporan',
        description:
            'Pengelolaan tanggung jawab, pemantauan berkala, dan pelaporan kinerja PJP yang telah ditetapkan.',
    },
    {
        href: '/evaluasi',
        nomor: '3',
        title: 'Evaluasi',
        description:
            'Evaluasi menyeluruh terhadap kinerja dan kepatuhan PJP sebagai dasar tindak lanjut.',
    },
];

type MiniPjp = { id: number; nama_perusahaan: string };

type HomeProps = {
    stats: {
        total: number;
        aktifDipantau: number;
        perluTindakLanjut: number;
    };
    statusCounts: StatusCounts;
    pjpBelumLaporanBulanan: MiniPjp[];
};

export default function Home({
    stats,
    statusCounts,
    pjpBelumLaporanBulanan,
}: HomeProps) {
    return (
        <AppLayout>
            <Head title="Beranda" />
            <div className="mx-auto max-w-5xl px-6 py-16">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                        Pemantauan &amp; Pengelolaan PJP
                    </h1>
                    <p className="mx-auto mt-3 max-w-2xl text-slate-600">
                        Aplikasi untuk memantau dan mengelola Perusahaan Jasa Pertambangan
                        (PJP) di seluruh tahapan pengelolaannya.
                    </p>
                </header>

                {pjpBelumLaporanBulanan.length > 0 && (
                    <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
                        <p className="text-sm font-semibold text-amber-900">
                            {pjpBelumLaporanBulanan.length} PJP belum/terlambat
                            mengirim Laporan Bulanan bulan ini
                        </p>
                        <ul className="mt-2 flex flex-wrap gap-2">
                            {pjpBelumLaporanBulanan.map((pjp) => (
                                <li key={pjp.id}>
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

                <section className="mb-12 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                        <p className="text-sm text-slate-500">Total PJP Terdaftar</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {stats.total}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                        <p className="text-sm text-slate-500">Aktif Dipantau</p>
                        <p className="mt-2 text-3xl font-bold text-green-600">
                            {stats.aktifDipantau}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                        <p className="text-sm text-slate-500">Perlu Tindak Lanjut</p>
                        <p className="mt-2 text-3xl font-bold text-amber-600">
                            {stats.perluTindakLanjut}
                        </p>
                    </div>
                </section>

                {stats.total === 0 ? (
                    <div className="mb-12 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
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
                            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                        >
                            <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                                {tahap.nomor}
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
