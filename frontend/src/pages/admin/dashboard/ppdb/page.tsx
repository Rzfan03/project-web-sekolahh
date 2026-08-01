import { useState } from 'react'
import { FiSave, FiX } from 'react-icons/fi'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../lib/ui/Card'
import { Button } from '../../../../lib/ui/Button'
import { Select } from '../../../../lib/ui/Select'
import { DataTable } from '../../../../lib/ui/DataTable'
import { Modal } from '../../../../lib/ui/Modal'
import { useData } from '../../../../hooks/useData'
import { getPpdb, updatePpdb, deletePpdb } from '../../../../lib/supabase'
import type { PPDB } from '../../../../types/ppdb'
import DashboardLayout from '../components/Layout'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
  diterima: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  ditolak: 'bg-red-50 text-red-700 ring-1 ring-red-200',
}

export default function PpdbPage() {
  const { data, loading, refresh } = useData(getPpdb)
  const [modal, setModal] = useState(false)
  const [editItem, setEditItem] = useState<PPDB | null>(null)
  const [status, setStatus] = useState('pending')

  const openEdit = (item: PPDB) => { setEditItem(item); setStatus(item.status); setModal(true) }

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editItem) return
    const res = await updatePpdb(editItem.id, { status })
    if (res) refresh()
    setModal(false)
  }

  const handleDelete = async (item: PPDB) => { const ok = await deletePpdb(item.id); if (ok) refresh() }

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Data PPDB</CardTitle>
            <p className="mt-0.5 text-xs text-gray-400">Pendaftaran Peserta Didik Baru</p>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { key: 'nama_lengkap', label: 'Nama', render: (item) => <span className="font-medium text-gray-900">{item.nama_lengkap}</span> },
              { key: 'nisn', label: 'NISN', render: (item) => <span className="font-mono text-xs text-gray-600">{item.nisn}</span> },
              { key: 'asal_sekolah', label: 'Asal Sekolah' },
              { key: 'jurusan', label: 'Jurusan' },
              { key: 'telepon', label: 'No. HP' },
              { key: 'status', label: 'Status', render: (item) => (
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[item.status] || 'bg-gray-50 text-gray-600'}`}>
                  <span className={`size-1.5 rounded-full ${item.status === 'diterima' ? 'bg-emerald-500' : item.status === 'ditolak' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              )},
            ]}
            data={data}
            loading={loading}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-700 ring-1 ring-yellow-200">
              <span className="size-1.5 rounded-full bg-yellow-500" /> Pending
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
              <span className="size-1.5 rounded-full bg-emerald-500" /> Diterima
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 ring-1 ring-red-200">
              <span className="size-1.5 rounded-full bg-red-500" /> Ditolak
            </span>
          </div>
        </CardContent>
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="Update Status PPDB">
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          {editItem && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Nama: <span className="font-medium text-gray-900">{editItem.nama_lengkap}</span></p>
              <p className="text-sm text-gray-500">Jurusan: <span className="font-medium text-gray-900">{editItem.jurusan}</span></p>
            </div>
          )}
          <Select label="Status" id="status" value={status} onChange={(e) => setStatus(e.target.value)} options={[
            { value: 'pending', label: 'Pending' },
            { value: 'diterima', label: 'Diterima' },
            { value: 'ditolak', label: 'Ditolak' },
          ]} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" icon={FiX} onClick={() => setModal(false)}>Batal</Button>
            <Button type="submit" icon={FiSave}>Simpan Status</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
