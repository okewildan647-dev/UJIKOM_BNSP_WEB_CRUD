import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import type { ApiResponse, Siswa, SiswaInput } from '../types/siswa'

// Alamat API diambil dari .env; fallback untuk kondisi env belum diset
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

// Bentuk mentah respons sebelum dinormalisasi
type RawRecord = Record<string, unknown>

// Instance axios bersama untuk seluruh request siswa
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Mengubah nilai apa pun menjadi string; null/undefined jadi string kosong
function asString(value: unknown): string {
  if (typeof value === 'string') return value
  if (value == null) return ''
  return String(value)
}

// Menyamakan bentuk data dari backend ke tipe Siswa yang dipakai UI
function normalizeSiswa(raw: RawRecord): Siswa {
  return {
    id: Number(raw.id ?? 0),
    kode_siswa: asString(raw.kode_siswa),
    nama_siswa: asString(raw.nama_siswa),
    alamat_siswa: asString(raw.alamat_siswa),
    tgl_lahir_siswa: asString(raw.tgl_lahir_siswa).slice(0, 10),
    jurusan_siswa: asString(raw.jurusan_siswa),
  }
}

// Menerjemahkan error axios/error biasa menjadi pesan yang bisa ditampilkan user
function extractErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: unknown } | undefined
    if (data && typeof data.message === 'string' && data.message !== '') {
      return data.message
    }
    if (err.code === 'ERR_NETWORK' || !err.response) {
      return 'Tidak dapat terhubung ke server. Pastikan backend berjalan di http://localhost:3000.'
    }
    return fallback
  }
  if (err instanceof Error && err.message !== '') return err.message
  return fallback
}

// Pembungkus request: ambil field `data` dari { message, data } atau lempar error
async function handleRequest<T>(
  action: () => Promise<AxiosResponse>,
  fallbackMessage: string
): Promise<T> {
  try {
    const res = await action()
    const body = res.data as ApiResponse<T> | null

    if (
      body &&
      typeof body === 'object' &&
      'data' in body &&
      body.data !== undefined
    ) {
      return body.data
    }

    throw new Error('Format response API tidak dikenali.')
  } catch (err) {
    throw new Error(extractErrorMessage(err, fallbackMessage))
  }
}

// Field opsional dikirim null bila kosong agar sesuai ekspektasi backend
function optional(value: string | null | undefined): string | null {
  if (value == null) return null
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

// Menyusun payload 5 field yang diterima endpoint backend
function buildPayload(input: SiswaInput): RawRecord {
  return {
    kode_siswa: input.kode_siswa.trim(),
    nama_siswa: input.nama_siswa.trim(),
    alamat_siswa: optional(input.alamat_siswa),
    tgl_lahir_siswa: optional(input.tgl_lahir_siswa),
    jurusan_siswa: optional(input.jurusan_siswa),
  }
}

// GET /api/siswa untuk daftar seluruh siswa
export async function getAllSiswa(): Promise<Siswa[]> {
  const data = await handleRequest<unknown[]>(
    () => api.get('/siswa'),
    'Gagal mengambil data siswa.'
  )
  if (!Array.isArray(data)) return []
  return data.map((row) => normalizeSiswa(row as RawRecord))
}

// GET /api/siswa/:id untuk satu baris detail
export async function getSiswaById(id: number | string): Promise<Siswa> {
  const data = await handleRequest<RawRecord>(
    () => api.get(`/siswa/${id}`),
    'Gagal mengambil detail siswa.'
  )
  return normalizeSiswa(data)
}

// POST /api/siswa untuk membuat data baru
export async function createSiswa(input: SiswaInput): Promise<Siswa> {
  const data = await handleRequest<RawRecord>(
    () => api.post('/siswa', buildPayload(input)),
    'Gagal menambahkan siswa.'
  )
  return normalizeSiswa(data)
}

// PUT /api/siswa/:id untuk memperbarui data yang sudah ada
export async function updateSiswa(
  id: number | string,
  input: SiswaInput
): Promise<Siswa> {
  const data = await handleRequest<RawRecord>(
    () => api.put(`/siswa/${id}`, buildPayload(input)),
    'Gagal memperbarui data siswa.'
  )
  return normalizeSiswa(data)
}

// DELETE /api/siswa/:id untuk menghapus data berdasarkan id
export async function deleteSiswa(id: number | string): Promise<Siswa> {
  const data = await handleRequest<RawRecord>(
    () => api.delete(`/siswa/${id}`),
    'Gagal menghapus siswa.'
  )
  return normalizeSiswa(data)
}
