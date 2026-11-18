import cors from "cors";
import express from "express";
import siswaRoutes from "./routes/siswa.routes";

const app = express();

app.use(cors()); // Mengizinkan request dari frontend di origin lain
app.use(express.json()); // Mengubah body JSON menjadi objek JavaScript

app.get("/", (_req, res) => {
  res.json({ message: "API Data Siswa Berhasil Berjalan" }); // Mengirim respons pesan sukses
});

app.use("/api/siswa", siswaRoutes); // Semua rute siswa dipasang di prefix /api/siswa

export default app;
