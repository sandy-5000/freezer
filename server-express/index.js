import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import fileController from '#~/controllers/file.controller'
import userController from '#~/controllers/user.controller'
import { validateToken } from '#~/middlewares/jwt.middleware'

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
app.use(validateToken)

const PORT = process.env.PORT || 5000
const HOST = process.env.HOST || 'localhost'
const MONGO_DB_URL = process.env.MONGO_DB_URL

app.get('/api', (_, res) => {
  res.status(200).json({
    message: 'Api [freezer]',
  })
})

app.use('/api/user', userController)
app.use('/api/file', fileController)

mongoose
  .connect(MONGO_DB_URL)
  .then(() => {
    console.log('connected To DB')
    app.listen(PORT, () => {
      console.log(`Server running on http://${HOST}:${PORT}`)
    })
  })
  .catch((e) => {
    console.log('NOT connected to DB', e)
  })
