"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Beranda" },
  {
    href: "/persyaratan-seleksi-penetapan",
    label: "1. Persyaratan, Seleksi, Penetapan",
  },
  {
    href: "/tanggung-jawab-pemantauan-pelaporan",
    label: "2. Tanggung Jawab, Pemantauan, Pelaporan",
  },
  { href: "/evaluasi", label: "3. Evaluasi" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
      <div className="border-b border-slate-200 px-6 py-5">
        <p className="text-sm font-semibold text-slate-900">
          Pemantauan &amp; Pengelolaan PJP
        </p>
        <p className="mt-0.5 text-xs text-slate-500">
          Perusahaan Jasa Pertambangan
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
