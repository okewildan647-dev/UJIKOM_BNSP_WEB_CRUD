import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarCheck,
  ClipboardList,
  Database,
  Eye,
  GraduationCap,
  LayoutDashboard,
  MapPin,
  Plus,
  RefreshCw,
  UserPlus,
  Users,
} from 'lucide-react'
import StatCard from '../components/StatCard'
import { getAllSiswa } from '../services/siswaService'
import type { Siswa } from '../types/siswa'
import { formatTanggal, getInitials } from '../utils/format'

// Dashboard menampilkan ringkasan yang dihitung dari data API
export default function Dashboard() {
  const [data, setData] = useState<Siswa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fungsi ambil data dipakai saat mount dan tombol Coba Lagi
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

  // Panggil load sekali saat komponen pertama tampil
  useEffect(() => {
    void load()
  }, [load])

  // Semua angka ringkasan diturunkan dari state data
  const total = data.length
  const totalJurusan = useMemo(
    () => new Set(data.map((s) => s.jurusan_siswa).filter(Boolean)).size,
    [data]
  )
  const alamatTerisi = useMemo(
    () => data.filter((s) => s.alamat_siswa).length,
    [data]
  )
  const tanggalTerisi = useMemo(
    () => data.filter((s) => s.tgl_lahir_siswa).length,
    [data]
  )
  const recent = useMemo(
    () => [...data].sort((a, b) => b.id - a.id).slice(0, 5),
    [data]
  )
  // Menghitung jumlah siswa per jurusan, diurutkan dari terbanyak
  const perJurusan = useMemo(() => {
    const counts = new Map<string, number>()
    data.forEach((s) => {
      const jurusan = s.jurusan_siswa || 'Belum diisi'
      counts.set(jurusan, (counts.get(jurusan) ?? 0) + 1)
    })
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
  }, [data])
  const maxJurusanCount = perJurusan.length > 0 ? perJurusan[0][1] : 0

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-200">
            <LayoutDashboard size={14} />
            Ringkasan Sistem
          </div>
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Sistem Informasi Siswa &mdash; ringkasan data dari API PostgreSQL.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
          <Link
            to="/siswa"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition-colors hover:bg-blue-700"
          >
            <Users size={18} />
            Kelola Data Siswa
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/siswa/tambah"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-slate-50"
          >
            <UserPlus size={18} />
            Tambah Siswa
          </Link>
        </div>
      </div>

      {/* Jika gagal ambil data, tampilkan pesan error saja */}
      {error ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200/70 sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Database size={30} className="text-red-600" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-800">
            Gagal Memuat Data
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
            {error}
          </p>
          <button
            type="button"
            onClick={() => void load()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition-colors hover:bg-blue-700"
          >
            <RefreshCw size={16} />
            Coba Lagi
          </button>
        </div>
      ) : (
        <>
          {/* Empat kartu statistik utama */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Siswa"
              value={total}
              icon={Users}
              color="blue"
              loading={loading}
              subtitle="Seluruh data terdaftar"
            />
            <StatCard
              title="Jumlah Jurusan"
              value={totalJurusan}
              icon={GraduationCap}
              color="violet"
              loading={loading}
              subtitle="Jurusan berbeda terdaftar"
            />
            <StatCard
              title="Alamat Terisi"
              value={alamatTerisi}
              icon={MapPin}
              color="cyan"
              loading={loading}
              subtitle={`${total > 0 ? Math.round((alamatTerisi / total) * 100) : 0}% dari total`}
            />
            <StatCard
              title="Tanggal Lahir Terisi"
              value={tanggalTerisi}
              icon={CalendarCheck}
              color="emerald"
              loading={loading}
              subtitle={`${total > 0 ? Math.round((tanggalTerisi / total) * 100) : 0}% dari total`}
            />
          </div>

          {/* Grafik batang distribusi siswa per jurusan */}
          <div className="mt-6 grid grid-cols-1 gap-6">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="flex items-center gap-2 text-base font-bold text-slate-800">
                  <ClipboardList size={20} className="text-blue-600" />
                  Distribusi Siswa per Jurusan
                </h2>
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                  {totalJurusan} jurusan
                </span>
              </div>

              {loading ? (
                <div className="mt-5 space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-8 animate-pulse rounded-lg bg-slate-100" />
                  ))}
                </div>
              ) : perJurusan.length === 0 ? (
                <div className="mt-8 text-center text-sm text-slate-400">
                  Belum ada data siswa untuk ditampilkan.
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {perJurusan.map(([jurusan, count]) => (
                    <div key={jurusan}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-700">{jurusan}</span>
                        <span className="text-slate-400">{count} siswa</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-500"
                          style={{
                            width: `${Math.max(4, (count / maxJurusanCount) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tabel 5 siswa terbaru berdasarkan id terbesar */}
          <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
            <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-800">
                <Users size={20} className="text-blue-600" />
                Data Siswa
              </h2>
              <Link
                to="/siswa"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
              >
                Lihat Semua
                <ArrowRight size={16} />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3 p-5 pt-0 sm:p-6 sm:pt-0">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />
                ))}
              </div>
            ) : recent.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-6 pb-10 pt-4 text-center">
                <p className="text-sm text-slate-500">Belum ada data siswa.</p>
                <Link
                  to="/siswa/tambah"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition-colors hover:bg-blue-700"
                >
                  <Plus size={16} />
                  Tambah Siswa Pertama
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Siswa
                      </th>
                      <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Kode
                      </th>
                      <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Jurusan
                      </th>
                      <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Tanggal Lahir
                      </th>
                      <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recent.map((s) => (
                      <tr key={s.id} className="transition-colors hover:bg-slate-50/70">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                              {getInitials(s.nama_siswa)}
                            </div>
                            <span className="font-medium text-slate-800">
                              {s.nama_siswa}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-mono text-xs font-semibold text-blue-700">
                          {s.kode_siswa}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                          {s.jurusan_siswa || '-'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                          {formatTanggal(s.tgl_lahir_siswa)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/siswa/${s.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-blue-100 hover:text-blue-700"
                          >
                            <Eye size={14} />
                            Detail
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
