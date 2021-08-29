import { Request, Response } from 'express'
import debug from 'debug'
import bcrypt from 'bcryptjs'
import usersService from '../services/users.service'

const log = debug('app:users-controller')

class UsersController {
  constructor() {
    log('Created new instance of UsersController')
  }

  async listUsers(req: Request, res: Response) {
    const users = await usersService.list()
    res.status(200).send(users)
  }

  async createUser(req: Request, res: Response) {
    req.body.password = await bcrypt.hash(req.body.password, 10)
    const user = await usersService.create(req.body)
    res.status(201).send(user)
  }

  async getUserById(req: Request, res: Response) {
    const user = await usersService.readById(req.body.id)
    res.status(200).send(user)
  }

  async patch(req: Request, res: Response) {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10)
    }
    const user = await usersService.patchById(req.body.id, req.body)
    res.status(200).send(user)
  }

  async put(req: Request, res: Response) {
    req.body.password = await bcrypt.hash(req.body.password, 10)
    const user = await usersService.putById(req.body.id, req.body)
    res.status(200).send(user)
  }

  async removeUser(req: Request, res: Response) {
    await usersService.deleteById(req.body.id)
    res.status(204).send()
  }
}

export default new UsersController()
