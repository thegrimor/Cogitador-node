import { Character } from '../Character'
import { CharacterInfo } from '../CharacterInfo'

const makeInfo = (name = 'Kael') =>
  (CharacterInfo.create({ name, rank: 'Interrogator', career: 'Arbitrator', homeworld: 'Scintilla', experience: 0, xpSpent: 0 }) as any).value as CharacterInfo

describe('Character aggregate', () => {
  it('creates with default attributes', () => {
    const c = Character.create(makeInfo(), 'user-1')
    expect(c.attrs.WS.base).toBe(0)
    expect(c.attrs.Fel.total).toBe(0)
  })

  it('updateInfo changes name', () => {
    const c = Character.create(makeInfo(), 'user-1')
    const r = c.updateInfo({ name: 'Maximus' })
    expect(r.isOk()).toBe(true)
    expect(c.info.name).toBe('Maximus')
  })

  it('updateInfo rejects empty name', () => {
    const c = Character.create(makeInfo(), 'user-1')
    const r = c.updateInfo({ name: '' })
    expect(r.isFail()).toBe(true)
  })

  it('addXpEntry increments experience', () => {
    const c = Character.create(makeInfo(), 'user-1')
    const r = c.addXpEntry(100, 'Mission complete')
    expect(r.isOk()).toBe(true)
    expect(c.info.experience).toBe(100)
    expect(c.xpLog).toHaveLength(1)
  })

  it('removeXpEntry decrements experience', () => {
    const c = Character.create(makeInfo(), 'user-1')
    c.addXpEntry(100, 'Mission complete')
    const entryId = c.xpLog[0]!.id
    const r = c.removeXpEntry(entryId)
    expect(r.isOk()).toBe(true)
    expect(c.info.experience).toBe(0)
    expect(c.xpLog).toHaveLength(0)
  })

  it('updateAttribute modifies base', () => {
    const c = Character.create(makeInfo(), 'user-1')
    const r = c.updateAttribute('WS', { base: 35 })
    expect(r.isOk()).toBe(true)
    expect(c.attrs.WS.base).toBe(35)
  })

  it('updateWounds sets current', () => {
    const c = Character.create(makeInfo(), 'user-1')
    c.updateWounds('max', 12)
    c.updateWounds('current', 8)
    expect(c.wounds.current).toBe(8)
    expect(c.wounds.max).toBe(12)
  })
})
