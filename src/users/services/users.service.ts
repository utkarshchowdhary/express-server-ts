import debug from 'debug'
import usersDao from '../dao/users.dao'
import { CRUD } from '../../common/interfaces/crud.interface'
import { UserDto, PatchableUserDto, PutableUserDto } from '../dto/user.dto'

const log = debug('app:users-service')

class UsersService implements CRUD {
  constructor() {
    log('Created new instance of UsersService')
  }

  list(limit?: number, page?: number) {
    return usersDao.getUsers(limit, page)
  }

  create(resource: UserDto) {
    return usersDao.addUser(resource)
  }

  readById(id: string) {
    return usersDao.getUserById(id)
  }

  getUserByEmail(email: string) {
    return usersDao.getUserByEmail(email)
  }

  getUserByEmailWithPassword(email: string) {
    return usersDao.getUserByEmailWithPassword(email)
  }

  patchById(id: string, resource: PatchableUserDto) {
    return usersDao.updateUserById(id, resource)
  }

  putById(id: string, resource: PutableUserDto) {
    return usersDao.updateUserById(id, resource)
  }

  deleteById(id: string) {
    return usersDao.removeUserById(id)
  }
}

export default new UsersService()
