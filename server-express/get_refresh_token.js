import fs from 'fs'
import { google } from 'googleapis'
import express from 'express'

const credentials = JSON.parse(fs.readFileSync('credentials.json'))
const { client_id, client_secret } = credentials.installed || credentials.web

const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  'http://localhost:5000',
)

const SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube.force-ssl',
]

async function getAccessToken() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
  })

  console.log('\nOpen this URL in your browser:\n\n')
  console.log(authUrl)
  console.log('\n\n')
}

getAccessToken()

const app = express()

app.get('/', async (req, res) => {
  const { code } = req.query
  const { tokens } = await oauth2Client.getToken(code)
  console.log('Your Refresh Token:', tokens.refresh_token)
  credentials.refresh_token = tokens.refresh_token
  fs.writeFileSync('credentials.json', JSON.stringify(credentials, null, 4))
  console.log('-------- Updated credentials.json with refresh token.')
  res.json({ message: 'done' })
})

app.listen(5000, () => console.log('running in port 5000'))
