import { ok, fail, Ok, Fail } from '../Result'

describe('Result', () => {
  it('ok() creates Ok with value', () => {
    const r = ok(42)
    expect(r.isOk()).toBe(true)
    expect(r.isFail()).toBe(false)
    expect(r.value).toBe(42)
  })

  it('fail() creates Fail with error', () => {
    const r = fail('bad input')
    expect(r.isOk()).toBe(false)
    expect(r.isFail()).toBe(true)
    expect(r.error).toBe('bad input')
  })

  it('Ok.map() transforms value', () => {
    const r = ok(5).map((n) => n * 2)
    expect(r).toBeInstanceOf(Ok)
    expect(r.value).toBe(10)
  })

  it('Fail.map() preserves error', () => {
    const r = fail<number>('err').map((n) => n * 2)
    expect(r).toBeInstanceOf(Fail)
    expect(r.error).toBe('err')
  })
})
