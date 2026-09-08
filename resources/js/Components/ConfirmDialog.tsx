export default function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = 'Hapus',
    variant = 'danger',
    onConfirm,
    onCancel,
}: {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    variant?: 'danger' | 'primary';
    onConfirm: () => void;
    onCancel: () => void;
}) {
    if (!open) return null;

    const confirmClass =
        variant === 'primary'
            ? 'rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'
            : 'rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-[fade-in_0.15s_ease-out]">
            <div className="glass-card pop-in w-full max-w-sm p-6 shadow-2xl">
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{message}</p>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Batal
                    </button>
                    <button type="button" onClick={onConfirm} className={confirmClass}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
