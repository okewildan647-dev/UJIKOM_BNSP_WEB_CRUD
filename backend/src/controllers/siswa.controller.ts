import { Request, Response } from "express";
import { db } from "../config/database";

type SiswaBody = {
  kode_siswa?: unknown;
  nama_siswa?: unknown;
  alamat_siswa?: unknown;
  tgl_lahir_siswa?: unknown;
  jurusan_siswa?: unknown;
};

// Validasi parameter id dari URL sebelum dipakai query
function parseId(req: Request, res: Response): number | null {
  const id = Number(req.params.id); // Mengubah id dari URL menjadi angka

  if (!Number.isInteger(id) || id <= 0) { // Cek id bukan bilangan bulat positif
    res.status(400).json({ message: "ID siswa tidak valid" }); // Kirim respons error 400
    return null; // Menandakan validasi gagal
  }

  return id; // Mengembalikan id yang valid
}

// Validasi body: kode dan nama wajib diisi
function readBody(req: Request, res: Response): SiswaBody | null {
  const body = req.body as SiswaBody | undefined; // Mengambil body sebagai SiswaBody

  if ( // Mulai pengecekan kolom wajib
    !body || // Body tidak boleh kosong
    typeof body.kode_siswa !== "string" || // Kode siswa harus string
    body.kode_siswa.trim() === "" || // Kode siswa tidak boleh kosong
    typeof body.nama_siswa !== "string" || // Nama siswa harus string
    body.nama_siswa.trim() === "" // Nama siswa tidak boleh kosong
  ) {
    res.status(400).json({ message: "Kode siswa dan nama siswa wajib diisi" }); // Kirim error 400
    return null; // Menandakan validasi gagal
  }

  return body; // Mengembalikan body yang valid
}

// Field opsional dikirim null bila bukan string atau kosong
function optionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null; // String kosong jadi null
}

// Handler GET daftar siswa
export const getAllSiswa = async (_req: Request, res: Response): Promise<void> => {
  try { // Menangkap error
    const result = await db.query( // Menjalankan query SELECT
      "SELECT * FROM public.data_siswa ORDER BY id ASC"
    );

    res.status(200).json({ // Kirim respons sukses
      message: "Data siswa berhasil ditampilkan",
      data: result.rows,
    });
  } catch (error) { // Menangani error query
    console.error("GAGAL AMBIL DATA SISWA:", error); // Log error
    res.status(500).json({ message: "Gagal mengambil data siswa" }); // Kirim error 500
  }
};

// Handler GET detail satu siswa
export const getSiswaById = async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req, res); // Validasi id
  if (id === null) return; // Hentikan jika id tidak valid

  try { // Menangkap error
    const result = await db.query( // Menjalankan query SELECT berdasarkan id
      "SELECT * FROM public.data_siswa WHERE id = $1",
      [id] // Nilai parameter id
    );

    if (result.rows.length === 0) { // Cek data tidak ditemukan
      res.status(404).json({ message: "Data siswa tidak ditemukan" }); // Kirim error 404
      return; // Hentikan fungsi
    }

    res.status(200).json({ // Kirim respons sukses
      message: "Detail siswa berhasil ditemukan",
      data: result.rows[0],
    });
  } catch (error) { // Menangani error query
    console.error("GAGAL AMBIL DETAIL SISWA:", error); // Log error
    res.status(500).json({ message: "Gagal mengambil detail siswa" }); // Kirim error 500
  }
};

// Handler POST tambah siswa baru
export const createSiswa = async (req: Request, res: Response): Promise<void> => {
  const body = readBody(req, res); // Validasi body
  if (body === null) return; // Hentikan jika body tidak valid

  try { // Menangkap error
    const result = await db.query( // Menjalankan query INSERT
      `INSERT INTO public.data_siswa
       (kode_siswa, nama_siswa, alamat_siswa, tgl_lahir_siswa, jurusan_siswa)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [ // Daftar nilai parameter
        body.kode_siswa, // Nilai kode siswa
        body.nama_siswa, // Nilai nama siswa
        optionalString(body.alamat_siswa), // Alamat atau null
        optionalString(body.tgl_lahir_siswa), // Tanggal lahir atau null
        optionalString(body.jurusan_siswa), // Jurusan atau null
      ]
    );

    res.status(201).json({ // Kirim respons berhasil dibuat
      message: "Siswa berhasil ditambahkan",
      data: result.rows[0],
    });
  } catch (error) { // Menangani error query
    console.error("GAGAL TAMBAH SISWA:", error); // Log error
    res.status(500).json({ // Kirim error 500
      message: "Gagal menambahkan siswa",
      error: error instanceof Error ? error.message : "Kesalahan server", // Detail error
    });
  }
};

// Handler PUT perbarui siswa berdasarkan id
export const updateSiswa = async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req, res); // Validasi id
  if (id === null) return; // Hentikan jika id tidak valid

  const body = readBody(req, res); // Validasi body
  if (body === null) return; // Hentikan jika body tidak valid

  try { // Menangkap error
    const result = await db.query( // Menjalankan query UPDATE
      `UPDATE public.data_siswa
       SET kode_siswa = $1,
           nama_siswa = $2,
           alamat_siswa = $3,
           tgl_lahir_siswa = $4,
           jurusan_siswa = $5
       WHERE id = $6
       RETURNING *`,
      [ // Daftar nilai parameter
        body.kode_siswa, // Nilai kode siswa baru
        body.nama_siswa, // Nilai nama siswa baru
        optionalString(body.alamat_siswa), // Alamat atau null
        optionalString(body.tgl_lahir_siswa), // Tanggal lahir atau null
        optionalString(body.jurusan_siswa), // Jurusan atau null
        id, // Id siswa yang diupdate
      ]
    );

    if (result.rows.length === 0) { // Cek data tidak ditemukan
      res.status(404).json({ message: "Data siswa tidak ditemukan" }); // Kirim error 404
      return; // Hentikan fungsi
    }

    res.status(200).json({ // Kirim respons sukses
      message: "Data siswa berhasil diperbarui",
      data: result.rows[0],
    });
  } catch (error) { // Menangani error query
    console.error("GAGAL UPDATE SISWA:", error); // Log error
    res.status(500).json({ message: "Gagal memperbarui data siswa" }); // Kirim error 500
  }
};

// Handler DELETE hapus siswa berdasarkan id
export const deleteSiswa = async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req, res); // Validasi id
  if (id === null) return; // Hentikan jika id tidak valid

  try { // Menangkap error
    const result = await db.query( // Menjalankan query DELETE
      "DELETE FROM public.data_siswa WHERE id = $1 RETURNING *",
      [id] // Nilai parameter id
    );

    if (result.rows.length === 0) { // Cek data tidak ditemukan
      res.status(404).json({ message: "Data siswa tidak ditemukan" }); // Kirim error 404
      return; // Hentikan fungsi
    }

    res.status(200).json({ // Kirim respons sukses
      message: "Data siswa berhasil dihapus",
      data: result.rows[0],
    });
  } catch (error) { // Menangani error query
    console.error("GAGAL HAPUS SISWA:", error); // Log error
    res.status(500).json({ message: "Gagal menghapus data siswa" }); // Kirim error 500
  }
};
