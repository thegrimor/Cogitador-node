import { ICharacterRepository } from '@ficha/domain/ICharacterRepository'
import { UniqueEntityId } from '@shared/domain/UniqueEntityId'
import { Result, ok, fail } from '@shared/domain/Result'
import { toResponseDTO, CharacterResponseDTO } from './CharacterMapper'

export interface UpdateFateDTO {
  characterId: string
  ownerId: string
  field: 'current' | 'max'
  value: number
}

export class UpdateFate {
  constructor(private readonly repo: ICharacterRepository) {}

  async execute(dto: UpdateFateDTO): Promise<Result<CharacterResponseDTO>> {
    const character = await this.repo.findByIdAndOwner(
      UniqueEntityId.create(dto.characterId),
      dto.ownerId
    )
    if (!character) return fail('Character not found')

    const result = character.updateFate(dto.field, dto.value)
    if (result.isFail()) return fail(result.error)

    await this.repo.save(character)
    return ok(toResponseDTO(character))
  }
}
