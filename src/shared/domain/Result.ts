export class Ok<T, E> {
  readonly ok = true as const
  constructor(readonly value: T) {}

  isOk(): this is Ok<T, E> {
    return true
  }
  isFail(): this is Fail<T, E> {
    return false
  }
  map<U>(fn: (val: T) => U): Ok<U, E> {
    return new Ok(fn(this.value))
  }
}

export class Fail<T, E> {
  readonly ok = false as const
  constructor(readonly error: E) {}

  isOk(): this is Ok<T, E> {
    return false
  }
  isFail(): this is Fail<T, E> {
    return true
  }
  map<U>(_fn: (val: T) => U): Fail<U, E> {
    return new Fail<U, E>(this.error)
  }
}

export type Result<T, E = string> = Ok<T, E> | Fail<T, E>

export const ok = <T, E = string>(value: T): Ok<T, E> => new Ok(value)
export const fail = <T, E = string>(error: E): Fail<T, E> => new Fail(error)
