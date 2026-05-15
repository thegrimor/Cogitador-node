import { ICharacterRepository } from '@ficha/domain/ICharacterRepository'
import { Result, ok } from '@shared/domain/Result'
import { toResponseDTO, CharacterResponseDTO } from './CharacterMapper'

export class ListCharacters {
  constructor(private readonly repo: ICharacterRepository) {}

  async execute(ownerId: string): Promise<Result<CharacterResponseDTO[]>> {
    const characters = await this.repo.findAllByOwner(ownerId)
    return ok(characters.map(toResponseDTO))
  }
}
