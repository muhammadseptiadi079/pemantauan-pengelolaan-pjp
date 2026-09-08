import { TahapIcon } from '@/Components/TahapIcons';

export default function PageHeader({
    title,
    description,
    icon,
}: {
    title: string;
    description: string;
    icon?: string;
}) {
    return (
        <div className="mb-10">
            <div className="flex items-center gap-3">
                {icon && (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <TahapIcon name={icon} className="h-5 w-5" />
                    </span>
                )}
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    {title}
                </h1>
            </div>
            <p className="mt-2 max-w-3xl text-slate-600">{description}</p>
        </div>
    );
}
