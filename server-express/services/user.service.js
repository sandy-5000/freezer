import users_ from '#~/models/user.model'
import { compare, hash } from 'bcrypt'
import { ERRORS } from '#~/utils/error.types'

export default class UserService {
  static payload(user) {
    const payload = {
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
    }
    return payload
  }

  static async authenticate(username, passwd) {
    const user = await users_.findOne({ username })
    if (!user) {
      throw new Error(ERRORS.AUTH.USER_NOT_FOUND)
    }
    const passwordMatched = await compare(passwd, user.passwd)
    if (!passwordMatched) {
      throw new Error(ERRORS.AUTH.INVALID_CREDENTIALS)
    }
    return user
  }

  static async create({ username, email, name, passwd }) {
    try {
      const hashedPasswd = await hash(passwd, 12)
      const new_user = new users_({
        username,
        email,
        name,
        passwd: hashedPasswd,
      })
      console.log(hashedPasswd)
      const result = await new_user.save()
      return result
    } catch (e) {
      if (e.code === 11000) {
        throw new Error(ERRORS.ACCOUNT.ALREADY_EXISTS)
      }
      throw new Error(ERRORS.INTERNAL_SERVER_ERROR)
    }
  }

  static async exists({ handler, type }) {
    try {
      const user = await users_.findOne({ [type]: handler })
      return Boolean(user)
    } catch (e) {
      throw new Error(ERRORS.INTERNAL_SERVER_ERROR)
    }
  }
}
