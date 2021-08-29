import { UserDto } from '../dto/user.dto'

export interface UserModel
  extends Omit<UserDto, 'permissionFlags'>,
    Required<Pick<UserDto, 'permissionFlags'>> {}
