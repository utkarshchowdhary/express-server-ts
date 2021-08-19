import debug from 'debug'
import { nanoid } from 'nanoid'
import { CreateUserDto } from '../dto/create.user.dto'
import { PatchUserDto } from '../dto/patch.user.dto'
import { PutUserDto } from '../dto/put.user.dto'

const log = debug('app:in-memory-dao')

class UsersDao {
  users: Array<CreateUserDto> = []

  constructor() {
    log('Created new instance of UsersDao')
  }

  async addUser(user: CreateUserDto) {
    user.id = nanoid(22)
    this.users.push(user)
    return user
  }

  async getUsers() {
    return this.users
  }

  async getUserById(userId: string) {
    const usr = this.users.find((usr) => usr.id === userId)
    if (usr) {
      return usr
    } else {
      return null
    }
  }

  async getUserByEmail(email: string) {
    const usr = this.users.find((usr) => usr.email === email)
    if (usr) {
      return usr
    } else {
      return null
    }
  }

  async putUserById(userId: string, user: PutUserDto) {
    const usrIndex = this.users.findIndex((usr) => usr.id === userId)
    this.users.splice(usrIndex, 1, user)
    return user
  }

  async patchUserById(userId: string, user: PatchUserDto) {
    const usrIndex = this.users.findIndex((usr) => usr.id === userId)
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

  async removeUserById(userId: string) {
    const usrIndex = this.users.findIndex((usr) => usr.id === userId)
    const usr = this.users[usrIndex]
    this.users.splice(usrIndex, 1)
    return usr
  }
}

export default new UsersDao() // using singleton pattern this will always provide the same instance
