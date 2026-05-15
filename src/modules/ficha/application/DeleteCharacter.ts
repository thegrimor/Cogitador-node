import { ICharacterRepository } from '@ficha/domain/ICharacterRepository'
import { UniqueEntityId } from '@shared/domain/UniqueEntityId'
import { Result, ok, fail } from '@shared/domain/Result'

export interface DeleteCharacterDTO {
  id: string
  ownerId: string
}

export class DeleteCharacter {
  constructor(private readonly repo: ICharacterRepository) {}

  async execute(dto: DeleteCharacterDTO): Promise<Result<void>> {
    const id = UniqueEntityId.create(dto.id)
    const character = await this.repo.findByIdAndOwner(id, dto.ownerId)
    if (!character) return fail('Character not found')
    await this.repo.delete(id)
    return ok(undefined)
  }
}
