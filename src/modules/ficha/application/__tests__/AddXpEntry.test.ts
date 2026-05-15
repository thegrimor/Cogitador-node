import { CreateCharacter } from '../CreateCharacter'
import { AddXpEntry } from '../AddXpEntry'
import { RemoveXpEntry } from '../RemoveXpEntry'
import { InMemoryCharacterRepository } from '@ficha/infrastructure/persistence/InMemoryCharacterRepository'

beforeEach(() => InMemoryCharacterRepository.reset())

describe('AddXpEntry', () => {
  it('increments experience and adds log entry', async () => {
    const repo = InMemoryCharacterRepository.getInstance()
    const create = new CreateCharacter(repo)
    const addXp = new AddXpEntry(repo)

    const created = await create.execute({ name: 'Kael', ownerId: 'user-1' })
    if (!created.isOk()) throw new Error('setup failed')
    const characterId = created.value.id

    const result = await addXp.execute({ characterId, ownerId: 'user-1', amount: 200, reason: 'Completed mission' })
    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value.info.experience).toBe(200)
      expect(result.value.xpLog).toHaveLength(1)
      expect(result.value.xpLog[0]?.reason).toBe('Completed mission')
    }
  })

  it('removeXpEntry reverses experience', async () => {
    const repo = InMemoryCharacterRepository.getInstance()
    const create = new CreateCharacter(repo)
    const addXp = new AddXpEntry(repo)
    const removeXp = new RemoveXpEntry(repo)

    const created = await create.execute({ name: 'Kael', ownerId: 'user-1' })
    if (!created.isOk()) throw new Error('setup failed')
    const characterId = created.value.id

    await addXp.execute({ characterId, ownerId: 'user-1', amount: 200, reason: 'Mission' })
    const afterAdd = await addXp.execute({ characterId, ownerId: 'user-1', amount: 100, reason: 'Bonus' })
    if (!afterAdd.isOk()) throw new Error('setup failed')

    const entryId = afterAdd.value.xpLog[0]!.id
    const result = await removeXp.execute({ characterId, ownerId: 'user-1', entryId })
    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value.info.experience).toBe(200)
    }
  })
})
