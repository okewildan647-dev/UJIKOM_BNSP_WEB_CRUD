import "dotenv/config";
import app from "./app";
import { checkDatabaseConnection, db, ensureSchema } from "./config/database";

const PORT = Number(process.env.PORT ?? 3000);

async function startServer(): Promise<void> {
  try { // Menangkap kemungkinan error
    await checkDatabaseConnection(); // Menguji koneksi ke database
    await ensureSchema(); // Memastikan tabel sudah ada
    console.log("Database PostgreSQL terhubung!"); // Log sukses koneksi database

    app.listen(PORT, () => { // Mendengarkan request pada port
      console.log(`Server berjalan di http://localhost:${PORT}`); // Log alamat server
    });
  } catch (error) { // Menangani error saat startup
    console.error("Gagal menghubungkan database:", error); // Log detail error
    process.exit(1); // Menghentikan proses dengan kode gagal
  }
}

async function shutdown(): Promise<void> {
  await db.end(); // Menutup pool koneksi database
  process.exit(0); // Menghentikan proses dengan kode sukses
}

process.on("SIGINT", () => void shutdown());
process.on("SIGTERM", () => void shutdown());

void startServer();
