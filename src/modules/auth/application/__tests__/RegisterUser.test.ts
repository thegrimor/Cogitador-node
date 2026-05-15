import { RegisterUser } from '../RegisterUser'
import { LoginUser } from '../LoginUser'
import { InMemoryUserRepository } from '@auth/infrastructure/persistence/InMemoryUserRepository'

beforeEach(() => InMemoryUserRepository.reset())

describe('RegisterUser', () => {
  it('registers a new user', async () => {
    const repo = InMemoryUserRepository.getInstance()
    const useCase = new RegisterUser(repo)
    const result = await useCase.execute({ email: 'test@test.com', username: 'testuser', password: 'password123' })
    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value.email).toBe('test@test.com')
      expect(result.value.username).toBe('testuser')
    }
  })

  it('rejects duplicate email', async () => {
    const repo = InMemoryUserRepository.getInstance()
    const useCase = new RegisterUser(repo)
    await useCase.execute({ email: 'test@test.com', username: 'user1', password: 'password123' })
    const result = await useCase.execute({ email: 'test@test.com', username: 'user2', password: 'password456' })
    expect(result.isFail()).toBe(true)
  })
})

describe('LoginUser', () => {
  it('returns token on valid credentials', async () => {
    const repo = InMemoryUserRepository.getInstance()
    await new RegisterUser(repo).execute({ email: 'user@test.com', username: 'user', password: 'secret123' })
    const signToken = (_userId: string, _email: string) => 'mock-token'
    const result = await new LoginUser(repo, signToken).execute({ email: 'user@test.com', password: 'secret123' })
    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value.token).toBe('mock-token')
    }
  })

  it('rejects wrong password', async () => {
    const repo = InMemoryUserRepository.getInstance()
    await new RegisterUser(repo).execute({ email: 'user@test.com', username: 'user', password: 'secret123' })
    const result = await new LoginUser(repo, () => '').execute({ email: 'user@test.com', password: 'wrongpassword' })
    expect(result.isFail()).toBe(true)
  })
})
