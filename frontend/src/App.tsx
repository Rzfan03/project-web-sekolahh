import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import ProfilSekolahPage from './pages/profil/index'
import BeritaPage from './pages/berita/index'
import DetailBeritaPage from './pages/berita/[slug]/index'
import JurusanPage from './pages/jurusan/index'
import GaleriPage from './pages/galeri/index'
import GuruPage from './pages/guru/index'
import PengumumanPage from './pages/pengumuman/index'
import JadwalPage from './pages/jadwal/index'
import PpdbPage from './pages/ppdb/index'
import PublicLayout from './components/PublicLayout'
import LoginPage from './pages/login/page'
import ProtectedRoute from './pages/admin/ProtectedRoute'
import DashboardPage from './pages/admin/dashboard/page'
import ArtikelPage from './pages/admin/dashboard/artikel/page'
import AdminGaleriPage from './pages/admin/dashboard/galeri/page'
import AdminGuruPage from './pages/admin/dashboard/guru/page'
import AdminJadwalPage from './pages/admin/dashboard/jadwal/page'
import KelasPage from './pages/admin/dashboard/kelas/page'
import AdminPengumumanPage from './pages/admin/dashboard/pengumuman/page'
import AdminPpdbPage from './pages/admin/dashboard/ppdb/page'
import ProfilPage from './pages/admin/dashboard/profil/page'
import SiswaPage from './pages/admin/dashboard/siswa/page'
import AccountPage from './pages/admin/dashboard/account/page'

const App = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/profil" element={<ProfilSekolahPage />} />
        <Route path="/berita" element={<BeritaPage />} />
        <Route path="/berita/:slug" element={<DetailBeritaPage />} />
        <Route path="/jurusan" element={<JurusanPage />} />
        <Route path="/galeri" element={<GaleriPage />} />
        <Route path="/guru" element={<GuruPage />} />
        <Route path="/pengumuman" element={<PengumumanPage />} />
        <Route path="/jadwal" element={<JadwalPage />} />
        <Route path="/ppdb" element={<PpdbPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="dashboard/artikel" element={<ArtikelPage />} />
        <Route path="dashboard/galeri" element={<AdminGaleriPage />} />
        <Route path="dashboard/guru" element={<AdminGuruPage />} />
        <Route path="dashboard/jadwal" element={<AdminJadwalPage />} />
        <Route path="dashboard/kelas" element={<KelasPage />} />
        <Route path="dashboard/pengumuman" element={<AdminPengumumanPage />} />
        <Route path="dashboard/ppdb" element={<AdminPpdbPage />} />
        <Route path="dashboard/profil" element={<ProfilPage />} />
        <Route path="dashboard/siswa" element={<SiswaPage />} />
        <Route path="dashboard/account" element={<AccountPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
