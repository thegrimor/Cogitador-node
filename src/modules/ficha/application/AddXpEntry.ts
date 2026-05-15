import { ICharacterRepository } from '@ficha/domain/ICharacterRepository'
import { UniqueEntityId } from '@shared/domain/UniqueEntityId'
import { Result, ok, fail } from '@shared/domain/Result'
import { toResponseDTO, CharacterResponseDTO } from './CharacterMapper'

export interface AddXpEntryDTO {
  characterId: string
  ownerId: string
  amount: number
  reason: string
}

export class AddXpEntry {
  constructor(private readonly repo: ICharacterRepository) {}

  async execute(dto: AddXpEntryDTO): Promise<Result<CharacterResponseDTO>> {
    const character = await this.repo.findByIdAndOwner(
      UniqueEntityId.create(dto.characterId),
      dto.ownerId
    )
    if (!character) return fail('Character not found')

    const result = character.addXpEntry(dto.amount, dto.reason)
    if (result.isFail()) return fail(result.error)

    await this.repo.save(character)
    return ok(toResponseDTO(character))
  }
}
