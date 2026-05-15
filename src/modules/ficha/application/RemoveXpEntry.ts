import { ICharacterRepository } from '@ficha/domain/ICharacterRepository'
import { UniqueEntityId } from '@shared/domain/UniqueEntityId'
import { Result, ok, fail } from '@shared/domain/Result'
import { toResponseDTO, CharacterResponseDTO } from './CharacterMapper'

export interface RemoveXpEntryDTO {
  characterId: string
  ownerId: string
  entryId: string
}

export class RemoveXpEntry {
  constructor(private readonly repo: ICharacterRepository) {}

  async execute(dto: RemoveXpEntryDTO): Promise<Result<CharacterResponseDTO>> {
    const character = await this.repo.findByIdAndOwner(
      UniqueEntityId.create(dto.characterId),
      dto.ownerId
    )
    if (!character) return fail('Character not found')

    const result = character.removeXpEntry(dto.entryId)
    if (result.isFail()) return fail(result.error)

    await this.repo.save(character)
    return ok(toResponseDTO(character))
  }
}
