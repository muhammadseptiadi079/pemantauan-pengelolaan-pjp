import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function FlashMessage() {
    const [message, setMessage] = useState<string | null>(null);
    const [leaving, setLeaving] = useState(false);

    useEffect(() => {
        return router.on('success', (event) => {
            const flash = (event.detail.page.props as { flash?: { success?: string | null } })
                .flash;

            if (flash?.success) {
                setLeaving(false);
                setMessage(flash.success);
            }
        });
    }, []);

    useEffect(() => {
        if (!message) return;
        const leaveTimer = setTimeout(() => setLeaving(true), 3600);
        const removeTimer = setTimeout(() => setMessage(null), 4000);
        return () => {
            clearTimeout(leaveTimer);
            clearTimeout(removeTimer);
        };
    }, [message]);

    if (!message) return null;

    return (
        <div
            className={`mx-6 mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 transition-all duration-300 ease-out ${
                leaving
                    ? '-translate-y-2 opacity-0'
                    : 'translate-y-0 opacity-100 animate-[fade-in-up_0.3s_ease-out]'
            }`}
        >
            {message}
        </div>
    );
}
