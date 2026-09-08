export default function PlaceholderCard({
    title,
    description,
}: {
    title: string;
    description?: string;
}) {
    return (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 transition-colors duration-150 hover:border-slate-400 hover:bg-slate-100">
            <h3 className="font-semibold text-slate-800">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">
                {description ?? 'Belum ada data. Sub-proses ini akan dikembangkan lebih lanjut.'}
            </p>
        </div>
    );
}
