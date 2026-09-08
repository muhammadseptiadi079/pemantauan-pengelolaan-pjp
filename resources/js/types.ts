export interface Pjp {
    id: number;
    nama_perusahaan: string;
    nib: string | null;
    penanggung_jawab: string | null;
    alamat: string | null;
    status: string;
    catatan: string | null;
    created_at: string;
    updated_at: string;
}

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
    kesesuaian_isi: string | null;
    tepat_waktu: boolean;
    created_at: string;
    updated_at: string;
}

export const JENIS_LAPORAN_OPTIONS: Record<string, string> = {
    spip: 'Data SPIP (Sarana, Prasarana, Instalasi & Peralatan)',
    tsp: 'Target Sasaran Program (TSP)',
    laporan_bulanan: 'Laporan Bulanan',
    laporan_triwulan: 'Laporan Triwulan',
};

export const KESESUAIAN_OPTIONS: Record<string, string> = {
    sesuai: 'Sesuai',
    tidak_sesuai: 'Tidak Sesuai',
};

export interface SmkpChecklistItem {
    id: number;
    smkp_checklist_category_id: number;
    grup_kode: string | null;
    grup_nama: string | null;
    nomor: number;
    pertanyaan: string;
    petunjuk: string | null;
    bobot: number;
    urutan: number;
}

export interface SmkpChecklistCategory {
    id: number;
    kode: string;
    nama: string;
    bobot: number;
    urutan: number;
    items: SmkpChecklistItem[];
}

export interface SmkpChecklistAnswer {
    id: number;
    pjp_id: number;
    smkp_checklist_item_id: number;
    jawaban: string | null;
    nilai: string | null;
    penjelasan: string | null;
}

export const SMKP_JAWABAN_OPTIONS: Record<string, string> = {
    ya: 'Y',
    tidak: 'T',
    na: 'N/A',
};

export const SMKP_NILAI_OPTIONS: Record<string, string> = {
    '0': '0 - Tidak ada / tidak tersedia / tidak dijelaskan',
    '1': '1 - Belum terpenuhi',
    '2': '2 - Cukup memadai, perlu perbaikan',
    '3': '3 - Sudah memadai',
    na: 'N/A - Tidak berlaku',
};

export interface SmkpScore {
    total_bobot: number;
    total_skor: number;
    persentase: number;
    kategori_risiko: string;
}

export interface SmkpCategoryBreakdown {
    kode: string;
    nama: string;
    bobot: number;
    bobot_dinilai: number;
    skor: number;
    persentase: number;
}

export interface SmkpLegalitasStatus {
    total: number;
    lengkap: number;
}

export interface PjpEvaluasi {
    id: number;
    pjp_id: number;
    tahun: number;
    semester: number;
    skor_teknis: number;
    skor_keselamatan_kesehatan: number;
    skor_lingkungan: number;
    skor_rata_rata: number;
    catatan: string | null;
    created_at: string;
}

export const SEMESTER_OPTIONS: Record<number, string> = {
    1: 'Semester 1 (Januari - Juni)',
    2: 'Semester 2 (Juli - Desember)',
};

export interface Paginated<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}
