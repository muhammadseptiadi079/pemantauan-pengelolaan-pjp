import { Link } from '@inertiajs/react';

export type PaginationLink = { url: string | null; label: string; active: boolean };

function labelFor(label: string): string {
    if (label.includes('Previous')) return '← Sebelumnya';
    if (label.includes('Next')) return 'Selanjutnya →';
    return label;
}

export default function Pagination({ links }: { links: PaginationLink[] }) {
    if (links.length <= 3) return null;

    return (
        <nav className="mt-6 flex flex-wrap items-center justify-center gap-1">
            {links.map((link, index) =>
                link.url ? (
                    <Link
                        key={index}
                        href={link.url}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                            link.active
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        {labelFor(link.label)}
                    </Link>
                ) : (
                    <span
                        key={index}
                        className="rounded-lg px-3 py-1.5 text-sm text-slate-300"
                    >
                        {labelFor(link.label)}
                    </span>
                ),
            )}
        </nav>
    );
}
