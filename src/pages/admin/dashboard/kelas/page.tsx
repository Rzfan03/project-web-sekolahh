import { useState } from 'react'
import { FiPlus, FiSave, FiX } from 'react-icons/fi'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../lib/ui/Card'
import { Button } from '../../../../lib/ui/Button'
import { Input } from '../../../../lib/ui/Input'
import { Select } from '../../../../lib/ui/Select'
import { DataTable } from '../../../../lib/ui/DataTable'
import { Modal } from '../../../../lib/ui/Modal'
import { useData } from '../../../../hooks/useData'
import { getKelas, createKelas, updateKelas, deleteKelas } from '../../../../lib/supabase'
import type { Kelas } from '../../../../types/kelas'
import DashboardLayout from '../components/Layout'

const defaultForm = { nama: '', tingkat: 'X', kapasitas: 32 }

export default function KelasPage() {
  const { data, loading, refresh } = useData(getKelas)
  const [modal, setModal] = useState(false)
  const [editItem, setEditItem] = useState<Kelas | null>(null)
  const [form, setForm] = useState(defaultForm)

  const resetForm = () => { setForm(defaultForm); setEditItem(null) }
  const openEdit = (item: Kelas) => { setEditItem(item); setForm({ nama: item.nama, tingkat: item.tingkat, kapasitas: item.kapasitas }); setModal(true) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editItem) { const res = await updateKelas(editItem.id, form); if (res) refresh() }
    else { const res = await createKelas(form); if (res) refresh() }
    setModal(false); resetForm()
  }

  const handleDelete = async (item: Kelas) => { const ok = await deleteKelas(item.id); if (ok) refresh() }

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Data Kelas</CardTitle>
            <p className="mt-0.5 text-xs text-gray-400">Kelola data kelas</p>
          </div>
          <Button icon={FiPlus} onClick={() => { resetForm(); setModal(true) }}>Tambah Kelas</Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { key: 'nama', label: 'Nama Kelas', render: (item) => <span className="font-medium text-gray-900">{item.nama}</span> },
              { key: 'tingkat', label: 'Tingkat', render: (item) => (
                <span className="inline-flex rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">{item.tingkat}</span>
              )},
              { key: 'kapasitas', label: 'Kapasitas', render: (item) => <span>{item.kapasitas} siswa</span> },
            ]}
            data={data}
            loading={loading}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <Modal open={modal} onClose={() => { setModal(false); resetForm() }} title={editItem ? 'Edit Kelas' : 'Tambah Kelas'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nama Kelas" id="nama" placeholder="Contoh: X RPL 1" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select label="Tingkat" id="tingkat" value={form.tingkat} onChange={(e) => setForm({ ...form, tingkat: e.target.value })} options={[
              { value: 'X', label: 'X' },
              { value: 'XI', label: 'XI' },
              { value: 'XII', label: 'XII' },
            ]} />
            <Input label="Kapasitas" id="kapasitas" type="number" min={1} value={form.kapasitas} onChange={(e) => setForm({ ...form, kapasitas: Number(e.target.value) })} required />
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
