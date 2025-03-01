import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 5000
const HOST = process.env.HOST || 'localhost'

app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Api [freezer]',
  })
})

app.listen(PORT, () => console.log(`visit http://${HOST}:${PORT}`))
