import { Entity } from '@shared/domain/Entity'
import { UniqueEntityId } from '@shared/domain/UniqueEntityId'
import { Result, ok, fail } from '@shared/domain/Result'
import { CharacterInfo, CharacterInfoProps } from './CharacterInfo'
import { AttributeValues, AttributeValuesProps } from './AttributeValues'
import { VitalState } from './VitalState'
import { XpLogEntry } from './XpLogEntry'

export const DH_ATTRIBUTE_KEYS = ['WS', 'BS', 'S', 'T', 'Ag', 'Int', 'Per', 'WP', 'Fel'] as const
export type AttributeKey = (typeof DH_ATTRIBUTE_KEYS)[number]

interface CharacterProps {
  info: CharacterInfo
  attrs: Record<AttributeKey, AttributeValues>
  wounds: VitalState
  fate: VitalState
  xpLog: XpLogEntry[]
  ownerId: string
}

export class Character extends Entity<CharacterProps> {
  get info() { return this.props.info }
  get attrs() { return this.props.attrs }
  get wounds() { return this.props.wounds }
  get fate() { return this.props.fate }
  get xpLog() { return this.props.xpLog }
  get ownerId() { return this.props.ownerId }

  private constructor(props: CharacterProps, id?: UniqueEntityId) {
    super(props, id)
  }

  static create(info: CharacterInfo, ownerId: string, id?: UniqueEntityId): Character {
    const attrs = Object.fromEntries(
      DH_ATTRIBUTE_KEYS.map((k) => [k, AttributeValues.default()])
    ) as Record<AttributeKey, AttributeValues>

    return new Character(
      { info, attrs, wounds: VitalState.zero(), fate: VitalState.zero(), xpLog: [], ownerId },
      id
    )
  }

  updateInfo(fields: Partial<CharacterInfoProps>): Result<void> {
    const result = this.props.info.withUpdate(fields)
    if (result.isFail()) return fail(result.error)
    this.props = { ...this.props, info: result.value }
    return ok(undefined)
  }

  updateAttribute(key: AttributeKey, updates: Partial<AttributeValuesProps>): Result<void> {
    const current = this.props.attrs[key]
    const result = current.withUpdate(updates)
    if (result.isFail()) return fail(result.error)
    this.props = { ...this.props, attrs: { ...this.props.attrs, [key]: result.value } }
    return ok(undefined)
  }

  updateWounds(field: 'current' | 'max', value: number): Result<void> {
    const result = this.props.wounds.withField(field, value)
    if (result.isFail()) return fail(result.error)
    this.props = { ...this.props, wounds: result.value }
    return ok(undefined)
  }

  updateFate(field: 'current' | 'max', value: number): Result<void> {
    const result = this.props.fate.withField(field, value)
    if (result.isFail()) return fail(result.error)
    this.props = { ...this.props, fate: result.value }
    return ok(undefined)
  }

  addXpEntry(amount: number, reason: string): Result<XpLogEntry> {
    const entryResult = XpLogEntry.create(amount, reason)
    if (entryResult.isFail()) return fail(entryResult.error)

    const infoResult = this.props.info.withUpdate({
      experience: this.props.info.experience + amount,
    })
    if (infoResult.isFail()) return fail(infoResult.error)

    this.props = {
      ...this.props,
      info: infoResult.value,
      xpLog: [entryResult.value, ...this.props.xpLog],
    }
    return ok(entryResult.value)
  }

  removeXpEntry(entryId: string): Result<void> {
    const entry = this.props.xpLog.find((e) => e.id === entryId)
    if (!entry) return fail(`XP entry not found: ${entryId}`)

    const infoResult = this.props.info.withUpdate({
      experience: Math.max(0, this.props.info.experience - entry.amount),
    })
    if (infoResult.isFail()) return fail(infoResult.error)

    this.props = {
      ...this.props,
      info: infoResult.value,
      xpLog: this.props.xpLog.filter((e) => e.id !== entryId),
    }
    return ok(undefined)
  }
}
