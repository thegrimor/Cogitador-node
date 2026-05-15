import { ICharacterRepository } from '@ficha/domain/ICharacterRepository'
import { UniqueEntityId } from '@shared/domain/UniqueEntityId'
import { DH_ATTRIBUTE_KEYS, AttributeKey } from '@ficha/domain/Character'
import { AttributeValuesProps } from '@ficha/domain/AttributeValues'
import { Result, ok, fail } from '@shared/domain/Result'
import { toResponseDTO, CharacterResponseDTO } from './CharacterMapper'

export interface UpdateAttributeDTO {
  characterId: string
  ownerId: string
  attributeKey: string
  updates: Partial<AttributeValuesProps>
}

export class UpdateAttribute {
  constructor(private readonly repo: ICharacterRepository) {}

  async execute(dto: UpdateAttributeDTO): Promise<Result<CharacterResponseDTO>> {
    if (!(DH_ATTRIBUTE_KEYS as readonly string[]).includes(dto.attributeKey))
      return fail(`Invalid attribute key: ${dto.attributeKey}`)

    const character = await this.repo.findByIdAndOwner(
      UniqueEntityId.create(dto.characterId),
      dto.ownerId
    )
    if (!character) return fail('Character not found')

    const result = character.updateAttribute(dto.attributeKey as AttributeKey, dto.updates)
    if (result.isFail()) return fail(result.error)

    await this.repo.save(character)
    return ok(toResponseDTO(character))
  }
}
