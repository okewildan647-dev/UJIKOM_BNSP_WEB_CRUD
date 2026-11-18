import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import type { Siswa } from '../types/siswa'
import { Spinner } from './Loading'

// Kontrak modal: data yang akan dihapus, status loading, dan dua callback aksi
interface DeleteModalProps {
  siswa: Siswa | null
  loading: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteModal({
  siswa,
  loading,
  onConfirm,
  onCancel,
}: DeleteModalProps) {
  // Tutup modal dengan Escape saat tidak sedang proses hapus
  useEffect(() => {
    if (!siswa) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [siswa, loading, onCancel])

  // Jangan render apa pun bila tidak ada siswa yang dipilih
  if (!siswa) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={loading ? undefined : onCancel}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Konfirmasi hapus data siswa"
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-[modal-in_0.2s_ease-out] sm:p-8"
      >
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle size={28} className="text-red-600" />
          </div>
        </div>

        <h3 className="mt-4 text-center text-lg font-bold text-slate-800">
          Hapus Data Siswa?
        </h3>
        <p className="mt-2 text-center text-sm leading-relaxed text-slate-500">
          Anda akan menghapus data siswa{' '}
          <span className="font-semibold text-slate-700">{siswa.nama_siswa}</span>{' '}
          dengan kode{' '}
          <span className="font-mono font-semibold text-slate-700">{siswa.kode_siswa}</span>
          . Tindakan ini tidak dapat dibatalkan.
        </p>

        {/* Tombol batal dan konfirmasi; keduanya nonaktif saat request berjalan */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/30 transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Spinner className="h-4 w-4" />}
            {loading ? 'Menghapus...' : 'Ya, Hapus Data'}
          </button>
        </div>
      </div>
    </div>
  )
}
