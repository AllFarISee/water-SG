import { BATAS_HARIAN, BATAS_PERINGATAN, JAM_RESET } from "../config";

// "Hari operasional" mulai jam 08:00, jadi jam 03:00 masih dihitung hari kemarin
export function tanggalOperasional() {
  const d = new Date(Date.now() - JAM_RESET * 3600 * 1000);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Riwayat pemakaian hari-hari sebelumnya.
// Sekarang DATA CONTOH (dummy). Ganti dengan data dari database / API:
// return [{ tanggal: Date, pemakaian: 52.3 }, ...] urut dari yang terlama.
export function ambilRiwayatHarian(jumlah = 13) {
  const hariIni = tanggalOperasional();
  return Array.from({ length: jumlah }, (_, k) => {
    const i = jumlah - k; // k=0 -> paling lama
    const tanggal = new Date(hariIni);
    tanggal.setDate(tanggal.getDate() - i);
    const pemakaian = Math.min(
      BATAS_HARIAN,
      44 + ((i * 37) % 23) + (i % 3) * 0.7,
    );
    return { tanggal, pemakaian };
  });
}

export function statusPemakaian(m3) {
  if (m3 >= BATAS_HARIAN) return "limit";
  if (m3 >= BATAS_PERINGATAN) return "waspada";
  return "normal";
}
