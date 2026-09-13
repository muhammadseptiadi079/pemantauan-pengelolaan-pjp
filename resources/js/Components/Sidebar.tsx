import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import LogoMark, { LogoWithText } from '@/Components/Logo';
import { TahapIcon } from '@/Components/TahapIcons';
import { TopBarContent } from '@/Components/TopBar';
import { navItems } from '@/navigation';

type SidebarStats = { total: number; perluPerhatian: number };

function SidebarSummary({ stats }: { stats?: SidebarStats }) {
    if (!stats) return null;

    return (
        <div className="mx-3 mb-3 rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-400">
                    <TahapIcon name="building" className="h-3.5 w-3.5" />
                    Total PJP
                </span>
                <span className="font-semibold text-white">{stats.total}</span>
            </div>
            {stats.perluPerhatian > 0 && (
                <Link
                    href="/"
                    className="mt-2 flex items-center justify-between rounded-md bg-amber-500/15 px-2 py-1.5 text-xs font-medium text-amber-300 transition-colors hover:bg-amber-500/25"
                >
                    <span className="flex items-center gap-2">
                        <span className="pulse-ring flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-300">
                            <TahapIcon name="alert" className="h-3 w-3" />
                        </span>
                        Perlu Perhatian
                    </span>
                    <span className="rounded-full bg-amber-400/25 px-1.5 py-0.5 text-[11px] font-semibold text-amber-200">
                        {stats.perluPerhatian}
                    </span>
                </Link>
            )}
        </div>
    );
}

function HelpPill({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
    return (
        <div className="px-3 py-3">
            <Link
                href="/bantuan"
                onClick={onNavigate}
                className={`flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === '/bantuan'
                        ? 'border-orange-500/40 bg-orange-500/15 text-orange-300'
                        : 'border-white/15 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
            >
                <TahapIcon name="help" className="h-4 w-4 shrink-0" />
                Butuh bantuan?
            </Link>
        </div>
    );
}

function SidebarBanner() {
    return (
        <div className="mx-3 mb-3 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-orange-600/25 via-neutral-900 to-black p-4">
            <LogoMark className="h-7 w-7" />
            <p className="mt-3 text-sm font-semibold leading-snug text-white">
                PJP Terpantau, Operasi Lebih Aman
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
                Satu tempat untuk persyaratan, pelaporan, dan evaluasi kinerja PJP.
            </p>
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
                                ? 'border-orange-500 bg-orange-500/10 text-white'
                                : 'border-transparent text-slate-400 hover:border-white/20 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <TahapIcon
                            name={item.icon}
                            className={`h-5 w-5 shrink-0 transition-transform duration-150 group-hover:scale-110 ${
                                isActive ? 'text-orange-400' : 'text-slate-500 group-hover:text-slate-300'
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
            <header className="glass-nav sticky top-0 z-30 flex items-center gap-3 border-b border-white/50 px-4 py-3 md:hidden">
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-label="Buka menu navigasi"
                    className="shrink-0 rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100"
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
                <TopBarContent />
            </header>

            <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col overflow-y-auto border-r border-white/10 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black md:flex">
                <div className="border-b border-white/10 px-6 py-5">
                    <LogoWithText dark />
                </div>
                <NavLinks pathname={pathname} />
                <SidebarSummary stats={sidebarStats} />
                <HelpPill pathname={pathname} />
                <SidebarBanner />
                <div className="border-t border-white/10 px-6 py-4">
                    <p className="text-[11px] leading-relaxed text-slate-500">
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
                    <div className="absolute inset-y-0 left-0 flex w-72 max-w-[80%] flex-col bg-gradient-to-b from-neutral-900 via-neutral-950 to-black shadow-2xl animate-[slide-in-left_0.2s_ease-out]">
                        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                            <LogoWithText dark />
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Tutup menu navigasi"
                                className="rounded-md p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
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
                        <HelpPill pathname={pathname} onNavigate={() => setOpen(false)} />
                        <SidebarBanner />
                    </div>
                </div>
            )}
        </>
    );
}
