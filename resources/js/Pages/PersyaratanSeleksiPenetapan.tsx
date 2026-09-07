import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import PlaceholderCard from '@/Components/PlaceholderCard';
import TahapanPjpSection from '@/Components/TahapanPjpSection';
import StatusStackedBar, { StatusCounts } from '@/Components/StatusStackedBar';

type MiniPjp = { id: number; nama_perusahaan: string; status: string };

const subTahapan = [
    {
        title: 'Persyaratan',
        description: 'Kelengkapan dokumen dan syarat administratif calon PJP.',
    },
    {
        title: 'Seleksi',
        description: 'Proses penilaian dan seleksi calon PJP.',
    },
    {
        title: 'Penetapan',
        description: 'Penetapan resmi PJP yang lolos proses seleksi.',
    },
];

const checklist: {
    id: string;
    title: string;
    bobot: number;
    description: string;
    subItems?: string[];
}[] = [
    {
        id: 'A',
        title: 'Dokumen Legalitas dan Perizinan Berusaha',
        bobot: 4,
        description:
            'Akta Pendirian & Perubahan; NIB (Nomor Induk Berusaha) sesuai KBLI lingkup pekerjaan; IUJP atau izin instansi terkait yang berlaku; NPWP.',
    },
    {
        id: 'B',
        title: 'Kebijakan, Kepemimpinan & Komitmen',
        bobot: 4,
        description:
            'Kebijakan terkait keselamatan pertambangan dan lingkungan hidup (K3LH), mencakup visi-misi, komitmen pelaksanaan, kerangka program kerja, dan dikomunikasikan ke seluruh pekerja.',
    },
    {
        id: 'C',
        title: 'Manajemen Risiko',
        bobot: 9,
        description:
            'Proses penelaahan awal, prosedur manajemen risiko, kriteria risiko, analisis risiko dan pengendaliannya (JSA), serta tindak lanjut dalam program kerja.',
    },
    {
        id: 'D',
        title: 'Peraturan Perundangan dan Persyaratan Lainnya / P3L',
        bobot: 4,
        description:
            'Prosedur dan identifikasi P3L yang relevan dengan aktivitas perusahaan, serta kajian kesesuaiannya secara berkala.',
    },
    {
        id: 'E',
        title: 'Tujuan, Sasaran & Program KPLH',
        bobot: 4,
        description:
            'Tujuan, Sasaran dan Program (TSP) KPLH yang selaras dengan kebijakan, mempertimbangkan P3L, kinerja KPLH, skala prioritas, dan sumber daya.',
    },
    {
        id: 'F',
        title: 'Organisasi dan Sumber Daya',
        bobot: 8,
        description:
            'Struktur organisasi penanggung jawab KPLH, Penanggung Jawab Operasi, petugas kesehatan keselamatan kerja, tenaga teknis Keselamatan Operasi, serta Pengawas Operasional dan Teknis.',
    },
    {
        id: 'G',
        title: 'Seleksi dan Penempatan Personil',
        bobot: 2,
        description:
            'Pertimbangan kompetensi KPLH dalam perekrutan, promosi, rotasi, dan mutasi personil.',
    },
    {
        id: 'H',
        title: 'Kompetensi Pekerja',
        bobot: 9,
        description:
            'Peta/matriks kompetensi, analisa kebutuhan training (TNA), pelatihan KPLH berkala, evaluasi efektivitas pelatihan, dan pemeliharaan rekaman pelatihan.',
    },
    {
        id: 'I',
        title: 'Komunikasi',
        bobot: 7,
        description:
            'Komunikasi SMKPLH ke seluruh karyawan, induksi K3LH untuk karyawan baru dan tamu, buku petunjuk KPLH, dan program pertemuan KPLH reguler.',
    },
    {
        id: 'J',
        title: 'Tanggung Jawab KPLH',
        bobot: 4,
        description:
            'Deskripsi pekerjaan setiap karyawan yang mencakup tanggung jawab KPLH, dengan penunjukan posisi penanggung jawab tertinggi.',
    },
    {
        id: 'K',
        title: 'Implementasi',
        bobot: 88,
        description:
            'Kategori terbesar, terdiri dari 9 sub-elemen pelaksanaan KPLH di lapangan.',
        subItems: [
            'J.1 Kampanye Keselamatan Pertambangan',
            'J.2 Inspeksi',
            'J.3 Pengelolaan Kesehatan Kerja (termasuk Pengelolaan Kelelahan, Ergonomi, Higiene)',
            'J.4 Pengelolaan Lingkungan Kerja',
            'J.5 Pengelolaan Keselamatan Operasi (Tenaga Teknis, Sarana Prasarana Instalasi & Peralatan, Pengamanan Instalasi, Kelayakan SPIP)',
            'J.6 Sistem Izin Kerja',
            'J.7 Pengelolaan Perlindungan Lingkungan (termasuk Limbah B3, Pencemaran Lingkungan)',
            'J.8 Prosedur Kerja',
            'J.9 Alat Pelindung Diri (APD)',
        ],
    },
    {
        id: 'L',
        title: 'Kejadian, Kecelakaan & Penyelidikan',
        bobot: 8,
        description:
            'Prosedur pelaporan, pencatatan, penyelidikan (investigasi) insiden, dan sosialisasi hasil penyelidikan.',
    },
    {
        id: 'M',
        title: 'Statistik KPLH',
        bobot: 4,
        description:
            'Statistik kejadian dan kecelakaan kerja, serta riwayat penghargaan KPLH.',
    },
    {
        id: 'N',
        title: 'Rencana Tanggap Darurat',
        bobot: 11,
        description:
            'Rencana tanggap darurat termasuk insiden pencemaran lingkungan, petugas P3K terlatih, pelatihan tanggap darurat, struktur organisasi tanggap darurat, dan alat pengendalian kebakaran.',
    },
    {
        id: 'O',
        title: 'Subkontraktor',
        bobot: 7,
        description:
            'Prosedur seleksi, pengawasan dan pengendalian, evaluasi kinerja tahunan, dan audit KPLH terhadap kontraktor/subkontraktor.',
    },
    {
        id: 'P',
        title: 'Audit Internal',
        bobot: 5,
        description:
            'Prosedur/program audit internal, auditor internal, dan jadwal audit berkala.',
    },
    {
        id: 'Q',
        title: 'Tinjauan Manajemen',
        bobot: 4,
        description:
            'Prosedur rapat tinjauan manajemen, agenda, dan tindak lanjut rekomendasi hasil rapat.',
    },
];

const totalBobot = checklist.reduce((sum, item) => sum + item.bobot, 0);

export default function PersyaratanSeleksiPenetapan({
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
                    title="1. Persyaratan, Seleksi, dan Penetapan"
                    description="Tahapan awal pengelolaan Perusahaan Jasa Pertambangan (PJP), mencakup pemeriksaan persyaratan, proses seleksi, hingga penetapan resmi."
                />

                <div className="mb-10">
                    <StatusStackedBar
                        title="Capaian Status pada Tahap Ini"
                        counts={statusCounts}
                    />
                </div>

                <section className="mb-14 grid gap-4 sm:grid-cols-3">
                    {subTahapan.map((sub) => (
                        <PlaceholderCard
                            key={sub.title}
                            title={sub.title}
                            description={sub.description}
                        />
                    ))}
                </section>

                <section>
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Referensi Checklist Prakualifikasi SMK3PLM
                        </h2>
                        <p className="mt-2 max-w-3xl text-sm text-slate-600">
                            Struktur kategori dan bobot penilaian berikut merupakan referensi
                            informasional untuk proses seleksi PJP. Belum mencakup skoring
                            interaktif — hanya menampilkan struktur checklist.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {checklist.map((item) => (
                            <details
                                key={item.id}
                                className="group rounded-xl border border-slate-200 bg-white p-4 open:shadow-sm"
                            >
                                <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                                    <span className="font-medium text-slate-800">
                                        <span className="mr-2 text-slate-400">{item.id}.</span>
                                        {item.title}
                                    </span>
                                    <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                        Bobot {item.bobot}
                                    </span>
                                </summary>
                                <p className="mt-3 text-sm text-slate-600">
                                    {item.description}
                                </p>
                                {item.subItems && (
                                    <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-600">
                                        {item.subItems.map((sub) => (
                                            <li key={sub}>{sub}</li>
                                        ))}
                                    </ul>
                                )}
                            </details>
                        ))}
                    </div>

                    <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
                        <p className="font-semibold">Kategorisasi Risiko Prakualifikasi</p>
                        <p className="mt-1">
                            Total bobot penilaian: <strong>{totalBobot} poin</strong>. Hasil
                            penilaian dikelompokkan ke dalam kategori risiko berikut:
                        </p>
                        <ul className="mt-2 list-inside list-disc space-y-1">
                            <li>Kritis: &gt; 75%</li>
                            <li>Tinggi: 55% - 74%</li>
                            <li>Sedang: 36% - 54%</li>
                            <li>Rendah: 20% - 35%</li>
                        </ul>
                    </div>
                </section>

                <TahapanPjpSection
                    tahapan="persyaratan-seleksi-penetapan"
                    action="/persyaratan-seleksi-penetapan"
                    pjps={pjps}
                    filters={filters}
                />
            </div>
        </AppLayout>
    );
}
