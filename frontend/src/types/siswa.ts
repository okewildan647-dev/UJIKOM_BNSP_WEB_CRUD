// Bentuk data siswa setelah diterima dari API dan dipakai di UI
export interface Siswa {
  id: number
  kode_siswa: string
  nama_siswa: string
  alamat_siswa: string
  tgl_lahir_siswa: string
  jurusan_siswa: string
}

// Bentuk input form; field opsional boleh kosong atau null
export interface SiswaInput {
  kode_siswa: string
  nama_siswa: string
  alamat_siswa?: string | null
  tgl_lahir_siswa?: string | null
  jurusan_siswa?: string | null
}

// Semua endpoint backend membalas dengan struktur { message, data }
export interface ApiResponse<T> {
  message: string
  data: T
}
