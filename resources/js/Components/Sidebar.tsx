import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const navItems = [
    { href: '/', label: 'Beranda' },
    { href: '/pjp', label: 'Data PJP' },
    {
        href: '/persyaratan-seleksi-penetapan',
        label: '1. Persyaratan, Seleksi, Penetapan',
    },
    {
        href: '/tanggung-jawab-pemantauan-pelaporan',
        label: '2. Tanggung Jawab, Pemantauan, Pelaporan',
    },
    { href: '/evaluasi', label: '3. Evaluasi' },
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
                        className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                            isActive
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
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
                <p className="text-sm font-semibold text-slate-900">
                    Pemantauan &amp; Pengelolaan PJP
                </p>
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-label="Buka menu navigasi"
                    className="rounded-md p-2 text-slate-600 hover:bg-slate-100"
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
                    <p className="text-sm font-semibold text-slate-900">
                        Pemantauan &amp; Pengelolaan PJP
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                        Perusahaan Jasa Pertambangan
                    </p>
                </div>
                <NavLinks pathname={pathname} />
            </aside>

            {open && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setOpen(false)}
                        aria-hidden="true"
                    />
                    <div className="absolute inset-y-0 left-0 flex w-72 max-w-[80%] flex-col bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                            <div>
                                <p className="text-sm font-semibold text-slate-900">
                                    Pemantauan &amp; Pengelolaan PJP
                                </p>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    Perusahaan Jasa Pertambangan
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Tutup menu navigasi"
                                className="rounded-md p-2 text-slate-600 hover:bg-slate-100"
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
