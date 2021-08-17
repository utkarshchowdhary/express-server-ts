import debug from 'debug'
import UsersDao from '../dao/users.dao'
import { CRUD } from '../../common/interfaces/crud.interface'
import { CreateUserDto } from '../dto/create.user.dto'
import { PutUserDto } from '../dto/put.user.dto'
import { PatchUserDto } from '../dto/patch.user.dto'

const log: debug.IDebugger = debug('app:users-service')

class UsersService implements CRUD {
  constructor() {
    log('Created new instance of UsersService')
  }

  async list(limit?: number, page?: number) {
    const users = await UsersDao.getUsers()

    if (page) {
      const per_page = limit || 10
      const offset = (page - 1) * per_page

      const paged_users = users.slice(offset).slice(0, per_page)
      const total_pages = Math.ceil(users.length / per_page)

      return {
        page,
        per_page,
        pre_page: page - 1 ? page - 1 : null,
        next_page: total_pages > page ? page + 1 : null,
        total: users.length,
        total_pages,
        data: paged_users
      }
    }

    return users
  }

  async create(resource: CreateUserDto) {
    return await UsersDao.addUser(resource)
  }

  async readById(id: string) {
    return await UsersDao.getUserById(id)
  }

  async getUserByEmail(email: string) {
    return UsersDao.getUserByEmail(email)
  }

  async putById(id: string, resource: PutUserDto) {
    return await UsersDao.putUserById(id, resource)
  }

  async patchById(id: string, resource: PatchUserDto) {
    return await UsersDao.patchUserById(id, resource)
  }

  async deleteById(id: string) {
    return await UsersDao.removeUserById(id)
  }
}

export default new UsersService()
