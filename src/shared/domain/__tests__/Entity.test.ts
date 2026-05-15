import { Entity } from '../Entity'
import { UniqueEntityId } from '../UniqueEntityId'

class TestEntity extends Entity<{ name: string }> {
  static create(name: string, id?: UniqueEntityId) {
    return new TestEntity({ name }, id)
  }
  get name() {
    return this.props.name
  }
}

describe('Entity', () => {
  it('generates id when not provided', () => {
    const e = TestEntity.create('foo')
    expect(e.id.value).toBeTruthy()
  })

  it('uses provided id', () => {
    const id = UniqueEntityId.create('fixed-id')
    const e = TestEntity.create('foo', id)
    expect(e.id.value).toBe('fixed-id')
  })

  it('equals by id regardless of props', () => {
    const id = UniqueEntityId.create('same-id')
    const a = TestEntity.create('foo', id)
    const b = TestEntity.create('bar', id)
    expect(a.equals(b)).toBe(true)
  })

  it('not equal when different ids', () => {
    const a = TestEntity.create('foo')
    const b = TestEntity.create('foo')
    expect(a.equals(b)).toBe(false)
  })
})
