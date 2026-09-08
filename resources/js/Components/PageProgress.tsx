import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

/**
 * Bar tipis di atas layar yang menyala saat navigasi Inertia sedang
 * berlangsung — tanpa ini, pindah halaman di koneksi lambat terasa seperti
 * macet karena tidak ada indikator apapun sedang terjadi.
 */
export default function PageProgress() {
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const clearTimer = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };

        const removeStart = router.on('start', () => {
            clearTimer();
            setVisible(true);
            setProgress(15);
            intervalRef.current = setInterval(() => {
                setProgress((p) => (p < 85 ? p + (85 - p) * 0.15 : p));
            }, 150);
        });

        const removeFinish = router.on('finish', () => {
            clearTimer();
            setProgress(100);
            setTimeout(() => {
                setVisible(false);
                setProgress(0);
            }, 300);
        });

        return () => {
            removeStart();
            removeFinish();
            clearTimer();
        };
    }, []);

    return (
        <div
            className="fixed left-0 top-0 z-[60] h-[3px] w-full transition-opacity duration-300"
            style={{ opacity: visible ? 1 : 0 }}
            aria-hidden="true"
        >
            <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-700 shadow-[0_0_8px_rgba(37,99,235,0.6)] transition-[width] duration-200 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
