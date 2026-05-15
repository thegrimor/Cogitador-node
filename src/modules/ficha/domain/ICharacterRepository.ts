import { UniqueEntityId } from '@shared/domain/UniqueEntityId'
import { Character } from './Character'

export interface ICharacterRepository {
  findById(id: UniqueEntityId): Promise<Character | null>
  findByIdAndOwner(id: UniqueEntityId, ownerId: string): Promise<Character | null>
  findAllByOwner(ownerId: string): Promise<Character[]>
  save(character: Character): Promise<void>
  delete(id: UniqueEntityId): Promise<void>
  exists(id: UniqueEntityId): Promise<boolean>
}
