import { useEffect, useState } from 'react';
import { TahapIcon } from '@/Components/TahapIcons';
import { STATUS_OPTIONS } from '@/types';

const STATUS_ORDER = ['aktif', 'perlu_tindak_lanjut', 'tidak_aktif'];

const STATUS_FILL: Record<string, string> = {
    aktif: '#0ca30c',
    perlu_tindak_lanjut: '#fab219',
    tidak_aktif: '#94a3b8',
};

const STATUS_TEXT_ON_FILL: Record<string, string> = {
    aktif: '#ffffff',
    perlu_tindak_lanjut: '#1e293b',
    tidak_aktif: '#1e293b',
};

export type StatusCounts = Record<string, number>;

export default function StatusStackedBar({
    title,
    counts,
}: {
    title: string;
    counts: StatusCounts;
}) {
    const total = STATUS_ORDER.reduce((sum, key) => sum + (counts[key] ?? 0), 0);
    const segments = STATUS_ORDER.map((key) => ({
        key,
        count: counts[key] ?? 0,
        percent: total === 0 ? 0 : ((counts[key] ?? 0) / total) * 100,
    })).filter((segment) => segment.count > 0);

    const [grown, setGrown] = useState(false);
    useEffect(() => {
        const frame = requestAnimationFrame(() => setGrown(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <div className="glass-card p-5">
            <div className="mb-3 flex items-baseline justify-between">
                <h3 className="flex items-center gap-2.5 text-sm font-semibold text-slate-900">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                        <TahapIcon name="check" className="h-4 w-4" />
                    </span>
                    {title}
                </h3>
                <span className="text-xs text-slate-500">{total} PJP</span>
            </div>

            {total === 0 ? (
                <div className="h-5 rounded-full bg-slate-100" />
            ) : (
                <div className="flex h-5 w-full gap-[2px] overflow-hidden rounded-full bg-slate-100">
                    {segments.map((segment) => (
                        <div
                            key={segment.key}
                            className="flex h-full items-center justify-center transition-[flex-grow] duration-700 ease-out first:rounded-l-full last:rounded-r-full"
                            style={{
                                flexGrow: grown ? segment.count : 0,
                                flexBasis: 0,
                                backgroundColor: STATUS_FILL[segment.key],
                            }}
                        >
                            {segment.percent >= 15 && (
                                <span
                                    className="text-[11px] font-semibold leading-none"
                                    style={{ color: STATUS_TEXT_ON_FILL[segment.key] }}
                                >
                                    {Math.round(segment.percent)}%
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <dl className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {STATUS_ORDER.map((key) => {
                    const count = counts[key] ?? 0;
                    const percent =
                        total === 0 ? 0 : Math.round((count / total) * 100);
                    return (
                        <div key={key} className="flex items-center gap-2 text-sm">
                            <span
                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                style={{ backgroundColor: STATUS_FILL[key] }}
                            />
                            <span className="text-slate-600">{STATUS_OPTIONS[key]}</span>
                            <span className="ml-auto font-medium text-slate-900">
                                {percent}%
                            </span>
                        </div>
                    );
                })}
            </dl>
        </div>
    );
}
