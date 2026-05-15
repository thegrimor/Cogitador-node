import { IUserRepository } from '@auth/domain/IUserRepository'
import { User } from '@auth/domain/User'
import { UniqueEntityId } from '@shared/domain/UniqueEntityId'

export class InMemoryUserRepository implements IUserRepository {
  private static instance: InMemoryUserRepository
  private store = new Map<string, User>()
  private emailIndex = new Map<string, string>()

  static getInstance(): InMemoryUserRepository {
    if (!InMemoryUserRepository.instance) {
      InMemoryUserRepository.instance = new InMemoryUserRepository()
    }
    return InMemoryUserRepository.instance
  }

  static reset(): void {
    InMemoryUserRepository.instance = new InMemoryUserRepository()
  }

  async findById(id: UniqueEntityId): Promise<User | null> {
    return this.store.get(id.value) ?? null
  }

  async findByEmail(email: string): Promise<User | null> {
    const id = this.emailIndex.get(email.toLowerCase())
    if (!id) return null
    return this.store.get(id) ?? null
  }

  async save(user: User): Promise<void> {
    this.store.set(user.id.value, user)
    this.emailIndex.set(user.email, user.id.value)
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.emailIndex.has(email.toLowerCase())
  }
}
