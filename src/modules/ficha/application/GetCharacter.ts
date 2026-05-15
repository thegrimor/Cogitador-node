import { ICharacterRepository } from '@ficha/domain/ICharacterRepository'
import { UniqueEntityId } from '@shared/domain/UniqueEntityId'
import { Result, ok, fail } from '@shared/domain/Result'
import { toResponseDTO, CharacterResponseDTO } from './CharacterMapper'

export interface GetCharacterDTO {
  id: string
  ownerId: string
}

export class GetCharacter {
  constructor(private readonly repo: ICharacterRepository) {}

  async execute(dto: GetCharacterDTO): Promise<Result<CharacterResponseDTO>> {
    const character = await this.repo.findByIdAndOwner(
      UniqueEntityId.create(dto.id),
      dto.ownerId
    )
    if (!character) return fail('Character not found')
    return ok(toResponseDTO(character))
  }
}
