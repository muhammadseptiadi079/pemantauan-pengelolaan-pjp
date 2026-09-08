import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import StatusBadge from '@/Components/StatusBadge';
import PjpFilters from '@/Components/PjpFilters';
import StatusStackedBar, { StatusCounts } from '@/Components/StatusStackedBar';
import ConfirmDialog from '@/Components/ConfirmDialog';
import Pagination from '@/Components/Pagination';
import { Paginated, Pjp, TAHAPAN_OPTIONS } from '@/types';

type Filters = { search: string; tahapan: string; status: string };

export default function Index({
    pjps,
    filters,
    statusCounts,
}: {
    pjps: Paginated<Pjp>;
    filters: Filters;
    statusCounts: StatusCounts;
}) {
    const [pjpToDelete, setPjpToDelete] = useState<Pjp | null>(null);

    const confirmDelete = () => {
        if (pjpToDelete) {
            router.delete(`/pjp/${pjpToDelete.id}`);
            setPjpToDelete(null);
        }
    };

    const exportQuery = new URLSearchParams(
        Object.entries(filters).filter(([, value]) => value !== ''),
    ).toString();

    return (
        <AppLayout>
            <Head title="Data PJP" />
            <div className="mx-auto max-w-5xl px-6 py-16">
                <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
                    <PageHeader
                        title="Data PJP"
                        description="Daftar seluruh Perusahaan Jasa Pertambangan (PJP) yang terdaftar dalam sistem."
                    />
                    <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:shrink-0">
                        <a
                            href={`/pjp/export${exportQuery ? `?${exportQuery}` : ''}`}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Export Excel
                        </a>
                        <Link
                            href="/pjp/create"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            + Tambah PJP
                        </Link>
                    </div>
                </div>

                <div className="mb-6">
                    <StatusStackedBar
                        title="Capaian Status Seluruh PJP"
                        counts={statusCounts}
                    />
                </div>

                <PjpFilters action="/pjp" initial={filters} showTahapanFilter />

                {pjps.data.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                        {filters.search || filters.tahapan || filters.status
                            ? 'Tidak ada data PJP yang cocok dengan filter.'
                            : 'Belum ada data PJP. Tambahkan data untuk mulai memantau dan mengelola PJP.'}
                    </div>
                ) : (
                    <>
                        {/* Desktop / tablet: table */}
                        <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white md:block">
                            <table className="w-full min-w-[640px] text-left text-sm">
                                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">Nama Perusahaan</th>
                                        <th className="px-4 py-3">Tahapan</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {pjps.data.map((pjp) => (
                                        <tr key={pjp.id}>
                                            <td className="px-4 py-3 font-medium text-slate-800">
                                                {pjp.nama_perusahaan}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">
                                                {TAHAPAN_OPTIONS[pjp.tahapan] ?? pjp.tahapan}
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={pjp.status} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-3">
                                                    <Link
                                                        href={`/pjp/${pjp.id}`}
                                                        className="font-medium text-blue-600 hover:text-blue-800"
                                                    >
                                                        Detail
                                                    </Link>
                                                    <Link
                                                        href={`/pjp/${pjp.id}/edit`}
                                                        className="font-medium text-blue-600 hover:text-blue-800"
                                                    >
                                                        Ubah
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => setPjpToDelete(pjp)}
                                                        className="font-medium text-red-600 hover:text-red-800"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile: stacked cards */}
                        <div className="space-y-3 md:hidden">
                            {pjps.data.map((pjp) => (
                                <div
                                    key={pjp.id}
                                    className="rounded-xl border border-slate-200 bg-white p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="font-medium text-slate-800">
                                            {pjp.nama_perusahaan}
                                        </p>
                                        <StatusBadge status={pjp.status} />
                                    </div>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {TAHAPAN_OPTIONS[pjp.tahapan] ?? pjp.tahapan}
                                    </p>
                                    <div className="mt-3 flex gap-4 text-sm">
                                        <Link
                                            href={`/pjp/${pjp.id}`}
                                            className="font-medium text-blue-600 hover:text-blue-800"
                                        >
                                            Detail
                                        </Link>
                                        <Link
                                            href={`/pjp/${pjp.id}/edit`}
                                            className="font-medium text-blue-600 hover:text-blue-800"
                                        >
                                            Ubah
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => setPjpToDelete(pjp)}
                                            className="font-medium text-red-600 hover:text-red-800"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Pagination links={pjps.links} />
                    </>
                )}
            </div>

            <ConfirmDialog
                open={pjpToDelete !== null}
                title="Hapus Data PJP"
                message={`Hapus data PJP "${pjpToDelete?.nama_perusahaan}"? Tindakan ini tidak bisa dibatalkan.`}
                onConfirm={confirmDelete}
                onCancel={() => setPjpToDelete(null)}
            />
        </AppLayout>
    );
}
