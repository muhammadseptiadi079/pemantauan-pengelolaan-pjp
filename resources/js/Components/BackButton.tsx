export default function BackButton({ className = '' }: { className?: string }) {
    return (
        <button
            type="button"
            onClick={() => window.history.back()}
            className={`shrink-0 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 ${className}`}
        >
            &larr; Kembali
        </button>
    );
}
