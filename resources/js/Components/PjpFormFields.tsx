import { TahapIcon } from '@/Components/TahapIcons';
import { STATUS_OPTIONS } from '@/types';

function FieldLabel({ icon, children }: { icon: string; children: string }) {
    return (
        <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <TahapIcon name={icon} className="h-4 w-4 text-slate-400" />
            {children}
        </label>
    );
}

export type PjpFormData = {
    nama_perusahaan: string;
    nib: string;
    penanggung_jawab: string;
    alamat: string;
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
                <FieldLabel icon="building">Nama Perusahaan</FieldLabel>
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
                <FieldLabel icon="document">NIB</FieldLabel>
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
                <FieldLabel icon="user">Penanggung Jawab</FieldLabel>
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
                <FieldLabel icon="location">Alamat</FieldLabel>
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

            <div>
                <FieldLabel icon="check">Status</FieldLabel>
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

            <div>
                <FieldLabel icon="note">Catatan</FieldLabel>
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
