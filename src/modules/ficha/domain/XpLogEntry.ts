import { ValueObject } from '@shared/domain/ValueObject'
import { UniqueEntityId } from '@shared/domain/UniqueEntityId'
import { Result, ok, fail } from '@shared/domain/Result'

interface XpLogEntryProps {
  id: string
  amount: number
  reason: string
  date: string
}

export class XpLogEntry extends ValueObject<XpLogEntryProps> {
  get id() { return this.props.id }
  get amount() { return this.props.amount }
  get reason() { return this.props.reason }
  get date() { return this.props.date }

  private constructor(props: XpLogEntryProps) {
    super(props)
  }

  static create(amount: number, reason: string): Result<XpLogEntry> {
    if (amount <= 0) return fail('XP amount must be positive')
    if (!reason.trim()) return fail('XP reason cannot be empty')
    return ok(
      new XpLogEntry({
        id: UniqueEntityId.create().value,
        amount,
        reason: reason.trim(),
        date: new Date().toISOString(),
      })
    )
  }

  static restore(props: XpLogEntryProps): XpLogEntry {
    return new XpLogEntry(props)
  }
}
