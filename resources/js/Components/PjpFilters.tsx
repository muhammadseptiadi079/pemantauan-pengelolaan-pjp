import { router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { STATUS_OPTIONS, TAHAPAN_OPTIONS } from '@/types';

export type PjpFiltersValue = {
    search: string;
    tahapan: string;
    status: string;
};

export default function PjpFilters({
    action,
    initial,
    showTahapanFilter = false,
}: {
    action: string;
    initial: PjpFiltersValue;
    showTahapanFilter?: boolean;
}) {
    const [search, setSearch] = useState(initial.search);
    const [tahapan, setTahapan] = useState(initial.tahapan);
    const [status, setStatus] = useState(initial.status);

    const hasActiveFilter = Boolean(
        initial.search || initial.tahapan || initial.status,
    );

    const applyFilters = () => {
        const query: Record<string, string> = { search, tahapan, status };
        Object.keys(query).forEach((key) => {
            if (!query[key]) delete query[key];
        });
        router.get(action, query, { preserveState: true, preserveScroll: true });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        applyFilters();
    };

    const reset = () => {
        setSearch('');
        setTahapan('');
        setStatus('');
        router.get(action, {}, { preserveState: true, preserveScroll: true });
    };

    return (
        <form
            onSubmit={submit}
            className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4"
        >
            <div className="min-w-[180px] flex-1">
                <label className="block text-xs font-medium text-slate-500">
                    Cari Nama
                </label>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Nama perusahaan..."
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>

            {showTahapanFilter && (
                <div className="min-w-[200px]">
                    <label className="block text-xs font-medium text-slate-500">
                        Tahapan
                    </label>
                    <select
                        value={tahapan}
                        onChange={(e) => setTahapan(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="">Semua Tahapan</option>
                        {Object.entries(TAHAPAN_OPTIONS).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="min-w-[180px]">
                <label className="block text-xs font-medium text-slate-500">
                    Status
                </label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <option value="">Semua Status</option>
                    {Object.entries(STATUS_OPTIONS).map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex gap-2">
                <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    Terapkan
                </button>
                {hasActiveFilter && (
                    <button
                        type="button"
                        onClick={reset}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                        Reset
                    </button>
                )}
            </div>
        </form>
    );
}
