import { useEffect, useState } from 'react'
import { FiSave, FiHome } from 'react-icons/fi'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../lib/ui/Card'
import { Button } from '../../../../lib/ui/Button'
import { Input } from '../../../../lib/ui/Input'
import { Textarea } from '../../../../lib/ui/Textarea'
import ImageUpload from '../../../../lib/ui/ImageUpload'
import { getProfil, updateProfil } from '../../../../lib/supabase'
import type { ProfilSekolah } from '../../../../types/profil'
import DashboardLayout from '../components/Layout'

export default function ProfilPage() {
  const [data, setData] = useState<ProfilSekolah | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ nama_sekolah: '', alamat: '', telepon: '', email: '', website: '', logo: '', visi: '', misi: '' })

  useEffect(() => {
    getProfil().then((res) => {
      if (res.length > 0) {
        setData(res[0])
        const item = res[0]
        setForm({ nama_sekolah: item.nama_sekolah, alamat: item.alamat, telepon: item.telepon, email: item.email, website: item.website, logo: item.logo || '', visi: item.visi, misi: item.misi })
      }
      setLoading(false)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data) return
    setSaving(true)
    const res = await updateProfil(data.id, form)
    if (res) setData(res)
    setSaving(false)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="relative flex size-12 items-center justify-center">
            <div className="absolute size-12 animate-spin rounded-full border-4 border-gray-100" />
            <div className="absolute size-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {!data ? (
        <div className="flex flex-col items-center justify-center py-20">
          <FiHome className="size-12 text-gray-300" />
          <p className="mt-4 text-sm text-gray-500">Belum ada data profil sekolah</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Informasi Sekolah</CardTitle>
                  <p className="mt-0.5 text-xs text-gray-400">Kelola profil sekolah</p>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input label="Nama Sekolah" id="nama_sekolah" value={form.nama_sekolah} onChange={(e) => setForm({ ...form, nama_sekolah: e.target.value })} required />
                  <Textarea label="Alamat" id="alamat" value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} required />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input label="Telepon" id="telepon" value={form.telepon} onChange={(e) => setForm({ ...form, telepon: e.target.value })} required />
                    <Input label="Email" id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <Input label="Website" id="website" type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://" />
                  <Textarea label="Visi" id="visi" value={form.visi} onChange={(e) => setForm({ ...form, visi: e.target.value })} required />
                  <Textarea label="Misi" id="misi" value={form.misi} onChange={(e) => setForm({ ...form, misi: e.target.value })} required />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <span className="mb-1.5 block text-sm font-medium text-gray-700">Logo Sekolah</span>
                      <ImageUpload value={form.logo} onChange={(val) => setForm({ ...form, logo: val })} />
                    </div>
                    <div className="flex flex-col justify-end">
                      {form.logo && (
                        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                          <img src={form.logo} alt="Logo" className="size-16 rounded-lg bg-white object-contain p-1 ring-1 ring-gray-100" />
                          <p className="text-xs text-gray-400">Logo yang ditampilkan di navbar & sidebar</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end border-t border-gray-100 pt-5">
                    <Button type="submit" disabled={saving} icon={FiSave}>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Pratinjau</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-4 ring-orange-100">
                    {form.logo ? (
                      <img src={form.logo} alt="" className="size-full object-contain p-1" />
                    ) : (
                      <FiHome className="size-8 text-gray-300" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">{form.nama_sekolah || 'Nama Sekolah'}</p>
                    <p className="mt-0.5 text-xs text-gray-400">{form.website || 'website'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Alamat</p>
                  <p className="mt-1 text-sm text-gray-600">{form.alamat || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Kontak</p>
                  <p className="mt-1 text-sm text-gray-600">{form.telepon || '-'} • {form.email || '-'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
