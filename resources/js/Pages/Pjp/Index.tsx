import { Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import StatusBadge from '@/Components/StatusBadge';
import PjpFilters from '@/Components/PjpFilters';
import { Pjp, TAHAPAN_OPTIONS } from '@/types';

type Filters = { search: string; tahapan: string; status: string };

export default function Index({
    pjps,
    filters,
}: {
    pjps: Pjp[];
    filters: Filters;
}) {
    const handleDelete = (pjp: Pjp) => {
        if (confirm(`Hapus data PJP "${pjp.nama_perusahaan}"?`)) {
            router.delete(`/pjp/${pjp.id}`);
        }
    };

    return (
        <AppLayout>
            <div className="mx-auto max-w-5xl px-6 py-16">
                <div className="mb-10 flex items-start justify-between gap-4">
                    <PageHeader
                        title="Data PJP"
                        description="Daftar seluruh Perusahaan Jasa Pertambangan (PJP) yang terdaftar dalam sistem."
                    />
                    <Link
                        href="/pjp/create"
                        className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        + Tambah PJP
                    </Link>
                </div>

                <PjpFilters action="/pjp" initial={filters} showTahapanFilter />

                {pjps.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                        {filters.search || filters.tahapan || filters.status
                            ? 'Tidak ada data PJP yang cocok dengan filter.'
                            : 'Belum ada data PJP. Tambahkan data untuk mulai memantau dan mengelola PJP.'}
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
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
                                {pjps.map((pjp) => (
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
                                                    href={`/pjp/${pjp.id}/edit`}
                                                    className="font-medium text-blue-600 hover:text-blue-800"
                                                >
                                                    Ubah
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(pjp)}
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
                )}
            </div>
        </AppLayout>
    );
}
