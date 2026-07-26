import express from 'express'
import { getDashboardStats } from '../controller/dashboardController.js'
import { getAllArticles, getArticleById, createArticle, updateArticle, deleteArticle } from '../controller/articleController.js'
import { getAllGuru, createGuru, updateGuru, deleteGuru } from '../controller/guruController.js'
import { getAllSiswa, getSiswaById, createSiswa, updateSiswa, deleteSiswa } from '../controller/siswaController.js'
import { getAllKelas, getKelasById, createKelas, updateKelas, deleteKelas } from '../controller/kelasController.js'
import { getJadwalAll, createJadwal, updateJadwal, deleteJadwal } from '../controller/jadwalController.js'
import { getAllPengumuman, createPengumuman, updatePengumuman, deletePengumuman } from '../controller/pengumumanController.js'
import { getAllGaleri, createGaleri, updateGaleri, deleteGaleri } from '../controller/galeriController.js'
import { updateProfil } from '../controller/profilController.js'
import { getAllPpdb, updatePpdbStatus, deletePpdb } from '../controller/ppdbController.js'
import { uploadArtikel, uploadGuru, uploadGaleri, uploadLogo } from '../middleware/upload.js'

const router = express.Router()

router.get('/dashboard', getDashboardStats)

router.get('/artikel', getAllArticles)
router.get('/artikel/:id', getArticleById)
router.post('/artikel', uploadArtikel, createArticle)
router.put('/artikel/:id', uploadArtikel, updateArticle)
router.delete('/artikel/:id', deleteArticle)

router.get('/guru', getAllGuru)
router.post('/guru', uploadGuru, createGuru)
router.put('/guru/:id', uploadGuru, updateGuru)
router.delete('/guru/:id', deleteGuru)

router.get('/siswa', getAllSiswa)
router.get('/siswa/:id', getSiswaById)
router.post('/siswa', createSiswa)
router.put('/siswa/:id', updateSiswa)
router.delete('/siswa/:id', deleteSiswa)

router.get('/kelas', getAllKelas)
router.get('/kelas/:id', getKelasById)
router.post('/kelas', createKelas)
router.put('/kelas/:id', updateKelas)
router.delete('/kelas/:id', deleteKelas)

router.get('/jadwal', getJadwalAll)
router.post('/jadwal', createJadwal)
router.put('/jadwal/:id', updateJadwal)
router.delete('/jadwal/:id', deleteJadwal)

router.get('/pengumuman', getAllPengumuman)
router.post('/pengumuman', createPengumuman)
router.put('/pengumuman/:id', updatePengumuman)
router.delete('/pengumuman/:id', deletePengumuman)

router.get('/galeri', getAllGaleri)
router.post('/galeri', uploadGaleri, createGaleri)
router.put('/galeri/:id', uploadGaleri, updateGaleri)
router.delete('/galeri/:id', deleteGaleri)

router.put('/profil', uploadLogo, updateProfil)

router.get('/ppdb', getAllPpdb)
router.put('/ppdb/:id', updatePpdbStatus)
router.delete('/ppdb/:id', deletePpdb)

export default router
