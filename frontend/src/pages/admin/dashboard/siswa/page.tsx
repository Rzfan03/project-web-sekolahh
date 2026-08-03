import { useState } from 'react'
import { FiPlus, FiSave, FiX } from 'react-icons/fi'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../lib/ui/Card'
import { Button } from '../../../../lib/ui/Button'
import { Input } from '../../../../lib/ui/Input'
import { Select } from '../../../../lib/ui/Select'
import { DataTable } from '../../../../lib/ui/DataTable'
import { Modal } from '../../../../lib/ui/Modal'
import { useData } from '../../../../hooks/useData'
import { getSiswa, createSiswa, updateSiswa, deleteSiswa, getKelas } from '../../../../lib/supabase'
import type { Siswa } from '../../../../types/siswa'
import type { Kelas } from '../../../../types/kelas'
import DashboardLayout from '../components/Layout'

const defaultForm = { nama_lengkap: '', nisn: '', tanggal_lahir: '', jenis_kelamin: 'Laki-laki', alamat: '', telepon: '', nama_orang_tua: '', tahun_masuk: new Date().getFullYear(), kelas_id: '', status: 'aktif' }

export default function SiswaPage() {
  const { data, loading, refresh } = useData(getSiswa)
  const { data: kelasList } = useData(getKelas)
  const [modal, setModal] = useState(false)
  const [editItem, setEditItem] = useState<Siswa | null>(null)
  const [form, setForm] = useState(defaultForm)

  const kelasById = new Map((kelasList as Kelas[]).map((k) => [k.id, k.nama]))

  const resetForm = () => { setForm(defaultForm); setEditItem(null) }
  const openEdit = (item: Siswa) => {
    setEditItem(item)
    setForm({ nama_lengkap: item.nama_lengkap, nisn: item.nisn, tanggal_lahir: item.tanggal_lahir, jenis_kelamin: item.jenis_kelamin, alamat: item.alamat, telepon: item.telepon, nama_orang_tua: item.nama_orang_tua, tahun_masuk: item.tahun_masuk, kelas_id: item.kelas_id ? String(item.kelas_id) : '', status: item.status })
    setModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      nama_lengkap: form.nama_lengkap,
      nisn: form.nisn,
      tanggal_lahir: form.tanggal_lahir,
      jenis_kelamin: form.jenis_kelamin,
      alamat: form.alamat,
      telepon: form.telepon,
      nama_orang_tua: form.nama_orang_tua,
      tahun_masuk: Number(form.tahun_masuk),
      kelas_id: form.kelas_id ? Number(form.kelas_id) : null,
      status: form.status,
    }
    if (editItem) { const res = await updateSiswa(editItem.id, payload); if (res) refresh() }
    else { const res = await createSiswa(payload); if (res) refresh() }
    setModal(false); resetForm()
  }

  const handleDelete = async (item: Siswa) => { const ok = await deleteSiswa(item.id); if (ok) refresh() }

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Data Siswa</CardTitle>
            <p className="mt-0.5 text-xs text-gray-400">Kelola data siswa</p>
          </div>
          <Button icon={FiPlus} onClick={() => { resetForm(); setModal(true) }}>Tambah Siswa</Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { key: 'nisn', label: 'NISN', render: (item) => <span className="text-xs font-medium text-gray-900">{item.nisn}</span> },
              { key: 'nama_lengkap', label: 'Nama', render: (item) => <span className="font-medium text-gray-900">{item.nama_lengkap}</span> },
              { key: 'kelas_id', label: 'Kelas', render: (item) => <span>{item.kelas_id ? kelasById.get(item.kelas_id) || `Kelas #${item.kelas_id}` : '-'}</span> },
              { key: 'jenis_kelamin', label: 'L/P' },
              { key: 'telepon', label: 'No. HP' },
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

      <Modal open={modal} onClose={() => { setModal(false); resetForm() }} title={editItem ? 'Edit Siswa' : 'Tambah Siswa'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Nama Lengkap" id="nama_lengkap" value={form.nama_lengkap} onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })} required />
            <Input label="NISN" id="nisn" value={form.nisn} onChange={(e) => setForm({ ...form, nisn: e.target.value })} required />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select label="Jenis Kelamin" id="jenis_kelamin" value={form.jenis_kelamin} onChange={(e) => setForm({ ...form, jenis_kelamin: e.target.value })} options={[{ value: 'Laki-laki', label: 'Laki-laki' }, { value: 'Perempuan', label: 'Perempuan' }]} />
            <Input label="Tanggal Lahir" id="tanggal_lahir" type="date" value={form.tanggal_lahir} onChange={(e) => setForm({ ...form, tanggal_lahir: e.target.value })} required />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select label="Kelas" id="kelas_id" value={form.kelas_id} onChange={(e) => setForm({ ...form, kelas_id: e.target.value })} options={[
              { value: '', label: '- Belum ditentukan -' },
              ...(kelasList as Kelas[]).map((k) => ({ value: String(k.id), label: k.nama })),
            ]} />
            <Input label="Tahun Masuk" id="tahun_masuk" type="number" min={2000} max={new Date().getFullYear() + 1} value={form.tahun_masuk} onChange={(e) => setForm({ ...form, tahun_masuk: Number(e.target.value) })} required />
            <Select label="Status" id="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={[
              { value: 'aktif', label: 'Aktif' },
              { value: 'nonaktif', label: 'Nonaktif' },
            ]} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Telepon" id="telepon" value={form.telepon} onChange={(e) => setForm({ ...form, telepon: e.target.value })} />
            <Input label="Nama Orang Tua" id="nama_orang_tua" value={form.nama_orang_tua} onChange={(e) => setForm({ ...form, nama_orang_tua: e.target.value })} />
          </div>
          <Input label="Alamat" id="alamat" value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" icon={FiX} onClick={() => { setModal(false); resetForm() }}>Batal</Button>
            <Button type="submit" icon={FiSave}>{editItem ? 'Simpan Perubahan' : 'Simpan'}</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
