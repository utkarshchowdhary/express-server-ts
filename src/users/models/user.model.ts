import { UserDto } from '../dto/user.dto'

export type UserModel = UserDto & { permissionFlags: number }
