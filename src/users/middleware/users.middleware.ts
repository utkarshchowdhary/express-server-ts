import { Request, Response, NextFunction } from 'express'
import debug from 'debug'
import UserService from '../services/users.service'

const log = debug('app:users-middleware')

class UsersMiddleware {
  constructor() {
    log('Created new instance of UsersMiddleware')
  }

  async extractUserId(req: Request, res: Response, next: NextFunction) {
    req.body.id = req.params.userId
    next()
  }

  async validateUserExists(req: Request, res: Response, next: NextFunction) {
    const user = await UserService.readById(req.params.userId)
    if (user) {
      next()
    } else {
      res.status(404).send({ error: `User ${req.params.userId} not found` })
    }
  }

  async validateRequiredUserBodyFields(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (req.body.email && req.body.password) {
      next()
    } else {
      res
        .status(400)
        .send({ error: 'Missing required fields email and/or password' })
    }
  }

  async validateSameEmailDoesntExist(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user = await UserService.getUserByEmail(req.body.email)
    if (user) {
      res.status(400).send({ error: 'User email already exists' })
    } else {
      next()
    }
  }

  async validateSameEmailBelongToSameUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user = await UserService.getUserByEmail(req.body.email)
    if (user && user.id === req.params.userId) {
      next()
    } else {
      res.status(400).send({ error: 'Invalid email' })
    }
  }
}

export default new UsersMiddleware()
