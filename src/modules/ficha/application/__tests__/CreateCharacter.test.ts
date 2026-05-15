import { CreateCharacter } from '../CreateCharacter'
import { InMemoryCharacterRepository } from '@ficha/infrastructure/persistence/InMemoryCharacterRepository'

beforeEach(() => InMemoryCharacterRepository.reset())

describe('CreateCharacter', () => {
  it('creates a character with default attributes', async () => {
    const repo = InMemoryCharacterRepository.getInstance()
    const useCase = new CreateCharacter(repo)

    const result = await useCase.execute({
      name: 'Kael',
      rank: 'Acolyte',
      ownerId: 'user-1',
    })

    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value.info.name).toBe('Kael')
      expect(result.value.info.experience).toBe(0)
      expect(result.value.attrs['WS']?.base).toBe(0)
      expect(result.value.ownerId).toBe('user-1')
    }
  })

  it('fails when name is empty', async () => {
    const repo = InMemoryCharacterRepository.getInstance()
    const useCase = new CreateCharacter(repo)
    const result = await useCase.execute({ name: '', ownerId: 'user-1' })
    expect(result.isFail()).toBe(true)
  })
})
