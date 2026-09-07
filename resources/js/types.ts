export interface Pjp {
    id: number;
    nama_perusahaan: string;
    nib: string | null;
    penanggung_jawab: string | null;
    alamat: string | null;
    tahapan: string;
    status: string;
    catatan: string | null;
    created_at: string;
    updated_at: string;
}

export const TAHAPAN_OPTIONS: Record<string, string> = {
    'persyaratan-seleksi-penetapan': 'Persyaratan, Seleksi, dan Penetapan',
    'tanggung-jawab-pemantauan-pelaporan': 'Tanggung Jawab, Pemantauan, dan Pelaporan',
    evaluasi: 'Evaluasi',
};

export const STATUS_OPTIONS: Record<string, string> = {
    aktif: 'Aktif Dipantau',
    perlu_tindak_lanjut: 'Perlu Tindak Lanjut',
    tidak_aktif: 'Tidak Aktif',
};

export interface PjpLaporan {
    id: number;
    pjp_id: number;
    jenis: string;
    periode: string | null;
    file_path: string;
    file_name: string;
    file_size: number;
    catatan: string | null;
    created_at: string;
    updated_at: string;
}

export const JENIS_LAPORAN_OPTIONS: Record<string, string> = {
    spip: 'Data SPIP (Sarana, Prasarana, Instalasi & Peralatan)',
    tsp: 'Target Sasaran Program (TSP)',
    laporan_bulanan: 'Laporan Bulanan',
    laporan_triwulan: 'Laporan Triwulan',
};
