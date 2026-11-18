import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, RefreshCw } from 'lucide-react'
import SiswaTable from '../components/SiswaTable'
import DeleteModal from '../components/DeleteModal'
import Toast, { type ToastType } from '../components/Toast'
import { deleteSiswa, getAllSiswa } from '../services/siswaService'
import type { Siswa } from '../types/siswa'

// Halaman daftar siswa lengkap dengan pencarian dan konfirmasi hapus
export default function SiswaPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<Siswa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Siswa | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null)

  // Ambil ulang daftar dari endpoint GET /api/siswa
  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await getAllSiswa())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengambil data siswa.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  // Filter kode, nama, dan jurusan berdasarkan kata kunci
  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase()
    return data.filter((s) =>
      `${s.kode_siswa} ${s.nama_siswa} ${s.jurusan_siswa}`
        .toLowerCase()
        .includes(keyword)
    )
  }, [data, search])

  // Hapus siswa terpilih lalu muat ulang daftar
  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteSiswa(deleteTarget.id)
      setToast({
        type: 'success',
        message: `Data siswa ${deleteTarget.nama_siswa} berhasil dihapus.`,
      })
      setDeleteTarget(null)
      await load()
    } catch (err) {
      setDeleteTarget(null)
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Gagal menghapus siswa.',
      })
    } finally {
      setDeleting(false)
    }
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

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Data Siswa
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Daftar Data Seluruh Siswa
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <Link
            to="/siswa/tambah"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition-colors hover:bg-blue-700"
          >
            <Plus size={16} />
            Tambah Siswa
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-slate-600">
            Total: {data.length} siswa
          </p>
          {/* Kolom pencarian langsung memfilter data yang sudah dimuat */}
          <input
            type="text"
            placeholder="Cari kode, nama, atau jurusan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-72"
          />
        </div>

        {error ? (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : (
          <SiswaTable
            data={filteredData}
            startIndex={0}
            loading={loading}
            emptyTitle={search ? 'Siswa tidak ditemukan' : 'Belum ada data siswa'}
            emptyDescription={
              search
                ? 'Coba kata kunci lain.'
                : 'Tambahkan siswa pertama untuk mulai mengisi database.'
            }
            onDetail={(s) => navigate(`/siswa/${s.id}`)}
            onEdit={(s) => navigate(`/siswa/${s.id}/edit`)}
            onDelete={setDeleteTarget}
          />
        )}
      </div>

      {/* Modal hanya muncul setelah baris dipilih */}
      <DeleteModal
        siswa={deleteTarget}
        loading={deleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
