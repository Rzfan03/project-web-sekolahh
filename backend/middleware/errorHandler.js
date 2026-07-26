const errorHandler = (err, req, res, next) => {
  console.error(err.stack)

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'Ukuran file terlalu besar' })
  }

  if (err.message && err.message.includes('File type')) {
    return res.status(400).json({ message: err.message })
  }

  return res.status(500).json({ message: 'Terjadi kesalahan server internal' })
}

export default errorHandler
