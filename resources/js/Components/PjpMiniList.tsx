import { Link } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';
import { SmkpScore } from '@/types';

type MiniPjp = {
    id: number;
    nama_perusahaan: string;
    status: string;
    smkpScore?: SmkpScore;
};

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
                    href={`/pjp/${pjp.id}`}
                    className="flex items-center justify-between gap-4 px-4 py-3 text-sm hover:bg-slate-50"
                >
                    <span className="font-medium text-slate-800">{pjp.nama_perusahaan}</span>
                    <div className="flex items-center gap-3">
                        {pjp.smkpScore && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                                Persyaratan PJP: {pjp.smkpScore.persentase}%
                            </span>
                        )}
                        <StatusBadge status={pjp.status} />
                    </div>
                </Link>
            ))}
        </div>
    );
}
