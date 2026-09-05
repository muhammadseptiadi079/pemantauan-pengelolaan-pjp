import Link from "next/link";

const tahapan = [
  {
    href: "/persyaratan-seleksi-penetapan",
    nomor: "1",
    title: "Persyaratan, Seleksi, dan Penetapan",
    description:
      "Proses awal penilaian persyaratan, seleksi, hingga penetapan Perusahaan Jasa Pertambangan (PJP).",
  },
  {
    href: "/tanggung-jawab-pemantauan-pelaporan",
    nomor: "2",
    title: "Tanggung Jawab, Pemantauan, dan Pelaporan",
    description:
      "Pengelolaan tanggung jawab, pemantauan berkala, dan pelaporan kinerja PJP yang telah ditetapkan.",
  },
  {
    href: "/evaluasi",
    nomor: "3",
    title: "Evaluasi",
    description:
      "Evaluasi menyeluruh terhadap kinerja dan kepatuhan PJP sebagai dasar tindak lanjut.",
  },
];

export default function Home() {
  return (
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
  );
}
