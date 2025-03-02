import express from 'express'
import bodyParser from 'body-parser'
import UserService from '#~/services/user.service'
import JwtService from '#~/services/jwt.service'
import { ERRORS } from '#~/utils/error.types'
import { HANDLER_TYPE } from '#~/utils/enums.constants'

const app = express.Router()
app.use(bodyParser.urlencoded({ extended: false }))

app.route('/login').post(async (req, res) => {
  const { username, passwd } = req.body
  try {
    let user = await UserService.authenticate(username, passwd)
    user = JSON.parse(JSON.stringify(user))
    const payload = UserService.payload(user)
    const token = JwtService.sign(payload)
    return res.status(200).json({ result: { ...user, passwd: '' }, token })
  } catch (e) {
    if (
      e.message === ERRORS.AUTH.INVALID_CREDENTIALS ||
      e.message === ERRORS.AUTH.USER_NOT_FOUND
    ) {
      return res.status(401).json({
        error:
          ERRORS.AUTH.INVALID_CREDENTIALS + ' OR ' + ERRORS.AUTH.USER_NOT_FOUND,
      })
    }
    return res.status(500).json({
      error: ERRORS.INTERNAL_SERVER_ERROR,
    })
  }
})

app.route('/register').post(async (req, res) => {
  const { name, username, email, passwd } = req.body
  try {
    let user = await UserService.create({
      name,
      username,
      email,
      passwd,
    })
    user = JSON.parse(JSON.stringify(user))
    const payload = UserService.payload(user)
    const token = JwtService.sign(payload)
    return res.status(201).json({ result: { ...user, passwd: '' }, token })
  } catch (e) {
    console.log(e)
    if (e.message === ERRORS.ACCOUNT.ALREADY_EXISTS) {
      return res.status(409).json({
        error: ERRORS.ACCOUNT.ALREADY_EXISTS,
      })
    }
    return res.status(500).json({
      error: ERRORS.INTERNAL_SERVER_ERROR,
    })
  }
})

app.route('/exists').get(async (req, res) => {
  let { handler = '', type = '' } = req.query
  if (!Object.values(HANDLER_TYPE).includes(type)) {
    type = HANDLER_TYPE.USERNAME
  }
  try {
    const flag = await UserService.exists({ handler, type })
    return res.status(200).json({ flag })
  } catch (e) {
    return res.status(500).json({
      error: ERRORS.INTERNAL_SERVER_ERROR,
    })
  }
})

const userController = app
export default userController
