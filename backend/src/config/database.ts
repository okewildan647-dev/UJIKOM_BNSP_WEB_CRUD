import { Pool, types } from "pg";

types.setTypeParser(1082, (value: string) => value); // Tipe DATE dikembalikan apa adanya sebagai string

const configuredPort = Number(process.env.DB_PORT ?? 5432);

// Pool koneksi PostgreSQL memakai konfigurasi dari file .env
export const db = new Pool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number.isFinite(configuredPort) ? configuredPort : 5432,
  database: process.env.DB_NAME ?? "db_mahasiswa",
  user: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASSWORD ?? "",
});

export async function checkDatabaseConnection(): Promise<void> {
  await db.query("SELECT 1"); // Menjalankan query sederhana sebagai tes
}

export async function ensureSchema(): Promise<void> {
  await db.query( // Membuat tabel jika belum ada
    `
    CREATE TABLE IF NOT EXISTS public.data_siswa (
      id SERIAL PRIMARY KEY,
      kode_siswa VARCHAR(50) NOT NULL,
      nama_siswa VARCHAR(100) NOT NULL,
      alamat_siswa TEXT,
      tgl_lahir_siswa DATE,
      jurusan_siswa VARCHAR(100)
    )
  `);
}
