import { useState } from 'react'
import { FiPlus, FiSave, FiX } from 'react-icons/fi'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../lib/ui/Card'
import { Button } from '../../../../lib/ui/Button'
import { Input } from '../../../../lib/ui/Input'
import { Select } from '../../../../lib/ui/Select'
import { Textarea } from '../../../../lib/ui/Textarea'
import ImageUpload from '../../../../lib/ui/ImageUpload'
import { DataTable } from '../../../../lib/ui/DataTable'
import { Modal } from '../../../../lib/ui/Modal'
import { useData } from '../../../../hooks/useData'
import { getGuru, createGuru, updateGuru, deleteGuru } from '../../../../lib/supabase'
import type { Guru } from '../../../../types/guru'
import DashboardLayout from '../components/Layout'

const defaultForm = { nama: '', nip: '', mata_pelajaran: '', foto: '', email: '', telepon: '', alamat: '', status: 'aktif' }

export default function GuruPage() {
  const { data, loading, refresh } = useData(getGuru)
  const [modal, setModal] = useState(false)
  const [editItem, setEditItem] = useState<Guru | null>(null)
  const [form, setForm] = useState(defaultForm)

  const resetForm = () => { setForm(defaultForm); setEditItem(null) }
  const openEdit = (item: Guru) => {
    setEditItem(item)
    setForm({ nama: item.nama, nip: item.nip, mata_pelajaran: item.mata_pelajaran, foto: item.foto, email: item.email, telepon: item.telepon, alamat: item.alamat, status: item.status })
    setModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editItem) { const res = await updateGuru(editItem.id, form); if (res) refresh() }
    else { const res = await createGuru(form); if (res) refresh() }
    setModal(false); resetForm()
  }

  const handleDelete = async (item: Guru) => { const ok = await deleteGuru(item.id); if (ok) refresh() }

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Data Guru</CardTitle>
            <p className="mt-0.5 text-xs text-gray-400">Kelola data guru dan staf sekolah</p>
          </div>
          <Button icon={FiPlus} onClick={() => { resetForm(); setModal(true) }}>Tambah Guru</Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { key: 'nama', label: 'Nama', render: (item) => (
                <div className="flex items-center gap-3">
                  {item.foto ? (
                    <img src={item.foto} alt={item.nama} className="size-9 rounded-full object-cover ring-2 ring-gray-100" />
                  ) : (
                    <div className="flex size-9 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600">{item.nama.charAt(0)}</div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{item.nama}</p>
                    <p className="text-xs text-gray-400">{item.email || '-'}</p>
                  </div>
                </div>
              )},
              { key: 'nip', label: 'NIP', render: (item) => <span className="text-xs text-gray-600">{item.nip}</span> },
              { key: 'mata_pelajaran', label: 'Mata Pelajaran', render: (item) => <span className="font-medium text-gray-900">{item.mata_pelajaran}</span> },
              { key: 'status', label: 'Status', render: (item) => (
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${item.status === 'aktif' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                  <span className={`size-1.5 rounded-full ${item.status === 'aktif' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                  {item.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
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

      <Modal open={modal} onClose={() => { setModal(false); resetForm() }} title={editItem ? 'Edit Guru' : 'Tambah Guru'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Nama" id="nama" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required />
            <Input label="NIP" id="nip" value={form.nip} onChange={(e) => setForm({ ...form, nip: e.target.value })} />
          </div>
          <Input label="Mata Pelajaran" id="mata_pelajaran" value={form.mata_pelajaran} onChange={(e) => setForm({ ...form, mata_pelajaran: e.target.value })} required />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Email" id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Telepon" id="telepon" value={form.telepon} onChange={(e) => setForm({ ...form, telepon: e.target.value })} />
          </div>
          <Textarea label="Alamat" id="alamat" value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} />
          <div className="grid grid-cols-1 gap-4 items-start sm:grid-cols-2">
            <Select label="Status" id="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={[
              { value: 'aktif', label: 'Aktif' },
              { value: 'nonaktif', label: 'Nonaktif' },
            ]} />
          </div>
          <ImageUpload value={form.foto} onChange={(val) => setForm({ ...form, foto: val })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" icon={FiX} onClick={() => { setModal(false); resetForm() }}>Batal</Button>
            <Button type="submit" icon={FiSave}>{editItem ? 'Simpan Perubahan' : 'Simpan'}</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
