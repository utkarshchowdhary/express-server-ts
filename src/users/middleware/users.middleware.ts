import { Request, Response, NextFunction } from 'express'
import debug from 'debug'
import usersService from '../services/users.service'

const log = debug('app:users-middleware')

class UsersMiddleware {
  constructor() {
    log('Created new instance of UsersMiddleware')
  }

  extractUserId(req: Request, res: Response, next: NextFunction) {
    req.body.id = req.params.userId
    next()
  }

  async validateUserExists(req: Request, res: Response, next: NextFunction) {
    const user = await usersService.readById(req.body.id)
    if (user) {
      next()
    } else {
      res.status(404).send({ errors: [`User ${req.body.id} not found`] })
    }
  }

  async validateSameEmailDoesntExist(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user = await usersService.getUserByEmail(req.body.email)
    if (user) {
      res.status(400).send({ errors: ['User email already exists'] })
    } else {
      next()
    }
  }

  async validateSameEmailBelongToSameUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (req.body.email) {
      // email should be same as previous resource
      const user = await usersService.getUserByEmail(req.body.email)
      if (user && user.id === req.body.id) {
        next()
      } else {
        res.status(400).send({ errors: ['Invalid email'] })
      }
    } else {
      next()
    }
  }
}

export default new UsersMiddleware()
