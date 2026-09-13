export default function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
    return (
        <img
            src="/images/logo-mark.png"
            alt="Logo"
            className={`shrink-0 object-contain drop-shadow-sm ${className}`}
        />
    );
}

export function LogoWithText({ dark = false }: { dark?: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <LogoMark />
            <div className="leading-tight">
                <p className={`text-sm font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>
                    Pemantauan &amp; Pengelolaan PJP
                </p>
                <p className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Perusahaan Jasa Pertambangan
                </p>
            </div>
        </div>
    );
}
