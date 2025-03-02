import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fileController from '#~/controllers/file.controller'

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 5000
const HOST = process.env.HOST || 'localhost'

app.get('/api', (_, res) => {
  res.status(200).json({
    message: 'Api [freezer]',
  })
})

app.use('/api/file', fileController)

app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`)
})
