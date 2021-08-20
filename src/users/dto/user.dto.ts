export interface UserDto {
  id: string
  email: string
  password: string
  firstName?: string
  lastName?: string
  permissionLevel?: number
}

export interface PatchableUserDto
  extends Partial<Omit<UserDto, 'id' | 'email'>> {}
