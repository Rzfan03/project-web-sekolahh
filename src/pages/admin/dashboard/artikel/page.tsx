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
import { getArticle, createArticle, updateArticle, deleteArticle } from '../../../../lib/supabase'
import { KATEGORI_ARTIKEL, kategoriBadge } from '../../../../lib/kategori'
import type { Article } from '../../../../types/articles'
import DashboardLayout from '../components/Layout'

export default function ArtikelPage() {
  const { data, loading, refresh } = useData(getArticle)
  const [modal, setModal] = useState(false)
  const [editItem, setEditItem] = useState<Article | null>(null)
  const [form, setForm] = useState({ judul: '', slug: '', kategori: '', ringkasan: '', deskripsi: '', image: '', status: 'draft' })

  const resetForm = () => { setForm({ judul: '', slug: '', kategori: '', ringkasan: '', deskripsi: '', image: '', status: 'draft' }); setEditItem(null) }

  const openEdit = (item: Article) => { setEditItem(item); setForm({ judul: item.judul, slug: item.slug, kategori: item.kategori || '', ringkasan: item.ringkasan, deskripsi: item.deskripsi, image: item.image, status: item.status }); setModal(true) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editItem) { const res = await updateArticle(editItem.id, form); if (res) refresh() }
    else { const res = await createArticle(form); if (res) refresh() }
    setModal(false); resetForm()
  }

  const handleDelete = async (item: Article) => { const ok = await deleteArticle(item.id); if (ok) refresh() }

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Data Artikel</CardTitle>
            <p className="mt-0.5 text-xs text-gray-400">Kelola artikel berita sekolah</p>
          </div>
          <Button icon={FiPlus} onClick={() => { resetForm(); setModal(true) }}>Tambah Artikel</Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { key: 'judul', label: 'Judul', render: (item) => (
                <div className="flex items-center gap-3">
                  {item.image && <img src={item.image} alt="" className="size-10 rounded-md object-cover" />}
                  <span className="font-medium text-gray-900">{item.judul}</span>
                </div>
              )},
              { key: 'ringkasan', label: 'Ringkasan', render: (item) => (
                <span className="line-clamp-1 text-gray-500">{item.ringkasan}</span>
              )},
              { key: 'kategori', label: 'Kategori', render: (item) => (
                item.kategori ? (
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${kategoriBadge(item.kategori)}`}>{item.kategori}</span>
                ) : (
                  <span className="text-gray-400">-</span>
                )
              )},
              { key: 'status', label: 'Status', render: (item) => (
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                  item.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  <span className={`size-1.5 rounded-full ${item.status === 'published' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                  {item.status === 'published' ? 'Published' : 'Draft'}
                </span>
              )},
              { key: 'created_at', label: 'Tanggal', render: (item) => (
                <span className="text-gray-500">{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              )},
            ]}
            data={data}
            loading={loading}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <Modal open={modal} onClose={() => { setModal(false); resetForm() }} title={editItem ? 'Edit Artikel' : 'Tambah Artikel'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Judul" id="judul" value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} required />
            <Input label="Slug" id="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
          </div>
          <Textarea label="Ringkasan" id="ringkasan" value={form.ringkasan} onChange={(e) => setForm({ ...form, ringkasan: e.target.value })} required />
          <div>
            <Textarea label="Deskripsi" id="deskripsi" value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} required />
            <p className="mt-1 text-xs text-gray-400">Mendukung HTML: &lt;p&gt;, &lt;a href&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;/&lt;ol&gt;, &lt;img&gt;, &lt;blockquote&gt;, &lt;table&gt;, dll.</p>
          </div>
          <ImageUpload value={form.image} onChange={(val) => setForm({ ...form, image: val })} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select label="Kategori" id="kategori" value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} options={[{ value: '', label: 'Pilih Kategori' }, ...KATEGORI_ARTIKEL.map((k) => ({ value: k, label: k }))]} />
            <Select label="Status" id="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={[{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }]} />
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
