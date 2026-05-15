import { v4 as uuidv4 } from 'uuid'
import { ValueObject } from './ValueObject'

interface Props {
  value: string
}

export class UniqueEntityId extends ValueObject<Props> {
  get value(): string {
    return this.props.value
  }

  private constructor(id?: string) {
    super({ value: id ?? uuidv4() })
  }

  static create(id?: string): UniqueEntityId {
    return new UniqueEntityId(id)
  }

  toString(): string {
    return this.props.value
  }
}
