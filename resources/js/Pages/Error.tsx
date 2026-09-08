import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { TahapIcon } from '@/Components/TahapIcons';

const MESSAGES: Record<number, { title: string; description: string }> = {
    404: {
        title: 'Halaman Tidak Ditemukan',
        description:
            'Halaman atau data yang dicari tidak ada — mungkin sudah dihapus, atau tautannya salah.',
    },
    403: {
        title: 'Akses Ditolak',
        description: 'Guru tidak memiliki izin untuk mengakses halaman ini.',
    },
    419: {
        title: 'Sesi Berakhir',
        description: 'Halaman ini sudah terlalu lama dibuka. Muat ulang lalu coba lagi.',
    },
    429: {
        title: 'Terlalu Banyak Permintaan',
        description: 'Terlalu banyak percobaan dalam waktu singkat. Coba lagi sebentar lagi.',
    },
    405: {
        title: 'Metode Tidak Diizinkan',
        description: 'Cara mengakses halaman ini tidak didukung.',
    },
    500: {
        title: 'Terjadi Kesalahan Server',
        description: 'Ada yang tidak berjalan semestinya di sisi server. Coba lagi sebentar lagi.',
    },
    503: {
        title: 'Layanan Sedang Tidak Tersedia',
        description: 'Aplikasi sedang dalam pemeliharaan sebentar. Coba lagi sebentar lagi.',
    },
};

export default function Error({ status }: { status: number }) {
    const { title, description } = MESSAGES[status] ?? {
        title: 'Terjadi Kesalahan',
        description: 'Sesuatu tidak berjalan semestinya.',
    };

    return (
        <AppLayout>
            <Head title={title} />
            <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
                <span className="pop-in flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                    <TahapIcon name="alert" className="h-8 w-8" />
                </span>
                <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-400">
                    Error {status}
                </p>
                <h1 className="mt-2 text-2xl font-bold text-slate-900">{title}</h1>
                <p className="mt-3 max-w-md text-slate-600">{description}</p>
                <Link
                    href="/"
                    className="mt-8 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-shadow hover:shadow-md"
                >
                    &larr; Kembali ke Beranda
                </Link>
            </div>
        </AppLayout>
    );
}
