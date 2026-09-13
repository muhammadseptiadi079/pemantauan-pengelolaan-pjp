export default function BackButton({
    className = '',
    variant = 'light',
}: {
    className?: string;
    variant?: 'light' | 'dark';
}) {
    const variantClass =
        variant === 'dark'
            ? 'border-white/20 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white'
            : 'border-slate-300 text-slate-700 hover:bg-slate-50';

    return (
        <button
            type="button"
            onClick={() => window.history.back()}
            className={`shrink-0 rounded-lg border px-4 py-2 text-sm font-medium ${variantClass} ${className}`}
        >
            &larr; Kembali
        </button>
    );
}
