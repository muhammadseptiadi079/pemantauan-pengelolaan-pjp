import { Link } from '@inertiajs/react';
import BackButton from '@/Components/BackButton';
import LogoMark from '@/Components/Logo';
import { TahapIcon } from '@/Components/TahapIcons';

export default function PageHero({
    breadcrumbLabel,
    eyebrow = 'Pemantauan PJP',
    title,
    description,
    ctaLabel,
    ctaHref,
    showBackButton = true,
}: {
    breadcrumbLabel: string;
    eyebrow?: string;
    title: string;
    description: string;
    ctaLabel?: string;
    ctaHref?: string;
    showBackButton?: boolean;
}) {
    const ctaClass =
        'mt-6 inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-950/40 transition-colors hover:bg-orange-500';

    return (
        <div className="hero-dark relative mb-10 overflow-hidden rounded-2xl p-8 sm:p-10">
            <LogoMark className="pointer-events-none absolute -bottom-6 -right-6 h-40 w-40 opacity-10 sm:h-48 sm:w-48" />

            <div className="relative">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <nav className="flex items-center gap-2 text-sm text-slate-300">
                        <Link href="/" className="flex items-center hover:text-white">
                            <TahapIcon name="home" className="h-4 w-4" />
                        </Link>
                        <span className="text-slate-600">/</span>
                        <span className="font-medium text-white">{breadcrumbLabel}</span>
                    </nav>
                    {showBackButton && <BackButton variant="dark" />}
                </div>

                <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-400">
                    <span className="h-0.5 w-6 rounded bg-orange-500" />
                    {eyebrow}
                </p>
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    {title}
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
                    {description}
                </p>

                {ctaLabel && ctaHref && (
                    ctaHref.startsWith('#') ? (
                        <a href={ctaHref} className={ctaClass}>
                            {ctaLabel}
                            <span aria-hidden="true">&rarr;</span>
                        </a>
                    ) : (
                        <Link href={ctaHref} className={ctaClass}>
                            {ctaLabel}
                            <span aria-hidden="true">&rarr;</span>
                        </Link>
                    )
                )}
            </div>
        </div>
    );
}
