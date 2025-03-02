import JwtService from '#~/services/jwt.service'
import { ERRORS } from '#~/utils/error.types'

const excludedRoutes = [
  '/api/user/login',
  '/api/user/register',
  '/api/user/exists',
]

const validateToken = (req, res, next) => {
  try {
    if (excludedRoutes.includes(req.path)) {
      return next()
    }
    const { token } = req.headers
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' })
    }
    const decoded = JwtService.verify(token)
    req.token_data = decoded
    return next()
  } catch (e) {
    if (e.message === ERRORS.JWT.INVALID_OR_EXPIRED) {
      return res.status(403).json({ error: e.message })
    }
    if (e.message === ERRORS.JWT.SECRET_NOT_DEFINED) {
      return res.status(500).json({ error: 'Internal Server error' })
    }
  }
}

export { validateToken }
