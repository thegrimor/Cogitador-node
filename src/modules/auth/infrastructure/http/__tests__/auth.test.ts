import request from 'supertest'
import { createApp } from '../../../../../app'
import { InMemoryUserRepository } from '../../persistence/InMemoryUserRepository'

const app = createApp()

beforeEach(() => {
  InMemoryUserRepository.reset()
})

describe('POST /api/v1/auth/register', () => {
  it('registers a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'user@test.com', username: 'testuser', password: 'password123' })

    expect(res.status).toBe(201)
    expect(res.body.email).toBe('user@test.com')
    expect(res.body.username).toBe('testuser')
    expect(res.body.id).toBeDefined()
  })

  it('rejects duplicate email with 409', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'user@test.com', username: 'user1', password: 'password123' })

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'user@test.com', username: 'user2', password: 'password456' })

    expect(res.status).toBe(409)
  })

  it('rejects invalid email with 400', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'not-an-email', username: 'user', password: 'password123' })
    expect(res.status).toBe(400)
  })
})

describe('POST /api/v1/auth/login', () => {
  beforeEach(async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'login@test.com', username: 'loginuser', password: 'secret123' })
  })

  it('returns JWT token on valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'login@test.com', password: 'secret123' })

    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
    expect(res.body.user.email).toBe('login@test.com')
  })

  it('rejects wrong password with 401', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'login@test.com', password: 'wrongpassword' })
    expect(res.status).toBe(401)
  })
})

describe('GET /api/v1/auth/me', () => {
  it('returns user profile with valid token', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'me@test.com', username: 'meuser', password: 'password123' })

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'me@test.com', password: 'password123' })

    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${loginRes.body.token}`)

    expect(res.status).toBe(200)
    expect(res.body.email).toBe('me@test.com')
  })

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/v1/auth/me')
    expect(res.status).toBe(401)
  })
})
