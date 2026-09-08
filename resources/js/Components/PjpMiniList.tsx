import { Link } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';
import { PjpEvaluasi, SEMESTER_OPTIONS, SmkpScore } from '@/types';

type MiniPjp = {
    id: number;
    nama_perusahaan: string;
    status: string;
    smkpScore?: SmkpScore;
    latestEvaluasi?: PjpEvaluasi | null;
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
            <div className="glass-empty p-6 text-center text-sm text-slate-500">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="glass-card divide-y divide-slate-200/70 overflow-hidden">
            {pjps.map((pjp) => (
                <Link
                    key={pjp.id}
                    href={`/pjp/${pjp.id}`}
                    className="flex flex-col gap-2 px-4 py-3 text-sm hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                    <span className="font-medium text-slate-800">{pjp.nama_perusahaan}</span>
                    <div className="flex flex-wrap items-center gap-2">
                        {pjp.smkpScore && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                                Persyaratan PJP: {pjp.smkpScore.persentase}%
                            </span>
                        )}
                        {pjp.latestEvaluasi && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                                Evaluasi {SEMESTER_OPTIONS[pjp.latestEvaluasi.semester]}{' '}
                                {pjp.latestEvaluasi.tahun}: {pjp.latestEvaluasi.skor_rata_rata}
                            </span>
                        )}
                        {pjp.latestEvaluasi === null && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-400">
                                Belum dievaluasi
                            </span>
                        )}
                        <StatusBadge status={pjp.status} />
                    </div>
                </Link>
            ))}
        </div>
    );
}
