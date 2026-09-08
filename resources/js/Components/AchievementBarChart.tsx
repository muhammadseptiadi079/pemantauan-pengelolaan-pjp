import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AnimatedNumber from '@/Components/AnimatedNumber';
import { TahapIcon } from '@/Components/TahapIcons';

function decimalsFor(value: number): number {
    return Number.isInteger(value) ? 0 : 1;
}

type AchievementItem = {
    id: number;
    label: string;
    value: number | null;
};

const BANDS = [
    { min: 80, fill: '#0ca30c', from: '#4ade80', label: 'Baik (>=80)' },
    { min: 60, fill: '#fab219', from: '#fde047', label: 'Perlu Perhatian (60-79)' },
    { min: 40, fill: '#ec835a', from: '#fdba74', label: 'Perlu Tindak Lanjut (40-59)' },
    { min: 0, fill: '#d03b3b', from: '#f87171', label: 'Kritis (<40)' },
];

function bandFor(value: number) {
    return BANDS.find((band) => value >= band.min) ?? BANDS[BANDS.length - 1];
}

export default function AchievementBarChart({
    title,
    emptyMessage,
    noDataLabel,
    items,
    onItemClick,
}: {
    title: string;
    emptyMessage: string;
    noDataLabel: string;
    items: AchievementItem[];
    /**
     * Kalau diisi, baris dengan `value` terisi memicu ini alih-alih langsung
     * pindah ke `/pjp/{id}` — dipakai halaman Persyaratan untuk membuka
     * popup donut ketimbang lompat ke detail. Baris tanpa skor (`value`
     * null) tetap jadi link biasa karena tidak ada apa-apa untuk ditampilkan
     * di donut.
     */
    onItemClick?: (item: AchievementItem) => void;
}) {
    const scored = items
        .filter((item) => item.value !== null)
        .sort((a, b) => (a.value as number) - (b.value as number));
    const unscored = items
        .filter((item) => item.value === null)
        .sort((a, b) => a.label.localeCompare(b.label));
    const rows = [...scored, ...unscored];

    const [grown, setGrown] = useState(false);
    useEffect(() => {
        const frame = requestAnimationFrame(() => setGrown(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <div className="glass-card p-5">
            <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2">
                <h3 className="flex items-center gap-2.5 text-sm font-semibold text-slate-900">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                        <TahapIcon name="alert" className="h-4 w-4" />
                    </span>
                    {title}
                </h3>
                <span className="text-xs text-slate-500">
                    Urut dari yang paling perlu ditindaklanjuti
                </span>
            </div>

            {rows.length === 0 ? (
                <p className="py-4 text-center text-sm text-slate-500">{emptyMessage}</p>
            ) : (
                <div className="space-y-2">
                    {rows.map((item, index) => {
                        const band = item.value !== null ? bandFor(item.value) : null;
                        const valueDisplay =
                            item.value !== null ? (
                                <>
                                    <AnimatedNumber value={item.value} decimals={decimalsFor(item.value)} />%
                                </>
                            ) : (
                                noDataLabel
                            );
                        const rowClassName =
                            'row-in flex w-full flex-col gap-1.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:gap-3 sm:py-1.5';
                        const rowTitle =
                            item.value !== null
                                ? `${item.label}: ${item.value}%`
                                : `${item.label}: ${noDataLabel}`;
                        const rowContent = (
                            <>
                                <div className="flex items-center justify-between gap-2 sm:w-64 sm:shrink-0 sm:justify-start">
                                    <span className="text-sm text-slate-700">
                                        {item.label}
                                    </span>
                                    <span className="shrink-0 text-xs font-medium text-slate-600 sm:hidden">
                                        {valueDisplay}
                                    </span>
                                </div>
                                <span className="h-3 w-full overflow-hidden rounded-full bg-slate-200/50 shadow-inner sm:flex-1">
                                    {item.value !== null && band && (
                                        <span
                                            className="block h-full rounded-full transition-[width] duration-700 ease-out"
                                            style={{
                                                width: grown ? `${Math.max(item.value, 2)}%` : '0%',
                                                backgroundImage: `linear-gradient(90deg, ${band.from}, ${band.fill})`,
                                                boxShadow: `0 0 10px 0 ${band.fill}66`,
                                            }}
                                        />
                                    )}
                                </span>
                                <span className="hidden shrink-0 text-right text-xs font-medium text-slate-600 sm:block sm:w-28">
                                    {valueDisplay}
                                </span>
                            </>
                        );

                        if (onItemClick && item.value !== null) {
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => onItemClick(item)}
                                    className={rowClassName}
                                    style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
                                    title={rowTitle}
                                >
                                    {rowContent}
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={item.id}
                                href={`/pjp/${item.id}`}
                                className={rowClassName}
                                style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
                                title={rowTitle}
                            >
                                {rowContent}
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
