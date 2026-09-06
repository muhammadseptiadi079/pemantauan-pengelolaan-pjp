import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function FlashMessage() {
    const { flash } = usePage().props as unknown as {
        flash?: { success?: string | null };
    };
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setMessage(flash.success);
            const timer = setTimeout(() => setMessage(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

    if (!message) return null;

    return (
        <div className="mx-6 mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            {message}
        </div>
    );
}
