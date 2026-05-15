import { UniqueEntityId } from './UniqueEntityId'

export abstract class Entity<T> {
  protected readonly _id: UniqueEntityId
  protected props: T

  protected constructor(props: T, id?: UniqueEntityId) {
    this._id = id ?? UniqueEntityId.create()
    this.props = props
  }

  get id(): UniqueEntityId {
    return this._id
  }

  equals(entity?: Entity<T>): boolean {
    if (entity === undefined || entity === null) return false
    if (this === entity) return true
    return this._id.equals(entity._id)
  }
}
