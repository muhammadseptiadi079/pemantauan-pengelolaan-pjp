import { router, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import ConfirmDialog from '@/Components/ConfirmDialog';
import Spinner from '@/Components/Spinner';
import { TahapIcon } from '@/Components/TahapIcons';
import { PjpCatatan } from '@/types';

function formatTanggal(iso: string): string {
    return new Date(iso).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function CatatanHistoryCard({
    pjpId,
    catatans,
}: {
    pjpId: number;
    catatans: PjpCatatan[];
}) {
    const [toDelete, setToDelete] = useState<PjpCatatan | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm<{ isi: string }>({
        isi: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/pjp/${pjpId}/catatan`, {
            preserveScroll: true,
            onSuccess: () => reset('isi'),
        });
    };

    const confirmDelete = () => {
        if (toDelete) {
            router.delete(`/pjp/${pjpId}/catatan/${toDelete.id}`, { preserveScroll: true });
            setToDelete(null);
        }
    };

    return (
        <div className="glass-card p-5">
            <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                    <TahapIcon name="note" className="h-4 w-4" />
                </span>
                <h3 className="font-semibold text-slate-900">Riwayat Catatan</h3>
            </div>
            <p className="mt-1 text-xs text-slate-500">
                Setiap catatan baru menambah entri di bawah — tidak menimpa yang lama, jadi ada
                jejak kapan dan kenapa sesuatu berubah.
            </p>

            {catatans.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">Belum ada catatan.</p>
            ) : (
                <ul className="mt-3 divide-y divide-slate-100">
                    {catatans.map((catatan) => (
                        <li
                            key={catatan.id}
                            className="flex items-start justify-between gap-3 py-3 text-sm"
                        >
                            <div className="min-w-0">
                                <p className="whitespace-pre-line text-slate-700">{catatan.isi}</p>
                                <p className="mt-1 text-xs text-slate-400">
                                    {formatTanggal(catatan.created_at)}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setToDelete(catatan)}
                                className="shrink-0 text-xs font-medium text-red-600 hover:text-red-800"
                            >
                                Hapus
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <form onSubmit={submit} className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                <textarea
                    placeholder="Tambah catatan baru..."
                    value={data.isi}
                    onChange={(e) => setData('isi', e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                />
                {errors.isi && <p className="text-sm text-red-600">{errors.isi}</p>}
                <button
                    type="submit"
                    disabled={processing || !data.isi.trim()}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {processing && <Spinner />}
                    Tambah Catatan
                </button>
            </form>

            <ConfirmDialog
                open={toDelete !== null}
                title="Hapus Catatan"
                message="Hapus catatan ini? Tindakan ini tidak bisa dibatalkan."
                onConfirm={confirmDelete}
                onCancel={() => setToDelete(null)}
            />
        </div>
    );
}
