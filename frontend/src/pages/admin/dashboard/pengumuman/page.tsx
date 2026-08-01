import { useState } from 'react'
import { FiPlus, FiSave, FiX } from 'react-icons/fi'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../lib/ui/Card'
import { Button } from '../../../../lib/ui/Button'
import { Input } from '../../../../lib/ui/Input'
import { Textarea } from '../../../../lib/ui/Textarea'
import { Select } from '../../../../lib/ui/Select'
import { DataTable } from '../../../../lib/ui/DataTable'
import { Modal } from '../../../../lib/ui/Modal'
import { useData } from '../../../../hooks/useData'
import { getPengumuman, createPengumuman, updatePengumuman, deletePengumuman } from '../../../../lib/supabase'
import type { Pengumuman } from '../../../../types/pengumuman'
import DashboardLayout from '../components/Layout'

const today = () => new Date().toISOString().slice(0, 10)
const defaultForm = { judul: '', isi: '', tanggal: today(), prioritas: 'sedang', status: 'draft' }

const prioritasColors: Record<string, string> = {
  tinggi: 'bg-red-50 text-red-700',
  sedang: 'bg-amber-50 text-amber-700',
  normal: 'bg-blue-50 text-blue-700',
}

export default function PengumumanPage() {
  const { data, loading, refresh } = useData(getPengumuman)
  const [modal, setModal] = useState(false)
  const [editItem, setEditItem] = useState<Pengumuman | null>(null)
  const [form, setForm] = useState(defaultForm)

  const resetForm = () => { setForm(defaultForm); setEditItem(null) }
  const openEdit = (item: Pengumuman) => { setEditItem(item); setForm({ judul: item.judul, isi: item.isi, tanggal: item.tanggal, prioritas: item.prioritas, status: item.status }); setModal(true) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editItem) { const res = await updatePengumuman(editItem.id, form); if (res) refresh() }
    else { const res = await createPengumuman(form); if (res) refresh() }
    setModal(false); resetForm()
  }

  const handleDelete = async (item: Pengumuman) => { const ok = await deletePengumuman(item.id); if (ok) refresh() }

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Data Pengumuman</CardTitle>
            <p className="mt-0.5 text-xs text-gray-400">Kelola pengumuman sekolah</p>
          </div>
          <Button icon={FiPlus} onClick={() => { resetForm(); setModal(true) }}>Tambah Pengumuman</Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { key: 'judul', label: 'Judul', render: (item) => <span className="font-medium text-gray-900">{item.judul}</span> },
              { key: 'tanggal', label: 'Tanggal', render: (item) => <span className="text-xs text-gray-600">{item.tanggal}</span> },
              { key: 'prioritas', label: 'Prioritas', render: (item) => (
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${prioritasColors[item.prioritas] || 'bg-gray-100 text-gray-600'}`}>{item.prioritas}</span>
              )},
              { key: 'status', label: 'Status', render: (item) => (
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                  item.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  <span className={`size-1.5 rounded-full ${item.status === 'published' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                  {item.status === 'published' ? 'Published' : 'Draft'}
                </span>
              )},
            ]}
            data={data}
            loading={loading}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <Modal open={modal} onClose={() => { setModal(false); resetForm() }} title={editItem ? 'Edit Pengumuman' : 'Tambah Pengumuman'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Judul" id="judul" value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} required />
          <Textarea label="Isi Pengumuman" id="isi" rows={5} value={form.isi} onChange={(e) => setForm({ ...form, isi: e.target.value })} required />
          <div className="grid grid-cols-3 gap-4">
            <Input label="Tanggal" id="tanggal" type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} required />
            <Select label="Prioritas" id="prioritas" value={form.prioritas} onChange={(e) => setForm({ ...form, prioritas: e.target.value })} options={[
              { value: 'tinggi', label: 'Tinggi' },
              { value: 'sedang', label: 'Sedang' },
              { value: 'normal', label: 'Normal' },
            ]} />
            <Select label="Status" id="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={[
              { value: 'draft', label: 'Draft' },
              { value: 'published', label: 'Published' },
            ]} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" icon={FiX} onClick={() => { setModal(false); resetForm() }}>Batal</Button>
            <Button type="submit" icon={FiSave}>{editItem ? 'Simpan Perubahan' : 'Simpan'}</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
