import express from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'
import multer from 'multer'
import { ERRORS } from '#~/utils/error.types'
import YouTubeService from '#~/services/youtube.service'

const app = express.Router()
const upload = multer({ dest: 'uploads/' })
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/upload', upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: ERRORS.VIDEO.INVALID_FILE_PATH })
  }
  try {
    const video_id = await YouTubeService.upload(req.file.path)
    res.status(200).json({
      result: {
        message: 'Video Uploaded successfully!',
        video_id,
      },
    })
  } catch (e) {
    console.error('Upload error:', e)
    res.status(500).json({ error: ERRORS.VIDEO.UPLOAD_FAILED })
  } finally {
    fs.unlinkSync(req.file.path)
  }
})

app.delete('/delete/:video_id', async (req, res) => {
  const { video_id } = req.params
  try {
    await YouTubeService.delete(video_id)
    res.status(200).json({
      result: {
        message: 'Video Deleted successfully!',
        video_id,
      },
    })
  } catch (error) {
    console.error('Delete error:', error)
    res.status(500).json({ error: ERRORS.VIDEO.DELETE_FAILED })
  }
})

const fileController = app
export default fileController
