import { router, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import ConfirmDialog from '@/Components/ConfirmDialog';
import FilePreviewModal, { PreviewTarget } from '@/Components/FilePreviewModal';
import Spinner from '@/Components/Spinner';
import { TahapIcon } from '@/Components/TahapIcons';
import { KESESUAIAN_OPTIONS, PjpLaporan } from '@/types';

const JENIS_ICON: Record<string, string> = {
    spip: 'building',
    tsp: 'target',
    laporan_bulanan: 'calendar',
    laporan_triwulan: 'document',
};

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function LaporanUploadCard({
    pjpId,
    jenis,
    label,
    laporans,
    uploadDisabledMessage,
}: {
    pjpId: number;
    jenis: string;
    label: string;
    laporans: PjpLaporan[];
    uploadDisabledMessage?: string;
}) {
    const [fileInputKey, setFileInputKey] = useState(0);
    const [laporanToDelete, setLaporanToDelete] = useState<PjpLaporan | null>(
        null,
    );
    const [preview, setPreview] = useState<PreviewTarget | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm<{
        jenis: string;
        periode: string;
        file: File | null;
    }>({
        jenis,
        periode: '',
        file: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/pjp/${pjpId}/laporan`, {
            forceFormData: true,
            onSuccess: () => {
                reset('periode', 'file');
                setFileInputKey((key) => key + 1);
            },
        });
    };

    const confirmDelete = () => {
        if (laporanToDelete) {
            router.delete(`/pjp/${pjpId}/laporan/${laporanToDelete.id}`);
            setLaporanToDelete(null);
        }
    };

    const handleKesesuaianChange = (laporanId: number, value: string) => {
        router.patch(
            `/pjp/${pjpId}/laporan/${laporanId}`,
            { kesesuaian_isi: value },
            { preserveScroll: true },
        );
    };

    return (
        <div className="glass-card p-5">
            <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                    <TahapIcon name={JENIS_ICON[jenis] ?? 'document'} className="h-4 w-4" />
                </span>
                <h3 className="font-semibold text-slate-900">{label}</h3>
            </div>

            {laporans.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">
                    Belum ada dokumen diunggah.
                </p>
            ) : (
                <ul className="mt-3 divide-y divide-slate-100">
                    {laporans.map((laporan) => (
                        <li key={laporan.id} className="space-y-1.5 py-3 text-sm">
                            <div className="flex items-center justify-between gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setPreview({
                                            url: `/storage/${laporan.file_path}`,
                                            fileName: laporan.file_name,
                                        })
                                    }
                                    className="truncate text-left font-medium text-blue-600 hover:text-blue-800"
                                >
                                    {laporan.file_name}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLaporanToDelete(laporan)}
                                    className="shrink-0 text-xs font-medium text-red-600 hover:text-red-800"
                                >
                                    Hapus
                                </button>
                            </div>
                            <p className="text-xs text-slate-500">
                                {laporan.periode ? `${laporan.periode} · ` : ''}
                                {formatFileSize(laporan.file_size)}
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                                <span
                                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                        laporan.tepat_waktu
                                            ? 'bg-green-50 text-green-700'
                                            : 'bg-red-50 text-red-700'
                                    }`}
                                >
                                    {laporan.tepat_waktu
                                        ? 'Tepat Waktu'
                                        : 'Terlambat'}
                                </span>
                                <select
                                    value={laporan.kesesuaian_isi ?? ''}
                                    onChange={(e) =>
                                        handleKesesuaianChange(
                                            laporan.id,
                                            e.target.value,
                                        )
                                    }
                                    className="rounded-md border border-slate-300 px-2 py-1 text-[11px] text-slate-600 focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="">Belum dievaluasi</option>
                                    {Object.entries(KESESUAIAN_OPTIONS).map(
                                        ([value, optionLabel]) => (
                                            <option key={value} value={value}>
                                                {optionLabel}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {uploadDisabledMessage ? (
                <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    {uploadDisabledMessage}
                </p>
            ) : (
                <form
                    onSubmit={submit}
                    className="mt-4 space-y-2 border-t border-slate-100 pt-4"
                >
                    <div className="grid gap-2 sm:grid-cols-2">
                        <input
                            type="text"
                            placeholder="Periode (mis. September 2026)"
                            value={data.periode}
                            onChange={(e) => setData('periode', e.target.value)}
                            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                            key={fileInputKey}
                            type="file"
                            onChange={(e) =>
                                setData('file', e.target.files?.[0] ?? null)
                            }
                            className="text-sm text-slate-600 file:mr-2 file:rounded-md file:border-0 file:bg-slate-100 file:px-2 file:py-1.5 file:text-xs file:font-medium file:text-slate-700"
                        />
                    </div>
                    {errors.file && (
                        <p className="text-sm text-red-600">{errors.file}</p>
                    )}
                    <button
                        type="submit"
                        disabled={processing || !data.file}
                        className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {processing && <Spinner />}
                        Unggah
                    </button>
                </form>
            )}

            <ConfirmDialog
                open={laporanToDelete !== null}
                title="Hapus Dokumen"
                message={`Hapus dokumen "${laporanToDelete?.file_name}"? Tindakan ini tidak bisa dibatalkan.`}
                onConfirm={confirmDelete}
                onCancel={() => setLaporanToDelete(null)}
            />

            <FilePreviewModal file={preview} onClose={() => setPreview(null)} />
        </div>
    );
}
