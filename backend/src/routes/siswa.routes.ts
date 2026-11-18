import { Router } from "express";
import {
  createSiswa,
  deleteSiswa,
  getAllSiswa,
  getSiswaById,
  updateSiswa,
} from "../controllers/siswa.controller";

const router = Router();

router.get("/", getAllSiswa); // GET /api/siswa -> daftar semua siswa
router.get("/:id", getSiswaById); // GET /api/siswa/:id -> detail siswa
router.post("/", createSiswa); // POST /api/siswa -> tambah siswa
router.put("/:id", updateSiswa); // PUT /api/siswa/:id -> update siswa
router.delete("/:id", deleteSiswa); // DELETE /api/siswa/:id -> hapus siswa

export default router;
