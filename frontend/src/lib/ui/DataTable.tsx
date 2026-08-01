import { FiEdit2, FiTrash2, FiInbox } from 'react-icons/fi'
import { Button } from './Button'

interface Column<T> {
  key: string
  label: string
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  noActions?: boolean
}

export function DataTable<T extends { id: number }>({ columns, data, loading, onEdit, onDelete, noActions }: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative flex size-12 items-center justify-center">
          <div className="absolute size-12 animate-spin rounded-full border-4 border-gray-100" />
          <div className="absolute size-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
        </div>
        <p className="mt-4 text-sm text-gray-400">Memuat data...</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex size-16 items-center justify-center rounded-xl bg-gray-50">
          <FiInbox className="size-8 text-gray-300" />
        </div>
        <p className="mt-4 text-sm font-medium text-gray-500">Belum ada data</p>
        <p className="mt-1 text-xs text-gray-400">Silakan tambah data baru</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-100 text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">#</th>
            {columns.map((col) => (
              <th key={col.key} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{col.label}</th>
            ))}
            {!noActions && <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Aksi</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((item, idx) => (
            <tr key={item.id} className="bg-white transition-colors hover:bg-gray-50/60">
              <td className="px-5 py-3.5 text-xs font-medium text-gray-400">{idx + 1}</td>
              {columns.map((col) => (
                <td key={col.key} className="px-5 py-3.5 text-sm text-gray-700">
                  {col.render ? col.render(item) : String((item as any)[col.key] ?? '')}
                </td>
              ))}
              {!noActions && (
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {onEdit && (
                      <Button variant="outline-edit" size="sm" icon={FiEdit2} onClick={() => onEdit(item)}>
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button variant="outline-delete" size="sm" icon={FiTrash2} onClick={() => onDelete(item)}>
                        Hapus
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
