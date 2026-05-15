import { ValueObject } from '@shared/domain/ValueObject'
import { Result, ok, fail } from '@shared/domain/Result'

interface VitalStateProps {
  current: number
  max: number
}

export class VitalState extends ValueObject<VitalStateProps> {
  get current() { return this.props.current }
  get max() { return this.props.max }

  private constructor(props: VitalStateProps) {
    super(props)
  }

  static create(props: VitalStateProps): Result<VitalState> {
    if (props.current < 0) return fail('Current value cannot be negative')
    if (props.max < 0) return fail('Max value cannot be negative')
    return ok(new VitalState(props))
  }

  static zero(): VitalState {
    return new VitalState({ current: 0, max: 0 })
  }

  withField(field: 'current' | 'max', value: number): Result<VitalState> {
    return VitalState.create({ ...this.props, [field]: value })
  }
}
