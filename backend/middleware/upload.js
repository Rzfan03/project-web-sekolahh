import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const storage = (folder) => multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'uploads', folder))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, uniqueSuffix + ext)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Tipe file tidak didukung. Hanya JPG, PNG, GIF, WEBP yang diizinkan'), false)
  }
}

export const uploadArtikel = multer({
  storage: storage('artikel'),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
}).single('image')

export const uploadGuru = multer({
  storage: storage('guru'),
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
}).single('foto')

export const uploadGaleri = multer({
  storage: storage('galeri'),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
}).single('image')

export const uploadLogo = multer({
  storage: storage('profil'),
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
}).single('logo')

export const uploadPpdb = multer({
  storage: storage('ppdb'),
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 }
}).single('berkas')
