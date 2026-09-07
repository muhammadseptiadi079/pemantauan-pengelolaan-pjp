import { router, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { PjpLaporan } from '@/types';

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
}: {
    pjpId: number;
    jenis: string;
    label: string;
    laporans: PjpLaporan[];
}) {
    const [fileInputKey, setFileInputKey] = useState(0);
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

    const handleDelete = (laporanId: number) => {
        if (confirm('Hapus dokumen ini?')) {
            router.delete(`/pjp/${pjpId}/laporan/${laporanId}`);
        }
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="font-semibold text-slate-900">{label}</h3>

            {laporans.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">
                    Belum ada dokumen diunggah.
                </p>
            ) : (
                <ul className="mt-3 divide-y divide-slate-100">
                    {laporans.map((laporan) => (
                        <li
                            key={laporan.id}
                            className="flex items-center justify-between gap-3 py-2 text-sm"
                        >
                            <div className="min-w-0">
                                <a
                                    href={`/storage/${laporan.file_path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block truncate font-medium text-blue-600 hover:text-blue-800"
                                >
                                    {laporan.file_name}
                                </a>
                                <p className="text-xs text-slate-500">
                                    {laporan.periode ? `${laporan.periode} · ` : ''}
                                    {formatFileSize(laporan.file_size)}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleDelete(laporan.id)}
                                className="shrink-0 text-xs font-medium text-red-600 hover:text-red-800"
                            >
                                Hapus
                            </button>
                        </li>
                    ))}
                </ul>
            )}

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
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    Unggah
                </button>
            </form>
        </div>
    );
}
