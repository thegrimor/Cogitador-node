import { Entity } from '@shared/domain/Entity'
import { UniqueEntityId } from '@shared/domain/UniqueEntityId'
import { Result, ok, fail } from '@shared/domain/Result'

interface UserProps {
  email: string
  username: string
  passwordHash: string
}

export class User extends Entity<UserProps> {
  get email() { return this.props.email }
  get username() { return this.props.username }
  get passwordHash() { return this.props.passwordHash }

  private constructor(props: UserProps, id?: UniqueEntityId) {
    super(props, id)
  }

  static create(email: string, username: string, passwordHash: string, id?: UniqueEntityId): Result<User> {
    if (!email.trim() || !email.includes('@')) return fail('Invalid email address')
    if (!username.trim()) return fail('Username cannot be empty')
    if (!passwordHash) return fail('Password hash is required')
    return ok(new User({ email: email.toLowerCase().trim(), username: username.trim(), passwordHash }, id))
  }

  static restore(props: UserProps, id: string): User {
    return new User(props, UniqueEntityId.create(id))
  }
}
