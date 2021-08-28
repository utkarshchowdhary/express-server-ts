import { Request, Response } from 'express'
import debug from 'debug'
import bcrypt from 'bcryptjs'
import UsersService from '../services/users.service'

const log = debug('app:users-controller')

class UsersController {
  constructor() {
    log('Created new instance of UsersController')
  }

  async listUsers(req: Request, res: Response) {
    const users = await UsersService.list()
    res.status(200).send(users)
  }

  async createUser(req: Request, res: Response) {
    req.body.password = await bcrypt.hash(req.body.password, 10)
    const user = await UsersService.create(req.body)
    res.status(201).send(user)
  }

  async getUserById(req: Request, res: Response) {
    const user = await UsersService.readById(req.body.id)
    res.status(200).send(user)
  }

  async patch(req: Request, res: Response) {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10)
    }
    const user = await UsersService.patchById(req.body.id, req.body)
    res.status(200).send(user)
  }

  async put(req: Request, res: Response) {
    req.body.password = await bcrypt.hash(req.body.password, 10)
    const user = await UsersService.putById(req.body.id, req.body)
    res.status(200).send(user)
  }

  async removeUser(req: Request, res: Response) {
    await UsersService.deleteById(req.body.id)
    res.status(204).send()
  }
}

export default new UsersController()
