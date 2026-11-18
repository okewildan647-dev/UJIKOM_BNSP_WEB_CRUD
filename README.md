# SIM Siswa — Web CRUD

Aplikasi Sistem Informasi Siswa berbasis web untuk mengelola data siswa secara lengkap (Create, Read, Update, Delete) menggunakan React di frontend dan Express di backend. Data disimpan permanen di PostgreSQL.

## Fitur

- Menampilkan daftar seluruh siswa dengan pencarian berdasarkan kode, nama, atau jurusan.
- Menambah data siswa baru.
- Melihat detail siswa.
- Mengubah data siswa.
- Menghapus data siswa dengan konfirmasi.
- Dashboard ringkasan: total siswa, jumlah jurusan, kelengkapan alamat, dan tanggal lahir.
- Tampilan responsif untuk desktop dan mobile.

## Teknologi

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router, Axios.
- Backend: Node.js, Express, TypeScript, `pg` untuk PostgreSQL, CORS, dotenv.
- Database: PostgreSQL (`public.data_siswa`).

## Struktur Folder

```text
UjiKom/
├── backend/   # API Express + PostgreSQL
└── frontend/  # Antarmuka React + Vite
```

## Menjalankan Aplikasi

### 1. Backend

```bash
cd backend
npm install
```

Buat file `backend/.env` (file ini sengaja tidak disimpan di GitHub):

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=password_postgres_anda
```

Jalankan:

```bash
npm run dev
```

API akan berjalan di `http://localhost:3000/api`.

### 2. Frontend

```bash
cd frontend
npm install
```

Buat file `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

Jalankan:

```bash
npm run dev
```

Buka `http://localhost:5173` di browser.

## Endpoint API

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| GET | `/api/siswa` | Ambil semua siswa |
| GET | `/api/siswa/:id` | Ambil detail siswa |
| POST | `/api/siswa` | Tambah siswa |
| PUT | `/api/siswa/:id` | Ubah siswa |
| DELETE | `/api/siswa/:id` | Hapus siswa |

Field yang dikirim: `kode_siswa`, `nama_siswa` (wajib), serta `alamat_siswa`, `tgl_lahir_siswa`, dan `jurusan_siswa` (opsional).

## Catatan

File `.env` masuk dalam `.gitignore` agar kredensial database tidak ikut ter-upload ke repository.
