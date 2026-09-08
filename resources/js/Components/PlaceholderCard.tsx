import { TahapIcon } from '@/Components/TahapIcons';

export default function PlaceholderCard({
    title,
    description,
    icon,
}: {
    title: string;
    description?: string;
    icon?: string;
}) {
    return (
        <div className="glass-empty p-5 transition-colors duration-150 hover:border-slate-400 hover:bg-white/60">
            <div className="flex items-center gap-2.5">
                {icon && (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                        <TahapIcon name={icon} className="h-4 w-4" />
                    </span>
                )}
                <h3 className="font-semibold text-slate-800">{title}</h3>
            </div>
            <p className="mt-1 text-sm text-slate-500">
                {description ?? 'Belum ada data. Sub-proses ini akan dikembangkan lebih lanjut.'}
            </p>
        </div>
    );
}
