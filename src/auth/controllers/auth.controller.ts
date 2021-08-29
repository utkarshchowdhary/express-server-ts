import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const jwtSecret = process.env.JWT_SECRET!
const tokenExpirationInSeconds = 36000

class AuthController {
  createJWT(req: Request, res: Response) {
    const refreshId = req.body.userId + jwtSecret
    const salt = crypto.createSecretKey(crypto.randomBytes(16))
    const hash = crypto
      .createHmac('sha512', salt)
      .update(refreshId)
      .digest('base64')

    req.body.refreshKey = salt.export()

    const token = jwt.sign(req.body, jwtSecret, {
      expiresIn: tokenExpirationInSeconds
    })

    res.status(201).send({ accessToken: token, refreshToken: hash })
  }
}

export default new AuthController()
