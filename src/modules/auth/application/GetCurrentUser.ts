import { IUserRepository } from '@auth/domain/IUserRepository'
import { UniqueEntityId } from '@shared/domain/UniqueEntityId'
import { Result, ok, fail } from '@shared/domain/Result'
import { UserResponseDTO } from './RegisterUser'

export class GetCurrentUser {
  constructor(private readonly repo: IUserRepository) {}

  async execute(userId: string): Promise<Result<UserResponseDTO>> {
    const user = await this.repo.findById(UniqueEntityId.create(userId))
    if (!user) return fail('User not found')
    return ok({ id: user.id.value, email: user.email, username: user.username })
  }
}
