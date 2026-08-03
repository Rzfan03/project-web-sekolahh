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
import { getAgenda, createAgenda, updateAgenda, deleteAgenda } from '../../../../lib/supabase'
import type { Agenda } from '../../../../types/agenda'
import DashboardLayout from '../components/Layout'

const today = () => new Date().toISOString().slice(0, 10)
const defaultForm = { judul: '', tanggal: today(), jam: '', lokasi: '', keterangan: '', status: 'draft' }

export default function AgendaPage() {
  const { data, loading, refresh } = useData(getAgenda)
  const [modal, setModal] = useState(false)
  const [editItem, setEditItem] = useState<Agenda | null>(null)
  const [form, setForm] = useState(defaultForm)

  const resetForm = () => { setForm(defaultForm); setEditItem(null) }
  const openEdit = (item: Agenda) => { setEditItem(item); setForm({ judul: item.judul, tanggal: item.tanggal, jam: item.jam, lokasi: item.lokasi, keterangan: item.keterangan, status: item.status }); setModal(true) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editItem) { const res = await updateAgenda(editItem.id, form); if (res) refresh() }
    else { const res = await createAgenda(form); if (res) refresh() }
    setModal(false); resetForm()
  }

  const handleDelete = async (item: Agenda) => { const ok = await deleteAgenda(item.id); if (ok) refresh() }

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Data Agenda</CardTitle>
            <p className="mt-0.5 text-xs text-gray-400">Kelola agenda dan kegiatan sekolah</p>
          </div>
          <Button icon={FiPlus} onClick={() => { resetForm(); setModal(true) }}>Tambah Agenda</Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { key: 'judul', label: 'Judul', render: (item) => <span className="font-medium text-gray-900">{item.judul}</span> },
              { key: 'tanggal', label: 'Tanggal', render: (item) => <span className="text-xs text-gray-600">{item.tanggal}</span> },
              { key: 'jam', label: 'Waktu & Lokasi', render: (item) => <span className="text-xs text-gray-600">{item.jam || '—'}{item.lokasi ? ` · ${item.lokasi}` : ''}</span> },
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

      <Modal open={modal} onClose={() => { setModal(false); resetForm() }} title={editItem ? 'Edit Agenda' : 'Tambah Agenda'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Judul Agenda" id="judul" value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} required />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input label="Tanggal" id="tanggal" type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} required />
            <Input label="Jam" id="jam" value={form.jam} placeholder="08.00 - 12.00" onChange={(e) => setForm({ ...form, jam: e.target.value })} />
            <Input label="Lokasi" id="lokasi" value={form.lokasi} placeholder="Aula Sekolah" onChange={(e) => setForm({ ...form, lokasi: e.target.value })} />
          </div>
          <Textarea label="Keterangan" id="keterangan" rows={4} value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} />
          <Select label="Status" id="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={[
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' },
          ]} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" icon={FiX} onClick={() => { setModal(false); resetForm() }}>Batal</Button>
            <Button type="submit" icon={FiSave}>{editItem ? 'Simpan Perubahan' : 'Simpan'}</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
