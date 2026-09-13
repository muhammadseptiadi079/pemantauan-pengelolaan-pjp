import { Link, usePage } from '@inertiajs/react';
import { TahapIcon } from '@/Components/TahapIcons';
import { navItems } from '@/navigation';

export default function QuickNavTabs() {
    const { url } = usePage();
    const pathname = url.split('?')[0];

    return (
        <div className="mb-10 flex flex-wrap gap-2">
            {navItems.map((item) => {
                const isActive =
                    item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                            isActive
                                ? 'bg-orange-600 text-white shadow-md shadow-orange-900/20'
                                : 'border border-slate-200 bg-white/70 text-slate-600 hover:bg-white hover:text-slate-900'
                        }`}
                    >
                        <TahapIcon name={item.icon} className="h-4 w-4" />
                        {item.shortLabel}
                    </Link>
                );
            })}
        </div>
    );
}
