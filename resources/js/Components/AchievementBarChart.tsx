import { Link } from '@inertiajs/react';

type AchievementItem = {
    id: number;
    label: string;
    value: number | null;
};

const BANDS = [
    { min: 80, fill: '#0ca30c', label: 'Baik (>=80)' },
    { min: 60, fill: '#fab219', label: 'Perlu Perhatian (60-79)' },
    { min: 40, fill: '#ec835a', label: 'Perlu Tindak Lanjut (40-59)' },
    { min: 0, fill: '#d03b3b', label: 'Kritis (<40)' },
];

function bandFor(value: number) {
    return BANDS.find((band) => value >= band.min) ?? BANDS[BANDS.length - 1];
}

export default function AchievementBarChart({
    title,
    emptyMessage,
    noDataLabel,
    items,
}: {
    title: string;
    emptyMessage: string;
    noDataLabel: string;
    items: AchievementItem[];
}) {
    const scored = items
        .filter((item) => item.value !== null)
        .sort((a, b) => (a.value as number) - (b.value as number));
    const unscored = items
        .filter((item) => item.value === null)
        .sort((a, b) => a.label.localeCompare(b.label));
    const rows = [...scored, ...unscored];

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-baseline justify-between">
                <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                <span className="text-xs text-slate-500">
                    Urut dari yang paling perlu ditindaklanjuti
                </span>
            </div>

            {rows.length === 0 ? (
                <p className="py-4 text-center text-sm text-slate-500">{emptyMessage}</p>
            ) : (
                <div className="space-y-2">
                    {rows.map((item) => {
                        const band = item.value !== null ? bandFor(item.value) : null;
                        return (
                            <Link
                                key={item.id}
                                href={`/pjp/${item.id}`}
                                className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-50"
                                title={
                                    item.value !== null
                                        ? `${item.label}: ${item.value}%`
                                        : `${item.label}: ${noDataLabel}`
                                }
                            >
                                <span className="w-48 shrink-0 truncate text-sm text-slate-700">
                                    {item.label}
                                </span>
                                <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                                    {item.value !== null && (
                                        <span
                                            className="block h-full rounded-r-full"
                                            style={{
                                                width: `${Math.max(item.value, 2)}%`,
                                                backgroundColor: band?.fill,
                                            }}
                                        />
                                    )}
                                </span>
                                <span className="w-28 shrink-0 text-right text-xs font-medium text-slate-600">
                                    {item.value !== null ? `${item.value}%` : noDataLabel}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            )}

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-100 pt-3">
                {BANDS.map((band) => (
                    <span key={band.label} className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ backgroundColor: band.fill }}
                        />
                        {band.label}
                    </span>
                ))}
            </div>
        </div>
    );
}
