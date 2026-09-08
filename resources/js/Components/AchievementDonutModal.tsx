import { router } from '@inertiajs/react';

const R = 62;
const STROKE = 22;
const CIRCUMFERENCE = 2 * Math.PI * R;
const GAP = 3;

function bandColorFor(value: number): string {
    if (value >= 80) return '#0ca30c';
    if (value >= 60) return '#fab219';
    if (value >= 40) return '#ec835a';
    return '#d03b3b';
}

export type DonutTarget = { id: number; label: string; value: number };

export default function AchievementDonutModal({
    pjp,
    onClose,
}: {
    pjp: DonutTarget | null;
    onClose: () => void;
}) {
    if (!pjp) return null;

    const achieved = Math.round(Math.min(Math.max(pjp.value, 0), 100) * 10) / 10;
    const gap = Math.round((100 - achieved) * 10) / 10;
    const achievedColor = bandColorFor(achieved);

    const achievedLength = Math.max((achieved / 100) * CIRCUMFERENCE - GAP, 0);
    const gapLength = Math.max((gap / 100) * CIRCUMFERENCE - GAP, 0);
    const gapOffset = -((achieved / 100) * CIRCUMFERENCE) - GAP;

    const goToDetail = () => router.visit(`/pjp/${pjp.id}`);
    const goToChecklist = () => router.visit(`/pjp/${pjp.id}/checklist-smkp`);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-[fade-in_0.15s_ease-out]"
            onClick={onClose}
        >
            <div
                className="glass-card pop-in w-full max-w-sm p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-xs font-medium text-slate-500">Persyaratan PJP</p>
                        <h3 className="text-base font-semibold text-slate-900">{pjp.label}</h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Tutup"
                        className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-5 w-5"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="my-5 flex justify-center">
                    <svg viewBox="0 0 160 160" className="h-44 w-44">
                        <circle cx="80" cy="80" r={R} fill="none" stroke="#e2e8f0" strokeWidth={STROKE} />
                        <g transform="rotate(-90 80 80)">
                            <circle
                                cx="80"
                                cy="80"
                                r={R}
                                fill="none"
                                stroke={achievedColor}
                                strokeWidth={STROKE}
                                strokeLinecap="round"
                                strokeDasharray={`${achievedLength} ${CIRCUMFERENCE}`}
                                className="cursor-pointer transition-opacity hover:opacity-80"
                                onClick={goToDetail}
                            >
                                <title>{`Tercapai: ${achieved}% — klik untuk lihat detail PJP`}</title>
                            </circle>
                            {gapLength > 0 && (
                                <circle
                                    cx="80"
                                    cy="80"
                                    r={R}
                                    fill="none"
                                    stroke="#cbd5e1"
                                    strokeWidth={STROKE}
                                    strokeLinecap="round"
                                    strokeDasharray={`${gapLength} ${CIRCUMFERENCE}`}
                                    strokeDashoffset={gapOffset}
                                    className="cursor-pointer transition-opacity hover:opacity-80"
                                    onClick={goToChecklist}
                                >
                                    <title>{`Kekurangan: ${gap}% — klik untuk lengkapi checklist`}</title>
                                </circle>
                            )}
                        </g>
                        <text
                            x="80"
                            y="76"
                            textAnchor="middle"
                            className="fill-slate-900 font-bold"
                            style={{ fontSize: '26px' }}
                        >
                            {achieved}%
                        </text>
                        <text
                            x="80"
                            y="97"
                            textAnchor="middle"
                            className="fill-slate-400"
                            style={{ fontSize: '11px' }}
                        >
                            Tercapai
                        </text>
                    </svg>
                </div>

                <div className="space-y-2">
                    <button
                        type="button"
                        onClick={goToDetail}
                        className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 text-sm hover:bg-slate-50"
                    >
                        <span className="flex items-center gap-2">
                            <span
                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                style={{ backgroundColor: achievedColor }}
                            />
                            Tercapai — lihat detail PJP
                        </span>
                        <span className="font-semibold text-slate-700">{achieved}%</span>
                    </button>
                    <button
                        type="button"
                        onClick={goToChecklist}
                        className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 text-sm hover:bg-slate-50"
                    >
                        <span className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-slate-300" />
                            Kekurangan — lengkapi checklist
                        </span>
                        <span className="font-semibold text-slate-700">{gap}%</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
