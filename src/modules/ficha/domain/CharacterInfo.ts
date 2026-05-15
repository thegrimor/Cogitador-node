import { ValueObject } from '@shared/domain/ValueObject'
import { Result, ok, fail } from '@shared/domain/Result'

export interface CharacterInfoProps {
  name: string
  rank: string
  career: string
  homeworld: string
  experience: number
  xpSpent: number
}

export class CharacterInfo extends ValueObject<CharacterInfoProps> {
  get name() { return this.props.name }
  get rank() { return this.props.rank }
  get career() { return this.props.career }
  get homeworld() { return this.props.homeworld }
  get experience() { return this.props.experience }
  get xpSpent() { return this.props.xpSpent }

  private constructor(props: CharacterInfoProps) {
    super(props)
  }

  static create(props: CharacterInfoProps): Result<CharacterInfo> {
    if (!props.name.trim()) return fail('Character name cannot be empty')
    if (props.experience < 0) return fail('Experience cannot be negative')
    if (props.xpSpent < 0) return fail('XP spent cannot be negative')
    return ok(new CharacterInfo(props))
  }

  withUpdate(fields: Partial<CharacterInfoProps>): Result<CharacterInfo> {
    return CharacterInfo.create({
      name: fields.name ?? this.props.name,
      rank: fields.rank ?? this.props.rank,
      career: fields.career ?? this.props.career,
      homeworld: fields.homeworld ?? this.props.homeworld,
      experience: fields.experience ?? this.props.experience,
      xpSpent: fields.xpSpent ?? this.props.xpSpent,
    })
  }
}
