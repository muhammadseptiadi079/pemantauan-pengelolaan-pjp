import PageHeader from "@/components/PageHeader";
import PlaceholderCard from "@/components/PlaceholderCard";

const subTahapan = [
  {
    title: "Tanggung Jawab",
    description: "Pembagian tanggung jawab PJP dalam menjalankan operasinya.",
  },
  {
    title: "Pemantauan",
    description: "Pemantauan berkala terhadap kinerja dan kepatuhan PJP.",
  },
  {
    title: "Pelaporan",
    description: "Pelaporan hasil pemantauan dan kondisi terkini PJP.",
  },
];

export default function TanggungJawabPemantauanPelaporanPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <PageHeader
        title="2. Tanggung Jawab, Pemantauan, dan Pelaporan"
        description="Tahapan pengelolaan berkelanjutan PJP, mencakup tanggung jawab operasional, pemantauan rutin, dan pelaporan hasil pemantauan."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        {subTahapan.map((sub) => (
          <PlaceholderCard
            key={sub.title}
            title={sub.title}
            description={sub.description}
          />
        ))}
      </section>
    </div>
  );
}
