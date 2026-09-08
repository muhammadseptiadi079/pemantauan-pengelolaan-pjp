import { Link, usePage } from '@inertiajs/react';
import { ReactElement, useState } from 'react';
import LogoMark, { LogoWithText } from '@/Components/Logo';

const icons: Record<string, ReactElement> = {
    home: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12 11.204 3.045a1.125 1.125 0 0 1 1.591 0L21.75 12M4.5 9.75v9.75a.75.75 0 0 0 .75.75H9v-4.5a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5V20.25h3.75a.75.75 0 0 0 .75-.75V9.75"
        />
    ),
    persyaratan: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M9 4.5h6a1.5 1.5 0 0 1 1.5 1.5v13.5l-4.5-2.25L7.5 19.5V6A1.5 1.5 0 0 1 9 4.5Z"
        />
    ),
    tanggungjawab: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 8.25h16.5M3.75 8.25v10.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V8.25M3.75 8.25 5.4 4.9a1.5 1.5 0 0 1 1.34-.9h10.52a1.5 1.5 0 0 1 1.34.9l1.65 3.35M9 12h6"
        />
    ),
    evaluasi: (
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 19.5h16.5M6.75 19.5v-6M11.25 19.5V9M15.75 19.5v-9M20.25 19.5V5.25"
        />
    ),
};

const navItems = [
    { href: '/', label: 'Beranda', icon: 'home' },
    {
        href: '/persyaratan-seleksi-penetapan',
        label: 'Persyaratan, Seleksi, Penetapan',
        icon: 'persyaratan',
    },
    {
        href: '/tanggung-jawab-pemantauan-pelaporan',
        label: 'Tanggung Jawab, Pemantauan, Pelaporan',
        icon: 'tanggungjawab',
    },
    { href: '/evaluasi', label: 'Evaluasi', icon: 'evaluasi' },
];

function NavLinks({
    pathname,
    onNavigate,
}: {
    pathname: string;
    onNavigate?: () => void;
}) {
    return (
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {navItems.map((item) => {
                const isActive =
                    item.href === '/'
                        ? pathname === '/'
                        : pathname.startsWith(item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        className={`group flex items-center gap-3 rounded-lg border-l-[3px] px-3 py-2 text-sm font-medium transition-all duration-150 ${
                            isActive
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.75}
                            stroke="currentColor"
                            className={`h-5 w-5 shrink-0 transition-transform duration-150 ${
                                isActive ? '' : 'text-slate-400 group-hover:text-slate-600'
                            }`}
                        >
                            {icons[item.icon]}
                        </svg>
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}

export default function Sidebar() {
    const { url } = usePage();
    const pathname = url.split('?')[0];
    const [open, setOpen] = useState(false);

    return (
        <>
            <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
                <div className="flex items-center gap-2.5">
                    <LogoMark className="h-8 w-8" />
                    <p className="text-sm font-semibold text-slate-900">
                        Pemantauan &amp; Pengelolaan PJP
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-label="Buka menu navigasi"
                    className="rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-6 w-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                        />
                    </svg>
                </button>
            </header>

            <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
                <div className="border-b border-slate-200 px-6 py-5">
                    <LogoWithText />
                </div>
                <NavLinks pathname={pathname} />
                <div className="border-t border-slate-100 px-6 py-4">
                    <p className="text-[11px] leading-relaxed text-slate-400">
                        &copy; {new Date().getFullYear()} Pemantauan &amp; Pengelolaan PJP
                    </p>
                </div>
            </aside>

            {open && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/40 animate-[fade-in_0.2s_ease-out]"
                        onClick={() => setOpen(false)}
                        aria-hidden="true"
                    />
                    <div className="absolute inset-y-0 left-0 flex w-72 max-w-[80%] flex-col bg-white shadow-xl animate-[slide-in-left_0.2s_ease-out]">
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                            <LogoWithText />
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Tutup menu navigasi"
                                className="rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="h-5 w-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18 18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
                    </div>
                </div>
            )}
        </>
    );
}
