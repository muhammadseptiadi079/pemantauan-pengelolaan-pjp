import { useEffect, useState } from 'react';
import { TahapIcon } from '@/Components/TahapIcons';
import { PjpEvaluasi } from '@/types';

// Palet kategorikal (identitas per PJP, bukan status) — urutan tetap, tidak
// pernah dirotasi ulang, dan sengaja beda dari 4 warna status achievement
// (hijau/kuning/oranye/merah) supaya tidak tertukar makna.
const CATEGORICAL = [
    '#2a78d6', '#eb6834', '#1baf7a', '#eda100',
    '#e87ba4', '#008300', '#4a3aa7', '#e34948',
];
const MAX_SERIES = CATEGORICAL.length;

type Series = { id: number; label: string; points: PjpEvaluasi[] };
type Period = { tahun: number; semester: number };

function periodKey(tahun: number, semester: number): string {
    return `${tahun}-${semester}`;
}

export default function EvaluasiTrendComparison({ series }: { series: Series[] }) {
    const withData = series.filter((s) => s.points.length > 0);

    const [grown, setGrown] = useState(false);
    useEffect(() => {
        const frame = requestAnimationFrame(() => setGrown(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    if (withData.length === 0) {
        return null;
    }

    const periodMap = new Map<string, Period>();
    withData.forEach((s) =>
        s.points.forEach((p) => periodMap.set(periodKey(p.tahun, p.semester), { tahun: p.tahun, semester: p.semester })),
    );
    const periods = Array.from(periodMap.values()).sort(
        (a, b) => a.tahun - b.tahun || a.semester - b.semester,
    );

    if (periods.length === 0) {
        return null;
    }

    const width = 640;
    const height = 220;
    const padLeft = 32;
    const padRight = 12;
    const padTop = 14;
    const padBottom = 26;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const xFor = (tahun: number, semester: number) => {
        const idx = periods.findIndex((p) => p.tahun === tahun && p.semester === semester);
        return periods.length <= 1 ? padLeft + plotW / 2 : padLeft + (idx / (periods.length - 1)) * plotW;
    };
    const yFor = (score: number) => padTop + (1 - score / 100) * plotH;

    const shown = withData.slice(0, MAX_SERIES);
    const overflow = withData.length - shown.length;

    return (
        <div className="glass-card mb-14 p-5">
            <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                    <TahapIcon name="evaluasi" className="h-4 w-4" />
                </span>
                <h3 className="text-sm font-semibold text-slate-900">
                    Perbandingan Tren Evaluasi Antar PJP
                </h3>
            </div>

            <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: 260 }}>
                <rect
                    x={padLeft}
                    y={padTop}
                    width={plotW}
                    height={plotH}
                    rx={12}
                    fill="rgba(148, 163, 184, 0.06)"
                />
                {[0, 50, 100].map((value) => (
                    <g key={value}>
                        <line
                            x1={padLeft}
                            x2={width - padRight}
                            y1={yFor(value)}
                            y2={yFor(value)}
                            stroke="#e1e0d9"
                            strokeWidth={1}
                        />
                        <text
                            x={padLeft - 6}
                            y={yFor(value)}
                            textAnchor="end"
                            dominantBaseline="middle"
                            fontSize={10}
                            fill="#898781"
                        >
                            {value}
                        </text>
                    </g>
                ))}

                {periods.map((p, i) => (
                    <text
                        key={i}
                        x={xFor(p.tahun, p.semester)}
                        y={height - 8}
                        textAnchor="middle"
                        fontSize={10}
                        fill="#898781"
                    >
                        S{p.semester}&apos;{String(p.tahun).slice(2)}
                    </text>
                ))}

                {shown.map((s, si) => {
                    const color = CATEGORICAL[si];
                    const points = s.points.map((p) => ({
                        x: xFor(p.tahun, p.semester),
                        y: yFor(p.skor_rata_rata),
                        label: `${s.label} — S${p.semester} ${p.tahun}: ${p.skor_rata_rata}`,
                    }));
                    const path = points.map((p) => `${p.x},${p.y}`).join(' ');

                    return (
                        <g key={s.id}>
                            {points.length > 1 && (
                                <polyline
                                    points={path}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth={2.5}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{
                                        opacity: grown ? 1 : 0,
                                        transition: 'opacity 0.6s ease-out',
                                        filter: `drop-shadow(0 2px 5px ${color}66)`,
                                    }}
                                />
                            )}
                            {points.map((p, i) => (
                                <circle
                                    key={i}
                                    cx={p.x}
                                    cy={p.y}
                                    r={4.5}
                                    fill={color}
                                    stroke="#fcfcfb"
                                    strokeWidth={2}
                                    style={{
                                        opacity: grown ? 1 : 0,
                                        transition: `opacity 0.3s ease-out ${0.2 + i * 0.08}s`,
                                        filter: `drop-shadow(0 1px 3px ${color}80)`,
                                    }}
                                >
                                    <title>{p.label}</title>
                                </circle>
                            ))}
                        </g>
                    );
                })}
            </svg>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-slate-100 pt-3">
                {shown.map((s, si) => (
                    <span key={s.id} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <span
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ backgroundColor: CATEGORICAL[si] }}
                        />
                        {s.label}
                    </span>
                ))}
                {overflow > 0 && (
                    <span className="text-xs text-slate-400">+{overflow} PJP lainnya</span>
                )}
            </div>
        </div>
    );
}
