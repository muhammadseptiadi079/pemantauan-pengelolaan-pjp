import { Link } from '@inertiajs/react';
import AnimatedNumber from '@/Components/AnimatedNumber';
import { TahapIcon } from '@/Components/TahapIcons';

const GRADIENTS: Record<string, string> = {
    blue: 'from-blue-600 to-blue-800',
    green: 'from-green-600 to-green-800',
    amber: 'from-amber-500 to-orange-600',
};

function CardContent({
    value,
    label,
    icon,
    href,
}: {
    value: number;
    label: string;
    icon: string;
    href?: string;
}) {
    return (
        <>
            <TahapIcon
                name={icon}
                className="breathe pointer-events-none absolute -bottom-4 -right-4 h-28 w-28 text-white/15"
            />

            <div className="relative">
                <p className="text-3xl font-bold">
                    <AnimatedNumber value={value} />
                </p>
                <p className="mt-1 text-sm text-white/90">{label}</p>
            </div>

            <div className="relative mt-6 flex items-end justify-between">
                {href ? (
                    <span className="text-xs font-medium text-white/80 group-hover:text-white">
                        Lihat data &rarr;
                    </span>
                ) : (
                    <span />
                )}
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <TahapIcon name={icon} className="h-5 w-5" />
                </span>
            </div>
        </>
    );
}

export default function GradientStatCard({
    value,
    label,
    icon,
    color,
    href,
}: {
    value: number;
    label: string;
    icon: string;
    color: 'blue' | 'green' | 'amber';
    href?: string;
}) {
    const className = `group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white shadow-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl ${GRADIENTS[color]}`;

    if (href) {
        return (
            <Link href={href} className={className}>
                <CardContent value={value} label={label} icon={icon} href={href} />
            </Link>
        );
    }

    return (
        <div className={className}>
            <CardContent value={value} label={label} icon={icon} />
        </div>
    );
}
