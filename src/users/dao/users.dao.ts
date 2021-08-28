import debug from 'debug'
import MongooseService from '../../common/services/mongoose.service'
import { UserDto, PatchableUserDto, PutableUserDto } from '../dto/user.dto'

const log = debug('app:in-memory-dao')

class UsersDao {
  Schema = MongooseService.getMongoose().Schema

  userSchema = new this.Schema(
    {
      email: String,
      password: { type: String, select: false },
      firstName: String,
      lastName: String,
      permissionFlags: Number
    },
    { id: false }
  )

  User = MongooseService.getMongoose().model('Users', this.userSchema)

  constructor() {
    log('Created new instance of UsersDao')
  }

  async addUser(userFields: UserDto) {
    const user = new this.User({
      ...userFields,
      permissionFlags: 1 // override permissionFlags with the value 1
    })
    await user.save()
    return user
  }

  async getUsers(limit = 25, page = 1) {
    const offset = (page - 1) * limit

    return this.User.find().skip(offset).limit(limit).exec()
  }

  async getUserById(userId: string) {
    return this.User.findOne({ _id: userId }).exec()
  }

  async getUserByEmail(email: string) {
    return this.User.findOne({ email: email }).exec()
  }

  async updateUserById(
    userId: string,
    userFields: PatchableUserDto | PutableUserDto
  ) {
    const existingUser = await this.User.findOneAndUpdate(
      { _id: userId },
      { $set: userFields },
      { new: true }
    ).exec()

    return existingUser
  }

  async removeUserById(userId: string) {
    return this.User.deleteOne({ _id: userId }).exec()
  }
}

export default new UsersDao() // using singleton pattern this will always provide the same instance
