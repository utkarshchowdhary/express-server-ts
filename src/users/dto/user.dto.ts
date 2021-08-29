export interface UserDto {
  email: string
  password: string
  firstName?: string
  lastName?: string
  permissionFlags?: number
}

export interface PatchableUserDto extends Partial<UserDto> {}

export interface PutableUserDto extends Required<UserDto> {}
