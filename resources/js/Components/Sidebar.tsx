import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import LogoMark, { LogoWithText } from '@/Components/Logo';
import { TahapIcon } from '@/Components/TahapIcons';

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

type SidebarStats = { total: number; perluPerhatian: number };

function SidebarSummary({ stats }: { stats?: SidebarStats }) {
    if (!stats) return null;

    return (
        <div className="mx-3 mb-3 rounded-xl border border-white/60 bg-white/50 p-3">
            <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-500">
                    <TahapIcon name="building" className="h-3.5 w-3.5" />
                    Total PJP
                </span>
                <span className="font-semibold text-slate-800">{stats.total}</span>
            </div>
            {stats.perluPerhatian > 0 && (
                <Link
                    href="/"
                    className="mt-2 flex items-center justify-between rounded-md bg-amber-50 px-2 py-1.5 text-xs font-medium text-amber-800 transition-colors hover:bg-amber-100"
                >
                    <span className="flex items-center gap-1.5">
                        <TahapIcon name="alert" className="h-3.5 w-3.5" />
                        Perlu Perhatian
                    </span>
                    <span className="rounded-full bg-amber-200 px-1.5 py-0.5 text-[11px] font-semibold text-amber-900">
                        {stats.perluPerhatian}
                    </span>
                </Link>
            )}
        </div>
    );
}

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
                        <TahapIcon
                            name={item.icon}
                            className={`h-5 w-5 shrink-0 transition-transform duration-150 ${
                                isActive ? '' : 'text-slate-400 group-hover:text-slate-600'
                            }`}
                        />
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}

export default function Sidebar() {
    const { url, props } = usePage();
    const pathname = url.split('?')[0];
    const [open, setOpen] = useState(false);
    const sidebarStats = (props as { sidebarStats?: SidebarStats }).sidebarStats;

    return (
        <>
            <header className="glass-nav sticky top-0 z-30 flex items-center justify-between border-b border-white/50 px-4 py-3 md:hidden">
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

            <aside className="glass-nav sticky top-0 hidden h-screen w-72 shrink-0 flex-col overflow-y-auto border-r border-white/50 md:flex">
                <div className="border-b border-white/50 px-6 py-5">
                    <LogoWithText />
                </div>
                <NavLinks pathname={pathname} />
                <SidebarSummary stats={sidebarStats} />
                <div className="border-t border-white/50 px-3 py-3">
                    <Link
                        href="/bantuan"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            pathname === '/bantuan'
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                        }`}
                    >
                        <TahapIcon name="help" className="h-5 w-5 shrink-0" />
                        Bantuan
                    </Link>
                </div>
                <div className="border-t border-white/50 px-6 py-4">
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
                    <div className="glass-nav absolute inset-y-0 left-0 flex w-72 max-w-[80%] flex-col shadow-2xl animate-[slide-in-left_0.2s_ease-out]">
                        <div className="flex items-center justify-between border-b border-white/50 px-6 py-5">
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
                        <SidebarSummary stats={sidebarStats} />
                        <div className="border-t border-slate-100 px-3 py-3">
                            <Link
                                href="/bantuan"
                                onClick={() => setOpen(false)}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                    pathname === '/bantuan'
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                }`}
                            >
                                <TahapIcon name="help" className="h-5 w-5 shrink-0" />
                                Bantuan
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
