import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf-8'))

export default credentials
