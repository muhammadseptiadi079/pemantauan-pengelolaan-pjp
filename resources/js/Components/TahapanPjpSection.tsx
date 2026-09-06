import { Link } from '@inertiajs/react';
import PjpMiniList from '@/Components/PjpMiniList';

type MiniPjp = { id: number; nama_perusahaan: string; status: string };

export default function TahapanPjpSection({
    tahapan,
    pjps,
}: {
    tahapan: string;
    pjps: MiniPjp[];
}) {
    return (
        <section className="mt-14">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">
                    Daftar PJP pada Tahap Ini
                </h2>
                <Link
                    href={`/pjp/create?tahapan=${tahapan}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                    + Tambah PJP
                </Link>
            </div>
            <PjpMiniList pjps={pjps} />
        </section>
    );
}
