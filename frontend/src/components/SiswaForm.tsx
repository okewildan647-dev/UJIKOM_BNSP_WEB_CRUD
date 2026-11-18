import { useState, type ChangeEvent, type FormEvent } from 'react'
import { AlertTriangle, Loader2, Save } from 'lucide-react'
import type { Siswa, SiswaInput } from '../types/siswa'

// State form selalu berupa string agar mudah diikat ke input HTML
interface FormState {
  kode_siswa: string
  nama_siswa: string
  alamat_siswa: string
  tgl_lahir_siswa: string
  jurusan_siswa: string
}

// Error validasi opsional per field
type FormErrors = Partial<Record<keyof FormState, string>>

// Form dipakai ulang untuk mode tambah dan edit
interface SiswaFormProps {
  mode: 'create' | 'edit'
  initialData?: Siswa
  onSubmit: (input: SiswaInput) => Promise<void>
  onCancel: () => void
}

// Nilai awal saat mode tambah
const emptyForm: FormState = {
  kode_siswa: '',
  nama_siswa: '',
  alamat_siswa: '',
  tgl_lahir_siswa: '',
  jurusan_siswa: '',
}

// Mengisi form dari data existing saat mode edit
function createInitialState(initialData?: Siswa): FormState {
  if (!initialData) return emptyForm
  return {
    kode_siswa: initialData.kode_siswa,
    nama_siswa: initialData.nama_siswa,
    alamat_siswa: initialData.alamat_siswa,
    tgl_lahir_siswa: initialData.tgl_lahir_siswa.slice(0, 10),
    jurusan_siswa: initialData.jurusan_siswa,
  }
}

// Validasi kode, nama, dan tanggal lahir sebelum request API
function validate(form: FormState): FormErrors {
  const errors: FormErrors = {}

  if (!form.kode_siswa.trim()) errors.kode_siswa = 'Kode siswa wajib diisi.'

  const nama = form.nama_siswa.trim()
  if (!nama) errors.nama_siswa = 'Nama siswa wajib diisi.'
  else if (nama.length < 3) errors.nama_siswa = 'Nama minimal 3 karakter.'

  if (form.tgl_lahir_siswa) {
    const date = new Date(`${form.tgl_lahir_siswa}T00:00:00`)
    if (Number.isNaN(date.getTime())) {
      errors.tgl_lahir_siswa = 'Tanggal lahir tidak valid.'
    } else if (date.getTime() > Date.now()) {
      errors.tgl_lahir_siswa = 'Tanggal lahir tidak boleh di masa depan.'
    }
  }

  return errors
}

const sectionClass = 'rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 sm:p-6'
const sectionTitleClass =
  'flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700'
const labelClass = 'mb-1.5 block text-sm font-medium text-slate-700'
const errorTextClass = 'mt-1.5 text-xs font-medium text-red-600'

export default function SiswaForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
}: SiswaFormProps) {
  // State form, error field, error API, dan status submit
  const [form, setForm] = useState<FormState>(() => createInitialState(initialData))
  const [errors, setErrors] = useState<FormErrors>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Menentukan teks tombol berdasarkan mode
  const isEdit = mode === 'edit'

// Kelas input berubah saat field bersalah agar terlihat merah
  const inputClass = (hasError: boolean) =>
    `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:ring-2 ${
      hasError
        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
        : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
    }`

// Update state field, hapus error field itu, dan reset error API
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setApiError(null)
  }

// Validasi dulu; jika lolos, susun payload 5 field dan panggil onSubmit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const validationErrors = validate(form)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      setApiError(null)
      return
    }

    const payload: SiswaInput = {
      kode_siswa: form.kode_siswa.trim(),
      nama_siswa: form.nama_siswa.trim(),
      alamat_siswa: form.alamat_siswa.trim() || null,
      tgl_lahir_siswa: form.tgl_lahir_siswa || null,
      jurusan_siswa: form.jurusan_siswa.trim() || null,
    }

    // Kunci tombol saat request, lalu tampilkan pesan error bila gagal
    setSubmitting(true)
    setApiError(null)
    try {
      await onSubmit(payload)
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  // Batas maksimal input tanggal lahir adalah hari ini
  const today = new Date().toISOString().slice(0, 10)

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {apiError && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertTriangle size={20} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Gagal menyimpan data</p>
            <p className="mt-0.5 leading-relaxed">{apiError}</p>
          </div>
        </div>
      )}

      <section className={sectionClass}>
        <h3 className={sectionTitleClass}>Data Siswa</h3>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="kode_siswa" className={labelClass}>
              Kode Siswa <span className="text-red-500">*</span>
            </label>
            <input
              id="kode_siswa"
              name="kode_siswa"
              type="text"
              value={form.kode_siswa}
              onChange={handleChange}
              placeholder="Contoh: S001"
              className={inputClass(Boolean(errors.kode_siswa))}
              disabled={submitting}
            />
            {errors.kode_siswa && (
              <p className={errorTextClass}>{errors.kode_siswa}</p>
            )}
          </div>

          <div>
            <label htmlFor="nama_siswa" className={labelClass}>
              Nama Siswa <span className="text-red-500">*</span>
            </label>
            <input
              id="nama_siswa"
              name="nama_siswa"
              type="text"
              value={form.nama_siswa}
              onChange={handleChange}
              placeholder="Nama lengkap siswa"
              className={inputClass(Boolean(errors.nama_siswa))}
              disabled={submitting}
            />
            {errors.nama_siswa && (
              <p className={errorTextClass}>{errors.nama_siswa}</p>
            )}
          </div>

          <div>
            <label htmlFor="tgl_lahir_siswa" className={labelClass}>
              Tanggal Lahir <span className="text-slate-400">(opsional)</span>
            </label>
            <input
              id="tgl_lahir_siswa"
              name="tgl_lahir_siswa"
              type="date"
              max={today}
              value={form.tgl_lahir_siswa}
              onChange={handleChange}
              className={inputClass(Boolean(errors.tgl_lahir_siswa))}
              disabled={submitting}
            />
            {errors.tgl_lahir_siswa && (
              <p className={errorTextClass}>{errors.tgl_lahir_siswa}</p>
            )}
          </div>

          <div>
            <label htmlFor="jurusan_siswa" className={labelClass}>
              Jurusan <span className="text-slate-400">(opsional)</span>
            </label>
            <input
              id="jurusan_siswa"
              name="jurusan_siswa"
              type="text"
              value={form.jurusan_siswa}
              onChange={handleChange}
              placeholder="Contoh: RPL"
              className={inputClass(false)}
              disabled={submitting}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="alamat_siswa" className={labelClass}>
              Alamat <span className="text-slate-400">(opsional)</span>
            </label>
            <textarea
              id="alamat_siswa"
              name="alamat_siswa"
              rows={3}
              value={form.alamat_siswa}
              onChange={handleChange}
              placeholder="Alamat lengkap siswa"
              className={`${inputClass(false)} resize-y`}
              disabled={submitting}
            />
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-xl bg-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {submitting
            ? 'Menyimpan...'
            : isEdit
              ? 'Simpan Perubahan'
              : 'Simpan Data Siswa'}
        </button>
      </div>
    </form>
  )
}
