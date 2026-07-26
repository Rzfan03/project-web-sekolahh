import express from 'express'
import { getPublishedArticles, getPublishedArticleBySlug } from '../controller/articleController.js'
import { getAllGuruPublic, getGuruByIdPublic } from '../controller/guruController.js'
import { getPublishedPengumuman } from '../controller/pengumumanController.js'
import { getGaleriPublic } from '../controller/galeriController.js'
import { getProfil } from '../controller/profilController.js'
import { getJadwalByKelas } from '../controller/jadwalController.js'
import { getAllKelas } from '../controller/kelasController.js'
import { submitPpdb } from '../controller/ppdbController.js'
import { uploadPpdb } from '../middleware/upload.js'

const router = express.Router()

router.get('/profil', getProfil)
router.get('/berita', getPublishedArticles)
router.get('/berita/:slug', getPublishedArticleBySlug)
router.get('/pengumuman', getPublishedPengumuman)
router.get('/guru', getAllGuruPublic)
router.get('/guru/:id', getGuruByIdPublic)
router.get('/galeri', getGaleriPublic)
router.get('/kelas', getAllKelas)
router.get('/jadwal/:kelasId', getJadwalByKelas)
router.post('/ppdb', uploadPpdb, submitPpdb)

export default router
