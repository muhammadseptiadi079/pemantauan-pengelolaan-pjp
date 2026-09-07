import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import PjpFormFields from '@/Components/PjpFormFields';
import { Pjp } from '@/types';

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
                    <PjpFormFields data={data} setData={setData} errors={errors} />

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
