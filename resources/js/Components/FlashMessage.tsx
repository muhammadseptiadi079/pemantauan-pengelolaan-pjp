import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function FlashMessage() {
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        return router.on('success', (event) => {
            const flash = (event.detail.page.props as { flash?: { success?: string | null } })
                .flash;

            if (flash?.success) {
                setMessage(flash.success);
            }
        });
    }, []);

    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => setMessage(null), 4000);
        return () => clearTimeout(timer);
    }, [message]);

    if (!message) return null;

    return (
        <div className="mx-6 mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            {message}
        </div>
    );
}
