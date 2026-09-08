const R = 46;
const STROKE = 16;
const CIRCUMFERENCE = 2 * Math.PI * R;
const GAP = 2;

function bandColorFor(value: number): string {
    if (value >= 80) return '#0ca30c';
    if (value >= 60) return '#fab219';
    if (value >= 40) return '#ec835a';
    return '#d03b3b';
}

export default function SmkpDonutChart({
    persentase,
    onAchievedClick,
    onGapClick,
}: {
    persentase: number;
    onAchievedClick?: () => void;
    onGapClick?: () => void;
}) {
    const achieved = Math.round(Math.min(Math.max(persentase, 0), 100) * 10) / 10;
    const gap = Math.round((100 - achieved) * 10) / 10;
    const achievedColor = bandColorFor(achieved);

    const achievedLength = Math.max((achieved / 100) * CIRCUMFERENCE - GAP, 0);
    const gapLength = Math.max((gap / 100) * CIRCUMFERENCE - GAP, 0);
    const gapOffset = -((achieved / 100) * CIRCUMFERENCE) - GAP;

    return (
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
            <svg viewBox="0 0 120 120" className="h-32 w-32 shrink-0">
                <circle cx="60" cy="60" r={R} fill="none" stroke="#e2e8f0" strokeWidth={STROKE} />
                <g transform="rotate(-90 60 60)">
                    <circle
                        cx="60"
                        cy="60"
                        r={R}
                        fill="none"
                        stroke={achievedColor}
                        strokeWidth={STROKE}
                        strokeLinecap="round"
                        strokeDasharray={`${achievedLength} ${CIRCUMFERENCE}`}
                        className={onAchievedClick ? 'cursor-pointer transition-opacity hover:opacity-80' : ''}
                        onClick={onAchievedClick}
                    >
                        <title>{`Sudah lengkap: ${achieved}%`}</title>
                    </circle>
                    {gapLength > 0 && (
                        <circle
                            cx="60"
                            cy="60"
                            r={R}
                            fill="none"
                            stroke="#cbd5e1"
                            strokeWidth={STROKE}
                            strokeLinecap="round"
                            strokeDasharray={`${gapLength} ${CIRCUMFERENCE}`}
                            strokeDashoffset={gapOffset}
                            className={onGapClick ? 'cursor-pointer transition-opacity hover:opacity-80' : ''}
                            onClick={onGapClick}
                        >
                            <title>{`Belum lengkap: ${gap}%`}</title>
                        </circle>
                    )}
                </g>
                <text x="60" y="57" textAnchor="middle" className="fill-slate-900 font-bold" style={{ fontSize: '20px' }}>
                    {achieved}%
                </text>
                <text x="60" y="74" textAnchor="middle" className="fill-slate-400" style={{ fontSize: '9px' }}>
                    Lengkap
                </text>
            </svg>

            <div className="w-full space-y-2">
                <button
                    type="button"
                    onClick={onAchievedClick}
                    disabled={!onAchievedClick}
                    className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 disabled:cursor-default disabled:hover:bg-transparent"
                >
                    <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: achievedColor }} />
                        Sudah lengkap
                    </span>
                    <span className="font-semibold text-slate-700">{achieved}%</span>
                </button>
                <button
                    type="button"
                    onClick={onGapClick}
                    disabled={!onGapClick}
                    className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 disabled:cursor-default disabled:hover:bg-transparent"
                >
                    <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-slate-300" />
                        Belum lengkap — perlu ditindaklanjuti
                    </span>
                    <span className="font-semibold text-slate-700">{gap}%</span>
                </button>
            </div>
        </div>
    );
}
