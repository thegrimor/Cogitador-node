import { ICharacterRepository } from '@ficha/domain/ICharacterRepository'
import { Character } from '@ficha/domain/Character'
import { UniqueEntityId } from '@shared/domain/UniqueEntityId'

export class InMemoryCharacterRepository implements ICharacterRepository {
  private static instance: InMemoryCharacterRepository
  private store = new Map<string, Character>()

  static getInstance(): InMemoryCharacterRepository {
    if (!InMemoryCharacterRepository.instance) {
      InMemoryCharacterRepository.instance = new InMemoryCharacterRepository()
    }
    return InMemoryCharacterRepository.instance
  }

  static reset(): void {
    InMemoryCharacterRepository.instance = new InMemoryCharacterRepository()
  }

  async findById(id: UniqueEntityId): Promise<Character | null> {
    return this.store.get(id.value) ?? null
  }

  async findByIdAndOwner(id: UniqueEntityId, ownerId: string): Promise<Character | null> {
    const character = this.store.get(id.value)
    if (!character || character.ownerId !== ownerId) return null
    return character
  }

  async findAllByOwner(ownerId: string): Promise<Character[]> {
    return Array.from(this.store.values()).filter((c) => c.ownerId === ownerId)
  }

  async save(character: Character): Promise<void> {
    this.store.set(character.id.value, character)
  }

  async delete(id: UniqueEntityId): Promise<void> {
    this.store.delete(id.value)
  }

  async exists(id: UniqueEntityId): Promise<boolean> {
    return this.store.has(id.value)
  }
}
