import { ValueObject } from '@shared/domain/ValueObject'
import { Result, ok, fail } from '@shared/domain/Result'

export interface AttributeValuesProps {
  base: number
  advances: number
  bonuses: number
  bonusNote: string
}

export class AttributeValues extends ValueObject<AttributeValuesProps> {
  get base() { return this.props.base }
  get advances() { return this.props.advances }
  get bonuses() { return this.props.bonuses }
  get bonusNote() { return this.props.bonusNote }
  get total() { return this.props.base + this.props.advances + this.props.bonuses }

  private constructor(props: AttributeValuesProps) {
    super(props)
  }

  static create(props: AttributeValuesProps): Result<AttributeValues> {
    if (props.base < 0 || props.advances < 0 || props.bonuses < 0)
      return fail('Attribute values cannot be negative')
    return ok(new AttributeValues(props))
  }

  static default(): AttributeValues {
    return new AttributeValues({ base: 0, advances: 0, bonuses: 0, bonusNote: '' })
  }

  withUpdate(fields: Partial<AttributeValuesProps>): Result<AttributeValues> {
    return AttributeValues.create({
      base: fields.base ?? this.props.base,
      advances: fields.advances ?? this.props.advances,
      bonuses: fields.bonuses ?? this.props.bonuses,
      bonusNote: fields.bonusNote ?? this.props.bonusNote,
    })
  }
}
