import fs from 'fs'
import { google } from 'googleapis'
import credentials from '#~/config'
import { ERRORS } from '#~/utils/error.types'

export default class YouTubeService {
  static getYouTubeClient = () => {
    const oauth2Client = new google.auth.OAuth2(
      credentials.web.client_id,
      credentials.web.client_secret,
      'http://localhost:5000',
    )
    oauth2Client.setCredentials({ refresh_token: credentials.refresh_token })
    return google.youtube({ version: 'v3', auth: oauth2Client })
  }

  static async upload(
    videoPath,
    {
      title = 'Uploaded via API',
      description = 'This is an uploaded video.',
    } = {},
  ) {
    if (!videoPath) {
      throw new Error(ERRORS.VIDEO.INVALID_FILE_PATH)
    }
    const youtube = this.getYouTubeClient()
    const response = await youtube.videos.insert({
      part: 'snippet,status',
      requestBody: {
        snippet: {
          title: title,
          description: description,
          categoryId: '22',
        },
        status: {
          privacyStatus: 'private',
        },
      },
      media: {
        body: fs.createReadStream(videoPath),
      },
    })
    return response.data.id
  }

  static async delete(videoId) {
    const youtube = this.getYouTubeClient()
    await youtube.videos.delete({ id: videoId })
    return videoId
  }
}
