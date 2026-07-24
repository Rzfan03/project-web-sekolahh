import express from 'express'
import { getAllData, getDataById } from '../controller/adminController.js'
const router = express.Router()

router.get('/article', getAllData)
router.get('/article/:id', getDataById)

export default router;