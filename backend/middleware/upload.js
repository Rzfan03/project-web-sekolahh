import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, '/tmp'),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname))
})

const fileFilter = (_, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  cb(null, allowed.includes(file.mimetype))
}

const makeUpload = (field, maxSize = 5) => multer({ storage, fileFilter, limits: { fileSize: maxSize * 1024 * 1024 } }).single(field)

export const uploadArtikel = makeUpload('image')
export const uploadGuru = makeUpload('foto', 2)
export const uploadGaleri = makeUpload('image')
export const uploadLogo = makeUpload('logo', 2)
export const uploadPpdb = makeUpload('berkas', 3)
