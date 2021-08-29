export interface UserDto {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface PatchableUserDto extends Partial<UserDto> {}

export interface PutableUserDto extends Required<UserDto> {}
