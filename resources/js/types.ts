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
