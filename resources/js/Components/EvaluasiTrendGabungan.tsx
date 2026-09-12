import { useEffect, useId, useRef, useState } from 'react';
import { TahapIcon } from '@/Components/TahapIcons';
import { EvaluasiTrendPoint, SEMESTER_OPTIONS } from '@/types';

export default function EvaluasiTrendGabungan({ points }: { points: EvaluasiTrendPoint[] }) {
    const gradientId = useId();
    const polylineRef = useRef<SVGPolylineElement>(null);
    const [lineLength, setLineLength] = useState(0);
    const [grown, setGrown] = useState(false);

    useEffect(() => {
        if (polylineRef.current) {
            setLineLength(polylineRef.current.getTotalLength());
        }
        const frame = requestAnimationFrame(() => setGrown(true));
        return () => cancelAnimationFrame(frame);
    }, [points]);

    if (points.length < 2) {
        return null;
    }

    const width = 600;
    const height = 140;
    const padX = 20;
    const padY = 16;
    const step = (width - padX * 2) / (points.length - 1);

    const coords = points.map((point, index) => ({
        x: padX + index * step,
        y: padY + (1 - point.rata_rata / 100) * (height - padY * 2),
        point,
    }));

    const path = coords.map((c) => `${c.x},${c.y}`).join(' ');
    const areaPath = `${padX},${height} ${path} ${width - padX},${height}`;
    const first = points[0];
    const last = points[points.length - 1];

    return (
        <div className="glass-card mb-10 p-5">
            <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                    <TahapIcon name="evaluasi" className="h-4 w-4" />
                </span>
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                        Tren Rata-Rata Skor Evaluasi Seluruh PJP
                    </h3>
                    <p className="text-xs text-slate-500">
                        Rata-rata skor evaluasi kinerja semua PJP per semester — untuk melihat
                        arah portofolio secara keseluruhan, bukan per perusahaan.
                    </p>
                </div>
            </div>

            <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2a78d6" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#2a78d6" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <rect
                    x={padX}
                    y={padY}
                    width={width - padX * 2}
                    height={height - padY * 2}
                    fill="rgba(148, 163, 184, 0.06)"
                    rx={10}
                />
                <polygon
                    points={areaPath}
                    fill={`url(#${gradientId})`}
                    style={{ opacity: grown ? 1 : 0, transition: 'opacity 0.9s ease-out' }}
                />
                <polyline
                    ref={polylineRef}
                    points={path}
                    fill="none"
                    stroke="#2a78d6"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                        strokeDasharray: lineLength,
                        strokeDashoffset: grown ? 0 : lineLength,
                        transition: 'stroke-dashoffset 0.9s ease-out',
                        filter: 'drop-shadow(0 2px 5px rgba(42,120,214,0.35))',
                    }}
                />
                {coords.map((c, index) => (
                    <circle
                        key={`${c.point.tahun}-${c.point.semester}`}
                        cx={c.x}
                        cy={c.y}
                        r={index === coords.length - 1 ? 5 : 4}
                        fill="#2a78d6"
                        stroke="#fcfcfb"
                        strokeWidth={2}
                        style={{
                            opacity: grown ? 1 : 0,
                            transition: `opacity 0.3s ease-out ${0.3 + index * 0.1}s`,
                        }}
                    >
                        <title>
                            {`${SEMESTER_OPTIONS[c.point.semester]} ${c.point.tahun}: ${c.point.rata_rata} (rata-rata dari ${c.point.jumlah_pjp} PJP)`}
                        </title>
                    </circle>
                ))}
            </svg>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                <span>
                    {SEMESTER_OPTIONS[first.semester]} {first.tahun}
                </span>
                <span className="font-semibold text-slate-600">Terakhir: {last.rata_rata}</span>
                <span>
                    {SEMESTER_OPTIONS[last.semester]} {last.tahun}
                </span>
            </div>
        </div>
    );
}
