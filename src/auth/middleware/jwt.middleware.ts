import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import usersService from '../../users/services/users.service'

const jwtSecret = process.env.JWT_SECRET!

class JwtMiddleware {
  validJWTNeeded(req: Request, res: Response, next: NextFunction) {
    if (req.headers['authorization']) {
      try {
        const authorization = req.headers['authorization'].split(' ')
        if (authorization[0] !== 'Bearer') {
          res.status(401).send()
        } else {
          res.locals.jwt = jwt.verify(authorization[1], jwtSecret)
          next()
        }
      } catch (err) {
        res.status(403).send()
      }
    } else {
      res.status(401).send()
    }
  }

  async validRefreshNeeded(req: Request, res: Response, next: NextFunction) {
    const user = await usersService.getUserByEmailWithPassword(
      res.locals.jwt.email
    )

    if (user) {
      const salt = crypto.createSecretKey(
        Buffer.from(res.locals.jwt.refreshKey.data)
      )
      const hash = crypto
        .createHmac('sha512', salt)
        .update(res.locals.jwt.userId + jwtSecret)
        .digest('base64')

      if (hash === req.body.refreshToken) {
        req.body = {
          userId: user.id,
          email: user.email,
          permissionFlags: user.permissionFlags
        }
        next()
      } else {
        res.status(400).send({ errors: ['Invalid refresh token'] })
      }
    } else {
      res
        .status(400)
        .send({ errors: ['Invalid payload, document no longer exists'] })
    }
  }
}

export default new JwtMiddleware()
