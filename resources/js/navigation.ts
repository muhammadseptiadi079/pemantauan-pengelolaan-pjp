// Daftar 4 halaman utama, dipakai bareng oleh Sidebar (label lengkap) dan
// QuickNavTabs (shortLabel — versi pendek supaya muat sebagai pill).
export const navItems = [
    { href: '/', label: 'Beranda', shortLabel: 'Beranda', icon: 'home' },
    {
        href: '/persyaratan-seleksi-penetapan',
        label: 'Persyaratan, Seleksi, Penetapan',
        shortLabel: 'Persyaratan',
        icon: 'persyaratan',
    },
    {
        href: '/tanggung-jawab-pemantauan-pelaporan',
        label: 'Tanggung Jawab, Pemantauan, Pelaporan',
        shortLabel: 'Tanggung Jawab',
        icon: 'tanggungjawab',
    },
    { href: '/evaluasi', label: 'Evaluasi', shortLabel: 'Evaluasi', icon: 'evaluasi' },
];
