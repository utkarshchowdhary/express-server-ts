import debug from 'debug'
import UsersDao from '../dao/users.dao'
import { CRUD } from '../../common/interfaces/crud.interface'
import { UserDto, PatchableUserDto, PutableUserDto } from '../dto/user.dto'

const log = debug('app:users-service')

class UsersService implements CRUD {
  constructor() {
    log('Created new instance of UsersService')
  }

  list(limit?: number, page?: number) {
    return UsersDao.getUsers(limit, page)
  }

  create(resource: UserDto) {
    return UsersDao.addUser(resource)
  }

  readById(id: string) {
    return UsersDao.getUserById(id)
  }

  getUserByEmail(email: string) {
    return UsersDao.getUserByEmail(email)
  }

  patchById(id: string, resource: PatchableUserDto) {
    return UsersDao.updateUserById(id, resource)
  }

  putById(id: string, resource: PutableUserDto) {
    return UsersDao.updateUserById(id, resource)
  }

  deleteById(id: string) {
    return UsersDao.removeUserById(id)
  }
}

export default new UsersService()
