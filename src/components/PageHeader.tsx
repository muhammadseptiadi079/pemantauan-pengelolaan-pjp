import Link from "next/link";

export default function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-10">
      <Link
        href="/"
        className="mb-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-800 md:hidden"
      >
        &larr; Kembali ke Beranda
      </Link>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        {title}
      </h1>
      <p className="mt-2 max-w-3xl text-slate-600">{description}</p>
    </div>
  );
}
