import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';

const faq: { pertanyaan: string; jawaban: string }[] = [
    {
        pertanyaan: 'Apa itu aplikasi Pemantauan & Pengelolaan PJP?',
        jawaban:
            'Aplikasi untuk memantau dan mengelola Perusahaan Jasa Pertambangan (PJP) lewat tiga aspek yang berjalan bersamaan untuk setiap PJP: Persyaratan, Seleksi, dan Penetapan; Tanggung Jawab, Pemantauan, dan Pelaporan; serta Evaluasi. Semua PJP terdaftar tampil di ketiga halaman ini sekaligus, masing-masing dengan skornya sendiri.',
    },
    {
        pertanyaan: 'Apa itu checklist "Persyaratan PJP"?',
        jawaban:
            'Checklist prakualifikasi SMKP (Sistem Manajemen Keselamatan Pertambangan) dengan 17 kategori dan 126 pertanyaan berbobot, untuk menilai tingkat kepatuhan PJP sebelum ditetapkan menjadi rekanan aktif.',
    },
    {
        pertanyaan: 'Siapa yang mengisi checklist Persyaratan PJP?',
        jawaban:
            'PJP itu sendiri, lewat tombol "Persyaratan PJP" di halaman Detail masing-masing PJP. Aplikasi ini belum punya sistem login terpisah, jadi siapa pun yang memegang tautan halaman tersebut bisa mengisinya.',
    },
    {
        pertanyaan: 'Apa itu "Dokumen Legalitas" dan kenapa terpisah dari skor?',
        jawaban:
            'Empat syarat administratif wajib (Akta Pendirian, NIB, IUJP, NPWP) yang harus lengkap semua. Ini gerbang wajib yang berdiri sendiri, bukan bagian dari skor 178 poin checklist SMKP.',
    },
    {
        pertanyaan: 'Kenapa satu PJP bisa muncul di ketiga halaman tahap sekaligus?',
        jawaban:
            'Karena checklist Persyaratan, laporan Tanggung Jawab, dan Evaluasi Kinerja adalah tiga hal independen yang bisa diisi kapan saja untuk PJP yang sama — bukan tahap berurutan yang harus dilewati satu per satu. Jadi setiap PJP terdaftar otomatis tampil di ketiga halaman, masing-masing dengan skornya sendiri.',
    },
    {
        pertanyaan: 'Dokumen apa saja yang wajib diunggah pada halaman Tanggung Jawab, Pemantauan, dan Pelaporan?',
        jawaban:
            'Empat jenis dokumen: Data SPIP (Sarana, Prasarana, Instalasi & Peralatan), Target Sasaran Program (TSP), Laporan Bulanan, dan Laporan Triwulan — semuanya diunggah dari halaman Detail PJP.',
    },
    {
        pertanyaan: 'Kapan sebuah laporan dianggap "tepat waktu"?',
        jawaban: 'Jika diunggah pada atau sebelum tanggal 3 bulan berjalan, untuk semua jenis dokumen.',
    },
    {
        pertanyaan: 'Kapan Laporan Triwulan bisa diunggah?',
        jawaban:
            'Hanya pada bulan April (TW1), Juli (TW2), Oktober (TW3), dan Januari (TW4). Di luar bulan-bulan itu, form unggahnya otomatis disembunyikan.',
    },
    {
        pertanyaan: 'Apa itu skor "Kepatuhan Pelaporan"?',
        jawaban:
            'Rata-rata dari dua hal: persentase laporan yang diunggah tepat waktu, dan persentase laporan yang dinilai "sesuai" isinya (hanya menghitung laporan yang sudah dievaluasi). Kalau PJP belum pernah mengunggah apa pun, skornya ditampilkan "Belum ada laporan", bukan 0%.',
    },
    {
        pertanyaan: 'Bagaimana cara mengisi Evaluasi Kinerja?',
        jawaban:
            'Lewat form "Evaluasi Kinerja" di halaman Detail PJP, diisi per semester dengan tiga skor (0-100): Teknis, Keselamatan & Kesehatan, dan Lingkungan. Skor rata-ratanya dihitung otomatis.',
    },
    {
        pertanyaan: 'Apa arti warna pada grafik achievement (hijau/kuning/oranye/merah)?',
        jawaban:
            'Baik (skor ≥ 80), Perlu Perhatian (60-79), Perlu Tindak Lanjut (40-59), dan Kritis (< 40). Grafik ini selalu diurutkan dari skor terendah supaya PJP yang paling butuh tindak lanjut langsung terlihat.',
    },
    {
        pertanyaan: 'Bagaimana cara export data PJP?',
        jawaban:
            'Untuk Excel (berisi semua PJP beserta skornya), klik "Export Excel" di halaman Data PJP. Untuk PDF (laporan satu PJP), klik "Export PDF" di halaman Detail PJP yang bersangkutan.',
    },
];

export default function Bantuan() {
    return (
        <AppLayout>
            <Head title="Bantuan" />
            <div className="mx-auto max-w-3xl px-6 py-16">
                <PageHeader
                    title="Pertanyaan yang Sering Diajukan"
                    description="Seputar penggunaan aplikasi Pemantauan & Pengelolaan PJP — alur tahapan, checklist, pelaporan, dan evaluasi."
                    icon="help"
                />

                <div className="space-y-3">
                    {faq.map((item, index) => (
                        <details
                            key={item.pertanyaan}
                            className="glass-card group row-in open:border-blue-200 open:bg-blue-50/40"
                            style={{ animationDelay: `${Math.min(index, 12) * 30}ms` }}
                            open={index === 0}
                        >
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-sm font-semibold text-slate-900">
                                {item.pertanyaan}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </summary>
                            <p className="border-t border-slate-100 px-4 pb-4 pt-3 text-sm leading-relaxed text-slate-600">
                                {item.jawaban}
                            </p>
                        </details>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
