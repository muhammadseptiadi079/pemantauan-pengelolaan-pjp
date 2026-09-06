import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import { Pjp, TAHAPAN_OPTIONS, STATUS_OPTIONS } from '@/types';

export default function Edit({ pjp }: { pjp: Pjp }) {
    const { data, setData, put, processing, errors } = useForm({
        nama_perusahaan: pjp.nama_perusahaan,
        nib: pjp.nib ?? '',
        penanggung_jawab: pjp.penanggung_jawab ?? '',
        alamat: pjp.alamat ?? '',
        tahapan: pjp.tahapan,
        status: pjp.status,
        catatan: pjp.catatan ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/pjp/${pjp.id}`);
    };

    return (
        <AppLayout>
            <div className="mx-auto max-w-2xl px-6 py-16">
                <PageHeader
                    title="Ubah Data PJP"
                    description={`Perbarui data untuk ${pjp.nama_perusahaan}.`}
                />

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            Nama Perusahaan
                        </label>
                        <input
                            type="text"
                            value={data.nama_perusahaan}
                            onChange={(e) => setData('nama_perusahaan', e.target.value)}
                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        {errors.nama_perusahaan && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.nama_perusahaan}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            NIB
                        </label>
                        <input
                            type="text"
                            value={data.nib}
                            onChange={(e) => setData('nib', e.target.value)}
                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        {errors.nib && (
                            <p className="mt-1 text-sm text-red-600">{errors.nib}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            Penanggung Jawab
                        </label>
                        <input
                            type="text"
                            value={data.penanggung_jawab}
                            onChange={(e) => setData('penanggung_jawab', e.target.value)}
                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        {errors.penanggung_jawab && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.penanggung_jawab}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            Alamat
                        </label>
                        <textarea
                            value={data.alamat}
                            onChange={(e) => setData('alamat', e.target.value)}
                            rows={3}
                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        {errors.alamat && (
                            <p className="mt-1 text-sm text-red-600">{errors.alamat}</p>
                        )}
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">
                                Tahapan
                            </label>
                            <select
                                value={data.tahapan}
                                onChange={(e) => setData('tahapan', e.target.value)}
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                {Object.entries(TAHAPAN_OPTIONS).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                            {errors.tahapan && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.tahapan}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">
                                Status
                            </label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                {Object.entries(STATUS_OPTIONS).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                            {errors.status && (
                                <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            Catatan
                        </label>
                        <textarea
                            value={data.catatan}
                            onChange={(e) => setData('catatan', e.target.value)}
                            rows={3}
                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        {errors.catatan && (
                            <p className="mt-1 text-sm text-red-600">{errors.catatan}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            Simpan Perubahan
                        </button>
                        <Link
                            href="/pjp"
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
