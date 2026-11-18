import type { Siswa } from '../types/siswa'
import { Eye, Pencil, Trash2, Users } from 'lucide-react'
import { formatTanggal } from '../utils/format'

interface SiswaTableProps {
  data: Siswa[]
  startIndex: number
  loading: boolean
  emptyTitle: string
  emptyDescription: string
  onDetail: (siswa: Siswa) => void
  onEdit: (siswa: Siswa) => void
  onDelete: (siswa: Siswa) => void
}

// Header tabel versi desktop
const headers = [
  'No.',
  'Kode Siswa',
  'Nama Siswa',
  'Jurusan',
  'Tanggal Lahir',
  'Alamat',
  'Aksi',
]

// Tiga aksi baris: detail, edit, hapus; compact dipakai pada kartu mobile
function ActionButtons({
  siswa,
  onDetail,
  onEdit,
  onDelete,
  compact = false,
}: {
  siswa: Siswa
  onDetail: (s: Siswa) => void
  onEdit: (s: Siswa) => void
  onDelete: (s: Siswa) => void
  compact?: boolean
}) {
  // Gaya tombol menyesuaikan tampilan tabel atau kartu
  const base = compact
    ? 'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors'
    : 'rounded-lg p-2 transition-colors'

  return (
    <div className={compact ? 'flex gap-2' : 'flex items-center gap-1'}>
      <button
        type="button"
        onClick={() => onDetail(siswa)}
        title="Lihat detail"
        aria-label={`Lihat detail ${siswa.nama_siswa}`}
        className={`${base} bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-700`}
      >
        <Eye size={16} />
        {compact && 'Detail'}
      </button>
      <button
        type="button"
        onClick={() => onEdit(siswa)}
        title="Edit data"
        aria-label={`Edit data ${siswa.nama_siswa}`}
        className={`${base} bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-700`}
      >
        <Pencil size={16} />
        {compact && 'Edit'}
      </button>
      <button
        type="button"
        onClick={() => onDelete(siswa)}
        title="Hapus data"
        aria-label={`Hapus data ${siswa.nama_siswa}`}
        className={`${base} bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-700`}
      >
        <Trash2 size={16} />
        {compact && 'Hapus'}
      </button>
    </div>
  )
}

// Placeholder berkedip saat data masih dimuat
function TableSkeleton() {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl ring-1 ring-slate-200/70 md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50">
              {headers.map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-t border-slate-100">
                {headers.map((h, cellIndex) => (
                  <td key={h} className="px-4 py-4">
                    <div
                      className="h-4 animate-pulse rounded bg-slate-100"
                      style={{ width: `${45 + ((rowIndex + cellIndex) % 4) * 15}%` }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-2xl bg-slate-100 ring-1 ring-slate-200/70"
          />
        ))}
      </div>
    </>
  )
}

// Tampilan ketika hasil filter/data kosong
function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <Users size={32} className="text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-700">{title}</h3>
      <p className="max-w-sm text-sm text-slate-500">{description}</p>
    </div>
  )
}

export default function SiswaTable({
  data,
  startIndex,
  loading,
  emptyTitle,
  emptyDescription,
  onDetail,
  onEdit,
  onDelete,
}: SiswaTableProps) {
  // Urutan prioritas render: loading, kosong, lalu data
  if (loading) return <TableSkeleton />
  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <>
      {/* Tabel lebar untuk layar medium ke atas */}
      <div className="hidden overflow-x-auto rounded-xl ring-1 ring-slate-200/70 md:block">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="bg-slate-50">
              {headers.map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((siswa, index) => (
              <tr
                key={siswa.id}
                className="bg-white transition-colors hover:bg-slate-50/70"
              >
                <td className="px-4 py-3.5 text-center text-sm text-slate-400">
                  {startIndex + index + 1}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-blue-700">
                  {siswa.kode_siswa}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 font-medium text-slate-800">
                  {siswa.nama_siswa}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-slate-600">
                  {siswa.jurusan_siswa || '-'}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-slate-600">
                  {formatTanggal(siswa.tgl_lahir_siswa)}
                </td>
                <td
                  className="max-w-[200px] truncate px-4 py-3.5 text-slate-600"
                  title={siswa.alamat_siswa || undefined}
                >
                  {siswa.alamat_siswa || '-'}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  <ActionButtons
                    siswa={siswa}
                    onDetail={onDetail}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Versi kartu untuk layar kecil */}
      <div className="space-y-4 md:hidden">
        {data.map((siswa, index) => (
          <div
            key={siswa.id}
            className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  #{startIndex + index + 1} &middot; {siswa.kode_siswa}
                </p>
                <h3 className="mt-0.5 truncate text-base font-bold text-slate-800">
                  {siswa.nama_siswa}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {siswa.jurusan_siswa || 'Jurusan belum diisi'}
                </p>
              </div>
            </div>

            <dl className="mt-4 space-y-2.5 border-t border-slate-100 pt-3 text-sm">
              <div className="flex gap-3">
                <dt className="w-28 shrink-0 text-slate-400">Tanggal Lahir</dt>
                <dd className="font-medium text-slate-700">
                  {formatTanggal(siswa.tgl_lahir_siswa)}
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-28 shrink-0 text-slate-400">Alamat</dt>
                <dd className="font-medium text-slate-700">
                  {siswa.alamat_siswa || '-'}
                </dd>
              </div>
            </dl>

            <div className="mt-4 border-t border-slate-100 pt-3">
              <ActionButtons
                siswa={siswa}
                onDetail={onDetail}
                onEdit={onEdit}
                onDelete={onDelete}
                compact
              />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
