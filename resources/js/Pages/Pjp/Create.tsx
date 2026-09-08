import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import PageHeader from '@/Components/PageHeader';
import PjpFormFields from '@/Components/PjpFormFields';
import { TAHAPAN_OPTIONS, STATUS_OPTIONS } from '@/types';

export default function Create({
    defaultTahapan,
}: {
    defaultTahapan: string | null;
}) {
    const { data, setData, post, processing, errors } = useForm({
        nama_perusahaan: '',
        nib: '',
        penanggung_jawab: '',
        alamat: '',
        tahapan:
            defaultTahapan && defaultTahapan in TAHAPAN_OPTIONS
                ? defaultTahapan
                : Object.keys(TAHAPAN_OPTIONS)[0],
        status: Object.keys(STATUS_OPTIONS)[0],
        catatan: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/pjp');
    };

    return (
        <AppLayout>
            <Head title="Tambah PJP" />
            <div className="mx-auto max-w-2xl px-6 py-16">
                <PageHeader
                    title="Tambah PJP"
                    description="Tambahkan data Perusahaan Jasa Pertambangan baru ke dalam sistem."
                />

                <form onSubmit={submit} className="space-y-5">
                    <PjpFormFields data={data} setData={setData} errors={errors} />

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            Simpan
                        </button>
                        <Link
                            href={defaultTahapan ? `/${defaultTahapan}` : '/'}
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
