import { TahapIcon } from '@/Components/TahapIcons';

function greeting(): string {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat pagi';
    if (hour < 15) return 'Selamat siang';
    if (hour < 19) return 'Selamat sore';
    return 'Selamat malam';
}

// Isi bareng dipakai di header mobile (Sidebar.tsx, sebaris dengan tombol
// hamburger) dan di TopBar desktop di bawah ini — sengaja tanpa nama
// pengguna atau lonceng berisi notifikasi sungguhan, karena aplikasi ini
// belum punya sistem login: ini placeholder visual, bukan data asli.
export function TopBarContent() {
    return (
        <div className="flex items-center gap-3">
            <p className="truncate text-sm text-slate-600">
                <span className="hidden sm:inline">{greeting()}</span>
                <span className="sm:hidden">Halo</span> <span aria-hidden="true">👋</span>
            </p>
            <span className="ml-auto flex shrink-0 items-center gap-2">
                <span
                    title="Notifikasi"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500"
                >
                    <TahapIcon name="bell" className="h-4 w-4" />
                </span>
                <span
                    title="Akun"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-600"
                >
                    <TahapIcon name="user" className="h-4 w-4" />
                </span>
            </span>
        </div>
    );
}

export default function TopBar() {
    return (
        <div className="glass-nav sticky top-0 z-20 hidden items-center border-b border-white/50 px-8 py-3 md:flex">
            <TopBarContent />
        </div>
    );
}
