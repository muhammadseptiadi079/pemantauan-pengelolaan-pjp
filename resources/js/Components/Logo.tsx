export default function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
    return (
        <span
            className={`flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-sm ${className}`}
        >
            <svg viewBox="0 0 24 24" fill="none" className="h-[55%] w-[55%]">
                <path
                    d="M12 2 4 5v6c0 5 3.4 8.6 8 11 4.6-2.4 8-6 8-11V5l-8-3Z"
                    fill="currentColor"
                    fillOpacity="0.2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                />
                <path
                    d="m8.5 12.2 2.4 2.4L16 9.4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </span>
    );
}

export function LogoWithText() {
    return (
        <div className="flex items-center gap-3">
            <LogoMark />
            <div className="leading-tight">
                <p className="text-sm font-semibold text-slate-900">
                    Pemantauan &amp; Pengelolaan PJP
                </p>
                <p className="text-xs text-slate-500">Perusahaan Jasa Pertambangan</p>
            </div>
        </div>
    );
}
