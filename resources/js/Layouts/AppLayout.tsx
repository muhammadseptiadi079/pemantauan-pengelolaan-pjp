import { type ReactNode } from 'react';
import Sidebar from '@/Components/Sidebar';
import FlashMessage from '@/Components/FlashMessage';

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <Sidebar />
            <main className="min-w-0 flex-1">
                <FlashMessage />
                {children}
            </main>
        </div>
    );
}
