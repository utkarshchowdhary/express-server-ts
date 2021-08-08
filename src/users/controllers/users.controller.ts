import { Request, Response } from 'express'
import debug from 'debug'
import bcrypt from 'bcryptjs'

import UsersService from '../services/users.service'

const log = debug('app:users-controller')

class UsersController {
  private static instance: UsersController

  private constructor() {
    log('Created new instance of UsersController')
  }

  static getInstance(): UsersController {
    if (!UsersController.instance) {
      UsersController.instance = new UsersController()
    }
    return UsersController.instance
  }

  async listUsers(req: Request, res: Response) {
    const page = parseInt(req.query.page as string)
    const limit = parseInt(req.query.limit as string)
    const users = await UsersService.list(page, limit)
    res.status(200).send(users)
  }

  async createUser(req: Request, res: Response) {
    req.body.password = await bcrypt.hash(req.body.password, 10)
    const user = await UsersService.create(req.body)
    res.status(201).send(user)
  }

  async getUserById(req: Request, res: Response) {
    const user = await UsersService.readById(req.params.userId)
    res.status(200).send(user)
  }

  async patch(req: Request, res: Response) {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10)
    }
    const user = await UsersService.patchById({
      id: req.params.userId,
      ...req.body
    })
    res.status(200).send(user)
  }

  async put(req: Request, res: Response) {
    req.body.password = await bcrypt.hash(req.body.password, 10)
    const user = await UsersService.putById({
      id: req.params.userId,
      ...req.body
    })
    res.status(200).send(user)
  }

  async removeUser(req: Request, res: Response) {
    const user = await UsersService.deleteById(req.params.userId)
    res.status(204).send(user)
  }
}

export default UsersController.getInstance()
