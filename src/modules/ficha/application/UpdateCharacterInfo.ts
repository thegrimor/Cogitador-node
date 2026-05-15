import { ICharacterRepository } from '@ficha/domain/ICharacterRepository'
import { UniqueEntityId } from '@shared/domain/UniqueEntityId'
import { Result, ok, fail } from '@shared/domain/Result'
import { toResponseDTO, CharacterResponseDTO } from './CharacterMapper'

export interface UpdateCharacterInfoDTO {
  id: string
  ownerId: string
  name?: string
  rank?: string
  career?: string
  homeworld?: string
  experience?: number
  xpSpent?: number
}

export class UpdateCharacterInfo {
  constructor(private readonly repo: ICharacterRepository) {}

  async execute(dto: UpdateCharacterInfoDTO): Promise<Result<CharacterResponseDTO>> {
    const { id, ownerId, ...fields } = dto
    const character = await this.repo.findByIdAndOwner(UniqueEntityId.create(id), ownerId)
    if (!character) return fail('Character not found')

    const result = character.updateInfo(fields)
    if (result.isFail()) return fail(result.error)

    await this.repo.save(character)
    return ok(toResponseDTO(character))
  }
}
