import debug from 'debug'
import { nanoid } from 'nanoid'
import { UserDto } from '../dto/users.model'

const log = debug('app:in-memory-dao')

class UsersDao {
  private static instance: UsersDao
  users: UserDto[] = []

  private constructor() {
    log('Created new instance of UsersDao')
  }

  static getInstance(): UsersDao {
    if (!UsersDao.instance) {
      UsersDao.instance = new UsersDao()
    }
    return UsersDao.instance
  }

  async addUser(user: UserDto): Promise<UserDto> {
    user.id = nanoid(22)
    this.users.push(user)
    return user
  }

  async getUsers(): Promise<UserDto[]> {
    return this.users
  }

  async getUserById(userId: string): Promise<UserDto | null> {
    const usr = this.users.find((usr) => usr.id === userId)
    if (usr) {
      return usr
    } else {
      return null
    }
  }

  async getUserByEmail(email: string): Promise<UserDto | null> {
    const usr = this.users.find((usr) => usr.email === email)
    if (usr) {
      return usr
    } else {
      return null
    }
  }

  async putUserById(user: UserDto): Promise<UserDto> {
    const usrIndex = this.users.findIndex((usr) => usr.id === user.id)
    this.users.splice(usrIndex, 1, user)
    return user
  }

  async patchUserById(user: UserDto): Promise<UserDto> {
    const usrIndex = this.users.findIndex((usr) => usr.id === user.id)
    const usr = this.users[usrIndex]
    const allowedPatchFields = [
      'password',
      'firstName',
      'lastName',
      'permissionLevel'
    ]
    for (let field of allowedPatchFields) {
      if (field in user) {
        // @ts-ignore
        usr[field] = user[field]
      }
    }
    this.users.splice(usrIndex, 1, usr)
    return usr
  }

  async removeUserById(userId: string): Promise<UserDto> {
    const usrIndex = this.users.findIndex((usr) => usr.id === userId)
    const usr = this.users[usrIndex]
    this.users.splice(usrIndex, 1)
    return usr
  }
}

export default UsersDao.getInstance()
