import { STATUS_OPTIONS } from '@/types';

const COLORS: Record<string, string> = {
    aktif: 'bg-green-50 text-green-700',
    perlu_tindak_lanjut: 'bg-amber-50 text-amber-700',
    tidak_aktif: 'bg-slate-100 text-slate-600',
};

export default function StatusBadge({ status }: { status: string }) {
    return (
        <span
            className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                COLORS[status] ?? 'bg-slate-100 text-slate-600'
            }`}
        >
            {STATUS_OPTIONS[status] ?? status}
        </span>
    );
}
