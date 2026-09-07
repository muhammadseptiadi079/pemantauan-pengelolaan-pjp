import { Link } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';

type MiniPjp = { id: number; nama_perusahaan: string; status: string };

export default function PjpMiniList({
    pjps,
    emptyMessage = 'Belum ada data PJP pada tahap ini.',
}: {
    pjps: MiniPjp[];
    emptyMessage?: string;
}) {
    if (pjps.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {pjps.map((pjp) => (
                <Link
                    key={pjp.id}
                    href={`/pjp/${pjp.id}/edit`}
                    className="flex items-center justify-between gap-4 px-4 py-3 text-sm hover:bg-slate-50"
                >
                    <span className="font-medium text-slate-800">{pjp.nama_perusahaan}</span>
                    <StatusBadge status={pjp.status} />
                </Link>
            ))}
        </div>
    );
}
