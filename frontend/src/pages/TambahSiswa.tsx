import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import SiswaForm from '../components/SiswaForm'
import { createSiswa } from '../services/siswaService'
import type { SiswaInput } from '../types/siswa'

// Halaman create: kirim payload lalu kembali ke daftar
export default function TambahSiswa() {
  const navigate = useNavigate()

  // Setelah POST berhasil, arahkan ke halaman daftar siswa
  const handleSubmit = async (input: SiswaInput) => {
    await createSiswa(input)
    navigate('/siswa')
  }

  return (
    <div>
      <Link
        to="/siswa"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-blue-600"
      >
        <ArrowLeft size={18} />
        Kembali ke Data Siswa
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          Tambah Siswa
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Kode siswa dan nama siswa wajib diisi. Field lain dapat dikosongkan.
        </p>
      </div>

      {/* Form dipakai ulang dengan mode create */}
      <div className="max-w-3xl">
        <SiswaForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={() => navigate('/siswa')}
        />
      </div>
    </div>
  )
}
