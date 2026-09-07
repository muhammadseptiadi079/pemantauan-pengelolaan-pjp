import { Link } from '@inertiajs/react';
import PjpMiniList from '@/Components/PjpMiniList';
import PjpFilters from '@/Components/PjpFilters';

type MiniPjp = { id: number; nama_perusahaan: string; status: string };
type Filters = { search: string; status: string };

export default function TahapanPjpSection({
    tahapan,
    action,
    pjps,
    filters,
}: {
    tahapan: string;
    action: string;
    pjps: MiniPjp[];
    filters: Filters;
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

            <PjpFilters
                action={action}
                initial={{ search: filters.search, tahapan: '', status: filters.status }}
            />

            <PjpMiniList
                pjps={pjps}
                emptyMessage={
                    filters.search || filters.status
                        ? 'Tidak ada data PJP yang cocok dengan filter.'
                        : 'Belum ada data PJP pada tahap ini.'
                }
            />
        </section>
    );
}
