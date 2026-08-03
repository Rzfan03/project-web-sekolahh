import { useState } from 'react'
import { FiPlus, FiSave, FiX } from 'react-icons/fi'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../lib/ui/Card'
import { Button } from '../../../../lib/ui/Button'
import { Input } from '../../../../lib/ui/Input'
import { Textarea } from '../../../../lib/ui/Textarea'
import { Select } from '../../../../lib/ui/Select'
import ImageUpload from '../../../../lib/ui/ImageUpload'
import { DataTable } from '../../../../lib/ui/DataTable'
import { Modal } from '../../../../lib/ui/Modal'
import { useData } from '../../../../hooks/useData'
import { getGaleri, createGaleri, updateGaleri, deleteGaleri } from '../../../../lib/supabase'
import { PLACEHOLDER_IMAGE } from '../../../../lib/placeholder'
import type { Galeri } from '../../../../types/galeri'
import DashboardLayout from '../components/Layout'

const kategoriOptions = [
  { value: 'Kegiatan', label: 'Kegiatan' },
  { value: 'Prestasi', label: 'Prestasi' },
  { value: 'Olahraga', label: 'Olahraga' },
  { value: 'Seni', label: 'Seni' },
  { value: 'Lainnya', label: 'Lainnya' },
]

const kategoriColors: Record<string, string> = {
  Kegiatan: 'bg-blue-50 text-blue-700',
  Prestasi: 'bg-amber-50 text-amber-700',
  Olahraga: 'bg-emerald-50 text-emerald-700',
  Seni: 'bg-violet-50 text-violet-700',
}

export default function GaleriPage() {
  const { data, loading, refresh } = useData(getGaleri)
  const [modal, setModal] = useState(false)
  const [editItem, setEditItem] = useState<Galeri | null>(null)
  const [form, setForm] = useState({ judul: '', deskripsi: '', image: '', kategori: 'Kegiatan' })

  const resetForm = () => { setForm({ judul: '', deskripsi: '', image: '', kategori: 'Kegiatan' }); setEditItem(null) }
  const openEdit = (item: Galeri) => { setEditItem(item); setForm({ judul: item.judul, deskripsi: item.deskripsi, image: item.image, kategori: item.kategori }); setModal(true) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editItem) { const res = await updateGaleri(editItem.id, form); if (res) refresh() }
    else { const res = await createGaleri(form); if (res) refresh() }
    setModal(false); resetForm()
  }

  const handleDelete = async (item: Galeri) => { const ok = await deleteGaleri(item.id); if (ok) refresh() }

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Data Galeri</CardTitle>
            <p className="mt-0.5 text-xs text-gray-400">Kelola galeri foto sekolah</p>
          </div>
          <Button icon={FiPlus} onClick={() => { resetForm(); setModal(true) }}>Tambah Galeri</Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { key: 'judul', label: 'Judul', render: (item) => <span className="font-medium text-gray-900">{item.judul}</span> },
              { key: 'kategori', label: 'Kategori', render: (item) => (
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${kategoriColors[item.kategori] || 'bg-gray-100 text-gray-600'}`}>{item.kategori}</span>
              )},
              { key: 'image', label: 'Gambar', render: (item) => (
                <img src={item.image} alt={item.judul} onError={(e) => { const img = e.currentTarget; if (img.dataset.fbk !== '1') { img.dataset.fbk = '1'; img.src = PLACEHOLDER_IMAGE } }} className="h-14 w-24 rounded-lg object-cover shadow-sm" />
              )},
            ]}
            data={data}
            loading={loading}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <Modal open={modal} onClose={() => { setModal(false); resetForm() }} title={editItem ? 'Edit Galeri' : 'Tambah Galeri'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Judul" id="judul" value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} required />
          <Select label="Kategori" id="kategori" value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} options={kategoriOptions} />
          <Textarea label="Deskripsi" id="deskripsi" value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} />
          <ImageUpload value={form.image} onChange={(val) => setForm({ ...form, image: val })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" icon={FiX} onClick={() => { setModal(false); resetForm() }}>Batal</Button>
            <Button type="submit" icon={FiSave}>{editItem ? 'Simpan Perubahan' : 'Simpan'}</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
