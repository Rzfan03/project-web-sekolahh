const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message)

  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(e => e.message)
    return res.status(400).json({ message: 'Validasi gagal', errors: messages })
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors.map(e => e.message)
    return res.status(409).json({ message: 'Data sudah ada', errors: messages })
  }

  if (err.name === 'SequelizeDatabaseError') {
    return res.status(400).json({ message: 'Format data tidak valid' })
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'Ukuran file terlalu besar' })
  }

  if (err.message && err.message.includes('Tipe file tidak didukung')) {
    return res.status(400).json({ message: err.message })
  }

  return res.status(500).json({ message: 'Terjadi kesalahan server internal' })
}

export default errorHandler
