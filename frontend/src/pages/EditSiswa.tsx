import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, RefreshCw, UserRound } from 'lucide-react'
import Loading from '../components/Loading'
import SiswaForm from '../components/SiswaForm'
import { getSiswaById, updateSiswa } from '../services/siswaService'
import type { Siswa, SiswaInput } from '../types/siswa'

// Halaman edit mengambil data berdasarkan :id lalu mengirim PUT
export default function EditSiswa() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [siswa, setSiswa] = useState<Siswa | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Validasi id dulu sebelum request detail siswa
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
      setError(err instanceof Error ? err.message : 'Gagal mengambil data siswa.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void load()
  }, [load])

  // Kirim perubahan hanya jika data asli sudah berhasil dimuat
  const handleSubmit = async (input: SiswaInput) => {
    if (!siswa) return
    await updateSiswa(siswa.id, input)
    navigate('/siswa')
  }

  // Tiga kondisi render: loading, gagal, atau form edit
  if (loading) {
    return <Loading text="Memuat data siswa..." />
  }

  if (error || !siswa) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200/70 sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <UserRound size={30} className="text-red-600" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-slate-800">
          Data Tidak Dapat Dimuat
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          {error ?? 'Siswa tidak ditemukan.'}
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
      <div className="mb-6">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
          <Pencil size={14} />
          Formulir Perubahan Data
        </div>
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          Edit Siswa
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Perbarui data{' '}
          <span className="font-semibold text-slate-700">{siswa.nama_siswa}</span>{' '}
          (Kode{' '}
          <span className="font-mono font-semibold text-slate-700">
            {siswa.kode_siswa}
          </span>
          ).
        </p>
      </div>

      {/* Form diisi otomatis dari data yang sudah dimuat */}
      <div className="max-w-3xl">
        <SiswaForm
          mode="edit"
          initialData={siswa}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/siswa/${siswa.id}`)}
        />
      </div>
    </div>
  )
}
