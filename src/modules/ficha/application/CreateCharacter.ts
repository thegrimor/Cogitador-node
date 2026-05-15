import { ICharacterRepository } from '@ficha/domain/ICharacterRepository'
import { Character } from '@ficha/domain/Character'
import { CharacterInfo } from '@ficha/domain/CharacterInfo'
import { Result, ok, fail } from '@shared/domain/Result'
import { toResponseDTO, CharacterResponseDTO } from './CharacterMapper'

export interface CreateCharacterDTO {
  name: string
  rank?: string
  career?: string
  homeworld?: string
  ownerId: string
}

export class CreateCharacter {
  constructor(private readonly repo: ICharacterRepository) {}

  async execute(dto: CreateCharacterDTO): Promise<Result<CharacterResponseDTO>> {
    const infoResult = CharacterInfo.create({
      name: dto.name,
      rank: dto.rank ?? '',
      career: dto.career ?? '',
      homeworld: dto.homeworld ?? '',
      experience: 0,
      xpSpent: 0,
    })
    if (infoResult.isFail()) return fail(infoResult.error)

    const character = Character.create(infoResult.value, dto.ownerId)
    await this.repo.save(character)
    return ok(toResponseDTO(character))
  }
}
