import { router, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { PjpEvaluasi, SEMESTER_OPTIONS } from '@/types';

function scoreColor(skor: number): string {
    if (skor >= 80) return 'text-green-700';
    if (skor >= 60) return 'text-blue-700';
    if (skor >= 40) return 'text-amber-700';
    return 'text-red-700';
}

export default function EvaluasiCard({
    pjpId,
    evaluasis,
}: {
    pjpId: number;
    evaluasis: PjpEvaluasi[];
}) {
    const [toDelete, setToDelete] = useState<PjpEvaluasi | null>(null);
    const currentYear = new Date().getFullYear();

    const { data, setData, post, processing, errors, reset } = useForm<{
        tahun: number;
        semester: number;
        skor_teknis: string;
        skor_keselamatan_kesehatan: string;
        skor_lingkungan: string;
        catatan: string;
    }>({
        tahun: currentYear,
        semester: 1,
        skor_teknis: '',
        skor_keselamatan_kesehatan: '',
        skor_lingkungan: '',
        catatan: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/pjp/${pjpId}/evaluasi`, {
            preserveScroll: true,
            onSuccess: () =>
                reset('skor_teknis', 'skor_keselamatan_kesehatan', 'skor_lingkungan', 'catatan'),
        });
    };

    const confirmDelete = () => {
        if (toDelete) {
            router.delete(`/pjp/${pjpId}/evaluasi/${toDelete.id}`, { preserveScroll: true });
            setToDelete(null);
        }
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="font-semibold text-slate-900">Evaluasi Kinerja per Semester</h3>
            <p className="mt-1 text-xs text-slate-500">
                Skor 3 aspek (0-100): Teknis, Keselamatan &amp; Kesehatan, Lingkungan.
            </p>

            {evaluasis.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">Belum ada data evaluasi.</p>
            ) : (
                <ul className="mt-3 divide-y divide-slate-100">
                    {evaluasis.map((e) => (
                        <li key={e.id} className="space-y-1.5 py-3 text-sm">
                            <div className="flex items-center justify-between gap-3">
                                <span className="font-medium text-slate-800">
                                    {SEMESTER_OPTIONS[e.semester]} {e.tahun}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setToDelete(e)}
                                    className="shrink-0 text-xs font-medium text-red-600 hover:text-red-800"
                                >
                                    Hapus
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                                <span>Teknis: {e.skor_teknis}</span>
                                <span>K3: {e.skor_keselamatan_kesehatan}</span>
                                <span>Lingkungan: {e.skor_lingkungan}</span>
                                <span className={`font-semibold ${scoreColor(e.skor_rata_rata)}`}>
                                    Rata-rata: {e.skor_rata_rata}
                                </span>
                            </div>
                            {e.catatan && (
                                <p className="text-xs italic text-slate-500">{e.catatan}</p>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <form onSubmit={submit} className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                <div className="grid gap-2 sm:grid-cols-2">
                    <select
                        value={data.semester}
                        onChange={(e) => setData('semester', Number(e.target.value))}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                    >
                        {Object.entries(SEMESTER_OPTIONS).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        value={data.tahun}
                        onChange={(e) => setData('tahun', Number(e.target.value))}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                    />
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                    <input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="Skor Teknis"
                        value={data.skor_teknis}
                        onChange={(e) => setData('skor_teknis', e.target.value)}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="Skor K3"
                        value={data.skor_keselamatan_kesehatan}
                        onChange={(e) => setData('skor_keselamatan_kesehatan', e.target.value)}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="Skor Lingkungan"
                        value={data.skor_lingkungan}
                        onChange={(e) => setData('skor_lingkungan', e.target.value)}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                    />
                </div>
                {(errors.skor_teknis || errors.skor_keselamatan_kesehatan || errors.skor_lingkungan) && (
                    <p className="text-sm text-red-600">Skor harus diisi, angka 0-100.</p>
                )}
                <textarea
                    placeholder="Catatan (opsional)"
                    value={data.catatan}
                    onChange={(e) => setData('catatan', e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                />
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    Simpan Evaluasi
                </button>
            </form>

            <ConfirmDialog
                open={toDelete !== null}
                title="Hapus Evaluasi"
                message={`Hapus evaluasi ${toDelete ? SEMESTER_OPTIONS[toDelete.semester] : ''} ${toDelete?.tahun}? Tindakan ini tidak bisa dibatalkan.`}
                onConfirm={confirmDelete}
                onCancel={() => setToDelete(null)}
            />
        </div>
    );
}
