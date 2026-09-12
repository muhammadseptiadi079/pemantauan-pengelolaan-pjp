import { router } from '@inertiajs/react';
import { ChangeEvent, useState } from 'react';
import Spinner from '@/Components/Spinner';

export default function ImportPjpButton() {
    const [importing, setImporting] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        router.post('/pjp/import', formData, {
            forceFormData: true,
            preserveScroll: true,
            onStart: () => setImporting(true),
            onFinish: () => {
                setImporting(false);
                e.target.value = '';
            },
        });
    };

    return (
        <label
            className={`flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 ${
                importing ? 'cursor-wait opacity-70' : 'cursor-pointer'
            }`}
        >
            {importing && <Spinner />}
            Import Excel
            <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleChange}
                disabled={importing}
                className="hidden"
            />
        </label>
    );
}
