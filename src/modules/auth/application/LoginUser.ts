import bcrypt from 'bcrypt'
import { IUserRepository } from '@auth/domain/IUserRepository'
import { Result, ok, fail } from '@shared/domain/Result'
import { UserResponseDTO } from './RegisterUser'

export interface LoginUserDTO {
  email: string
  password: string
}

export interface LoginResponseDTO {
  token: string
  user: UserResponseDTO
}

export class LoginUser {
  constructor(
    private readonly repo: IUserRepository,
    private readonly signToken: (userId: string, email: string) => string
  ) {}

  async execute(dto: LoginUserDTO): Promise<Result<LoginResponseDTO>> {
    const user = await this.repo.findByEmail(dto.email)
    if (!user) return fail('Invalid email or password')

    const valid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!valid) return fail('Invalid email or password')

    const token = this.signToken(user.id.value, user.email)
    return ok({
      token,
      user: { id: user.id.value, email: user.email, username: user.username },
    })
  }
}
