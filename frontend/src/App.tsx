import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/Dashboard'
import Siswa from './pages/Siswa'
import TambahSiswa from './pages/TambahSiswa'
import EditSiswa from './pages/EditSiswa'
import DetailSiswa from './pages/DetailSiswa'

// Halaman fallback saat URL tidak cocok dengan rute mana pun
function NotFound() {
  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200/70">
      <p className="text-5xl font-extrabold text-blue-600">404</p>
      <h1 className="mt-4 text-xl font-bold text-slate-800">
        Halaman Tidak Ditemukan
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Halaman yang Anda tuju tidak tersedia atau sudah dipindahkan.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-700"
      >
        <ArrowLeft size={18} />
        Kembali ke Dashboard
      </Link>
    </div>
  )
}

// Komponen utama yang mendefinisikan seluruh rute aplikasi
export default function App() {
  return (
    <Routes>
      {/* Semua halaman menggunakan layout AdminLayout */}
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Rute CRUD siswa: daftar, tambah, detail, dan edit */}
        <Route path="/siswa" element={<Siswa />} />
        <Route path="/siswa/tambah" element={<TambahSiswa />} />
        <Route path="/siswa/:id" element={<DetailSiswa />} />
        <Route path="/siswa/:id/edit" element={<EditSiswa />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
