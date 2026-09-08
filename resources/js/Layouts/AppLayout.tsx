import { type ReactNode } from 'react';
import Sidebar from '@/Components/Sidebar';
import FlashMessage from '@/Components/FlashMessage';
import PageProgress from '@/Components/PageProgress';

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden md:flex-row">
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-50">
                <div className="bg-blob absolute -left-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-blue-400/60 blur-3xl" />
                <div
                    className="bg-blob absolute right-[-6rem] top-1/4 h-[26rem] w-[26rem] rounded-full bg-violet-400/50 blur-3xl"
                    style={{ animationDelay: '-6s' }}
                />
                <div
                    className="bg-blob absolute bottom-[-6rem] left-1/4 h-[30rem] w-[30rem] rounded-full bg-emerald-300/50 blur-3xl"
                    style={{ animationDelay: '-11s' }}
                />
                <div
                    className="bg-blob absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-amber-300/40 blur-3xl"
                    style={{ animationDelay: '-3s' }}
                />
                <div
                    className="bg-blob absolute left-1/2 top-1/2 h-72 w-72 rounded-full bg-pink-300/35 blur-3xl"
                    style={{ animationDelay: '-8s' }}
                />
            </div>

            <PageProgress />
            <Sidebar />
            <main className="relative min-w-0 flex-1">
                <FlashMessage />
                <div className="page-enter">{children}</div>
            </main>
        </div>
    );
}
