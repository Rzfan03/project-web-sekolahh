export default function handler(req, res) {
  res.status(200).json({ message: 'test ok', url: req.url, method: req.method })
}
