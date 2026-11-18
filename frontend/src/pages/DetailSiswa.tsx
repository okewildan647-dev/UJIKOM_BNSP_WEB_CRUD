import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  GraduationCap,
  Hash,
  MapPin,
  Pencil,
  RefreshCw,
  Trash2,
  UserRound,
} from 'lucide-react'
import DeleteModal from '../components/DeleteModal'
import Loading from '../components/Loading'
import Toast, { type ToastType } from '../components/Toast'
import { deleteSiswa, getSiswaById } from '../services/siswaService'
import type { Siswa } from '../types/siswa'
import { formatTanggal, getInitials } from '../utils/format'

// Field baca-only untuk menampilkan label dan nilai data siswa
function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3.5 ring-1 ring-inset ring-slate-200/70">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-medium text-slate-800">
        {value || '-'}
      </p>
    </div>
  )
}

// Halaman detail siswa sekaligus aksi edit dan hapus
export default function DetailSiswa() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [siswa, setSiswa] = useState<Siswa | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null)

  // Ambil detail siswa; id harus berupa angka
  const load = useCallback(async () => {
    if (!id || !/^\d+$/.test(id)) {
      setError('ID siswa tidak valid.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      setSiswa(await getSiswaById(id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengambil detail siswa.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void load()
  }, [load])

  // Hapus data lalu kembali ke daftar; error tetap ditampilkan di halaman ini
  const handleDelete = async () => {
    if (!siswa) return
    setDeleting(true)
    try {
      await deleteSiswa(siswa.id)
      navigate('/siswa')
    } catch (err) {
      setDeleteOpen(false)
      setDeleting(false)
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Gagal menghapus siswa.',
      })
    }
  }

  // Prioritas tampilan: loading, data tidak ada, lalu detail
  if (loading) {
    return <Loading text="Memuat detail siswa..." />
  }

  if (error || !siswa) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200/70 sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <UserRound size={30} className="text-red-600" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-slate-800">
          Siswa Tidak Ditemukan
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          {error ?? 'Data siswa yang Anda cari tidak tersedia.'}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/siswa"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-300"
          >
            <ArrowLeft size={16} />
            Kembali ke Data Siswa
          </Link>
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition-colors hover:bg-blue-700"
          >
            <RefreshCw size={16} />
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <Link
        to="/siswa"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-blue-600"
      >
        <ArrowLeft size={18} />
        Kembali ke Data Siswa
      </Link>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 px-6 py-8 sm:px-8">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-2xl font-bold text-white shadow-lg ring-4 ring-white/10">
                {getInitials(siswa.nama_siswa)}
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-bold text-white">
                  {siswa.nama_siswa}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-white/10 px-2.5 py-1 font-mono text-xs font-semibold text-blue-100 ring-1 ring-inset ring-white/20">
                    Kode {siswa.kode_siswa}
                  </span>
                  {siswa.jurusan_siswa && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-blue-100 ring-1 ring-inset ring-white/20">
                      <GraduationCap size={14} />
                      {siswa.jurusan_siswa}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex w-full gap-3 sm:w-auto">
              <Link
                to={`/siswa/${siswa.id}/edit`}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-md transition-colors hover:bg-slate-100 sm:flex-none"
              >
                <Pencil size={16} />
                Edit
              </Link>
              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-900/40 transition-colors hover:bg-red-700 sm:flex-none"
              >
                <Trash2 size={16} />
                Hapus
              </button>
            </div>
          </div>
        </div>

        {/* Seluruh field data siswa ditampilkan di sini */}
        <div className="grid gap-8 p-6 sm:p-8">
          <section>
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
              <UserRound size={18} className="text-blue-600" />
              Data Siswa
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <InfoField label="Kode Siswa" value={siswa.kode_siswa} />
              <InfoField label="Nama Siswa" value={siswa.nama_siswa} />
              <InfoField label="Jurusan" value={siswa.jurusan_siswa} />

              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5 ring-1 ring-inset ring-slate-200/70">
                <Calendar size={18} className="mt-0.5 shrink-0 text-blue-600" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Tanggal Lahir
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {formatTanggal(siswa.tgl_lahir_siswa)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5 ring-1 ring-inset ring-slate-200/70 sm:col-span-2">
                <MapPin size={18} className="mt-0.5 shrink-0 text-blue-600" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Alamat
                  </p>
                  <p className="mt-1 break-words text-sm font-medium leading-relaxed text-slate-800">
                    {siswa.alamat_siswa || '-'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5 ring-1 ring-inset ring-slate-200/70 sm:col-span-2">
                <Hash size={18} className="mt-0.5 shrink-0 text-slate-500" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    ID Database
                  </p>
                  <p className="mt-1 font-mono text-sm font-medium text-slate-800">
                    {siswa.id}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Modal hanya menerima siswa saat tombol Hapus ditekan */}
      <DeleteModal
        siswa={deleteOpen ? siswa : null}
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  )
}
