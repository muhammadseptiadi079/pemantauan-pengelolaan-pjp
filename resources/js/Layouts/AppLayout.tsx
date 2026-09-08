import { type ReactNode } from 'react';
import Sidebar from '@/Components/Sidebar';
import FlashMessage from '@/Components/FlashMessage';
import PageProgress from '@/Components/PageProgress';

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <PageProgress />
            <Sidebar />
            <main className="min-w-0 flex-1">
                <FlashMessage />
                <div className="page-enter">{children}</div>
            </main>
        </div>
    );
}
