import bcrypt from 'bcrypt'
import { IUserRepository } from '@auth/domain/IUserRepository'
import { User } from '@auth/domain/User'
import { Result, ok, fail } from '@shared/domain/Result'

export interface RegisterUserDTO {
  email: string
  username: string
  password: string
}

export interface UserResponseDTO {
  id: string
  email: string
  username: string
}

export class RegisterUser {
  constructor(private readonly repo: IUserRepository) {}

  async execute(dto: RegisterUserDTO): Promise<Result<UserResponseDTO>> {
    const exists = await this.repo.existsByEmail(dto.email)
    if (exists) return fail('Email already registered')

    const passwordHash = await bcrypt.hash(dto.password, 10)
    const userResult = User.create(dto.email, dto.username, passwordHash)
    if (userResult.isFail()) return fail(userResult.error)

    await this.repo.save(userResult.value)
    return ok({
      id: userResult.value.id.value,
      email: userResult.value.email,
      username: userResult.value.username,
    })
  }
}
