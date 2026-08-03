import { useState } from 'react'
import { FiPlus, FiSave, FiX, FiMail } from 'react-icons/fi'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../lib/ui/Card'
import { Button } from '../../../../lib/ui/Button'
import { Input } from '../../../../lib/ui/Input'
import { Select } from '../../../../lib/ui/Select'
import { DataTable } from '../../../../lib/ui/DataTable'
import { Modal } from '../../../../lib/ui/Modal'
import { useData } from '../../../../hooks/useData'
import { getAdmins, createAdminAccount, updateAdmin, deleteAdmin } from '../../../../lib/supabase'
import type { Admin } from '../../../../types/admin'
import DashboardLayout from '../components/Layout'

const emptyForm = { email: '', password: '', role: 'admin' }

function RoleBadge({ role }: { role: string }) {
  const superadmin = role === 'superadmin'
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
      superadmin ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-600'
    }`}>
      {superadmin ? 'Super Admin' : 'Admin'}
    </span>
  )
}

export default function AccountPage() {
  const { data, loading, refresh } = useData(getAdmins)
  const [modal, setModal] = useState(false)
  const [editItem, setEditItem] = useState<Admin | null>(null)
  const [form, setForm] = useState(emptyForm)

  const resetForm = () => { setForm(emptyForm); setEditItem(null) }
  const openEdit = (item: Admin) => {
    setEditItem(item)
    setForm({ email: item.username, password: '', role: item.role })
    setModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editItem) {
      const res = await updateAdmin(editItem.id, { role: form.role })
      if (res) refresh()
    } else {
      if (!form.email || !form.password || form.password.length < 6) return
      const res = await createAdminAccount({ email: form.email, password: form.password, role: form.role })
      if (res) refresh()
    }
    setModal(false)
    resetForm()
  }

  const handleDelete = async (item: Admin) => {
    const ok = await deleteAdmin(item.id)
    if (ok) refresh()
  }

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Manajemen Akun</CardTitle>
            <p className="mt-0.5 text-xs text-gray-400">Kelola akun admin dan role</p>
          </div>
          <Button icon={FiPlus} onClick={() => { resetForm(); setModal(true) }}>Tambah Akun</Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { key: 'username', label: 'Email', render: (item) => (
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-orange-50 text-orange-500 ring-2 ring-gray-100">
                    <FiMail className="size-4" />
                  </div>
                  <span className="font-medium text-gray-900">{item.username}</span>
                </div>
              )},
              { key: 'role', label: 'Role', render: (item) => <RoleBadge role={item.role} /> },
            ]}
            data={data}
            loading={loading}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <Modal open={modal} onClose={() => { setModal(false); resetForm() }} title={editItem ? 'Edit Akun' : 'Tambah Akun'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="nama@email.com" disabled={!!editItem} />
          {!editItem ? (
            <>
              <Input label="Password" id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} placeholder="Minimal 6 karakter" />
              <p className="rounded-md bg-blue-50 px-3 py-2 text-xs text-blue-600">
                Akun login dibuat di Supabase Auth. Jika muncul error "Email rate limit exceeded", matikan "Confirm email" di Supabase Dashboard &gt; Authentication &gt; Providers supaya akun langsung aktif tanpa perlu konfirmasi email.
              </p>
            </>
          ) : (
            <p className="rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-500">Email tidak dapat diubah. Password direset melalui Supabase Auth.</p>
          )}
          <Select label="Role" id="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} options={[
            { value: 'admin', label: 'Admin' },
            { value: 'superadmin', label: 'Super Admin' },
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
