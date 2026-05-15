import { UniqueEntityId } from '@shared/domain/UniqueEntityId'
import { User } from './User'

export interface IUserRepository {
  findById(id: UniqueEntityId): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  save(user: User): Promise<void>
  existsByEmail(email: string): Promise<boolean>
}
