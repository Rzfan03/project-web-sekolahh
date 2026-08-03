import { useState } from 'react'
import { FiPlus, FiSave, FiX } from 'react-icons/fi'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../lib/ui/Card'
import { Button } from '../../../../lib/ui/Button'
import { Input } from '../../../../lib/ui/Input'
import { Select } from '../../../../lib/ui/Select'
import { DataTable } from '../../../../lib/ui/DataTable'
import { Modal } from '../../../../lib/ui/Modal'
import { useData } from '../../../../hooks/useData'
import { getJadwal, createJadwal, updateJadwal, deleteJadwal, getGuru, getKelas } from '../../../../lib/supabase'
import type { Jadwal } from '../../../../types/jadwal'
import type { Guru } from '../../../../types/guru'
import type { Kelas } from '../../../../types/kelas'
import DashboardLayout from '../components/Layout'

const hariOptions = [
  { value: 'Senin', label: 'Senin' },
  { value: 'Selasa', label: 'Selasa' },
  { value: 'Rabu', label: 'Rabu' },
  { value: 'Kamis', label: 'Kamis' },
  { value: 'Jumat', label: 'Jumat' },
  { value: 'Sabtu', label: 'Sabtu' },
]

const hariColors: Record<string, string> = {
  Senin: 'bg-blue-50 text-blue-700',
  Selasa: 'bg-emerald-50 text-emerald-700',
  Rabu: 'bg-violet-50 text-violet-700',
  Kamis: 'bg-amber-50 text-amber-700',
  Jumat: 'bg-rose-50 text-rose-700',
  Sabtu: 'bg-cyan-50 text-cyan-700',
}

const defaultForm = { hari: 'Senin', jam_mulai: '', jam_selesai: '', mata_pelajaran: '', guru_id: '', kelas_id: '', ruangan: '' }

export default function JadwalPage() {
  const { data, loading, refresh } = useData(getJadwal)
  const { data: guruList } = useData(getGuru)
  const { data: kelasList } = useData(getKelas)
  const [modal, setModal] = useState(false)
  const [editItem, setEditItem] = useState<Jadwal | null>(null)
  const [form, setForm] = useState(defaultForm)

  const guruById = new Map((guruList as Guru[]).map((g) => [g.id, g.nama]))
  const kelasById = new Map((kelasList as Kelas[]).map((k) => [k.id, k.nama]))

  const resetForm = () => { setForm(defaultForm); setEditItem(null) }
  const openEdit = (item: Jadwal) => {
    setEditItem(item)
    setForm({ hari: item.hari, jam_mulai: item.jam_mulai, jam_selesai: item.jam_selesai, mata_pelajaran: item.mata_pelajaran, guru_id: item.guru_id ? String(item.guru_id) : '', kelas_id: item.kelas_id ? String(item.kelas_id) : '', ruangan: item.ruangan })
    setModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      hari: form.hari,
      jam_mulai: form.jam_mulai,
      jam_selesai: form.jam_selesai,
      mata_pelajaran: form.mata_pelajaran,
      guru_id: form.guru_id ? Number(form.guru_id) : null,
      kelas_id: form.kelas_id ? Number(form.kelas_id) : null,
      ruangan: form.ruangan,
    }
    if (editItem) { const res = await updateJadwal(editItem.id, payload); if (res) refresh() }
    else { const res = await createJadwal(payload); if (res) refresh() }
    setModal(false); resetForm()
  }

  const handleDelete = async (item: Jadwal) => { const ok = await deleteJadwal(item.id); if (ok) refresh() }

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Data Jadwal</CardTitle>
            <p className="mt-0.5 text-xs text-gray-400">Kelola jadwal pelajaran</p>
          </div>
          <Button icon={FiPlus} onClick={() => { resetForm(); setModal(true) }}>Tambah Jadwal</Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { key: 'hari', label: 'Hari', render: (item) => (
                <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${hariColors[item.hari] || 'bg-gray-50 text-gray-600'}`}>{item.hari}</span>
              )},
              { key: 'jam', label: 'Jam', render: (item) => (
                <span className="text-xs text-gray-600">{item.jam_mulai} - {item.jam_selesai}</span>
              )},
              { key: 'mata_pelajaran', label: 'Mata Pelajaran', render: (item) => <span className="font-medium text-gray-900">{item.mata_pelajaran}</span> },
              { key: 'kelas_id', label: 'Kelas', render: (item) => <span>{item.kelas_id ? kelasById.get(item.kelas_id) || `Kelas #${item.kelas_id}` : '-'}</span> },
              { key: 'guru_id', label: 'Guru', render: (item) => <span>{item.guru_id ? guruById.get(item.guru_id) || `Guru #${item.guru_id}` : '-'}</span> },
              { key: 'ruangan', label: 'Ruangan' },
            ]}
            data={data}
            loading={loading}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <Modal open={modal} onClose={() => { setModal(false); resetForm() }} title={editItem ? 'Edit Jadwal' : 'Tambah Jadwal'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select label="Hari" id="hari" value={form.hari} onChange={(e) => setForm({ ...form, hari: e.target.value })} options={hariOptions} />
            <Input label="Mata Pelajaran" id="mata_pelajaran" value={form.mata_pelajaran} onChange={(e) => setForm({ ...form, mata_pelajaran: e.target.value })} required />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Jam Mulai" id="jam_mulai" type="time" value={form.jam_mulai} onChange={(e) => setForm({ ...form, jam_mulai: e.target.value })} required />
            <Input label="Jam Selesai" id="jam_selesai" type="time" value={form.jam_selesai} onChange={(e) => setForm({ ...form, jam_selesai: e.target.value })} required />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select label="Kelas" id="kelas_id" value={form.kelas_id} onChange={(e) => setForm({ ...form, kelas_id: e.target.value })} options={[
              { value: '', label: '- Pilih Kelas -' },
              ...(kelasList as Kelas[]).map((k) => ({ value: String(k.id), label: k.nama })),
            ]} />
            <Select label="Guru" id="guru_id" value={form.guru_id} onChange={(e) => setForm({ ...form, guru_id: e.target.value })} options={[
              { value: '', label: '- Pilih Guru -' },
              ...(guruList as Guru[]).map((g) => ({ value: String(g.id), label: g.nama })),
            ]} />
          </div>
          <Input label="Ruangan" id="ruangan" value={form.ruangan} onChange={(e) => setForm({ ...form, ruangan: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" icon={FiX} onClick={() => { setModal(false); resetForm() }}>Batal</Button>
            <Button type="submit" icon={FiSave}>{editItem ? 'Simpan Perubahan' : 'Simpan'}</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
