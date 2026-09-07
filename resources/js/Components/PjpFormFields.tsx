import { TAHAPAN_OPTIONS, STATUS_OPTIONS } from '@/types';

export type PjpFormData = {
    nama_perusahaan: string;
    nib: string;
    penanggung_jawab: string;
    alamat: string;
    tahapan: string;
    status: string;
    catatan: string;
};

export default function PjpFormFields({
    data,
    setData,
    errors,
}: {
    data: PjpFormData;
    setData: (key: keyof PjpFormData, value: string) => void;
    errors: Partial<Record<keyof PjpFormData, string>>;
}) {
    return (
        <>
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
                        <p className="mt-1 text-sm text-red-600">{errors.tahapan}</p>
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
        </>
    );
}
