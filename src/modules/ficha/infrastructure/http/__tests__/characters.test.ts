import request from 'supertest'
import { createApp } from '../../../../../app'
import { InMemoryUserRepository } from '../../../../auth/infrastructure/persistence/InMemoryUserRepository'
import { InMemoryCharacterRepository } from '../../persistence/InMemoryCharacterRepository'

const app = createApp()

async function getAuthToken(email = 'char@test.com', username = 'charuser', password = 'password123'): Promise<string> {
  await request(app).post('/api/v1/auth/register').send({ email, username, password })
  const res = await request(app).post('/api/v1/auth/login').send({ email, password })
  return res.body.token as string
}

beforeEach(() => {
  InMemoryUserRepository.reset()
  InMemoryCharacterRepository.reset()
})

describe('GET /health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
  })
})

describe('POST /api/v1/ficha/characters', () => {
  it('creates character when authenticated', async () => {
    const token = await getAuthToken()
    const res = await request(app)
      .post('/api/v1/ficha/characters')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Kael', rank: 'Acolyte', career: 'Arbitrator', homeworld: 'Scintilla' })

    expect(res.status).toBe(201)
    expect(res.body.info.name).toBe('Kael')
    expect(res.body.attrs['WS']).toBeDefined()
    expect(res.body.attrs['WS'].base).toBe(0)
  })

  it('returns 401 without token', async () => {
    const res = await request(app)
      .post('/api/v1/ficha/characters')
      .send({ name: 'Kael' })
    expect(res.status).toBe(401)
  })

  it('returns 400 when name missing', async () => {
    const token = await getAuthToken()
    const res = await request(app)
      .post('/api/v1/ficha/characters')
      .set('Authorization', `Bearer ${token}`)
      .send({ rank: 'Acolyte' })
    expect(res.status).toBe(400)
  })
})

describe('GET /api/v1/ficha/characters', () => {
  it('lists only the authenticated user characters', async () => {
    const token1 = await getAuthToken('user1@test.com', 'user1')
    const token2 = await getAuthToken('user2@test.com', 'user2')

    await request(app).post('/api/v1/ficha/characters').set('Authorization', `Bearer ${token1}`).send({ name: 'Char1' })
    await request(app).post('/api/v1/ficha/characters').set('Authorization', `Bearer ${token2}`).send({ name: 'Char2' })

    const res = await request(app).get('/api/v1/ficha/characters').set('Authorization', `Bearer ${token1}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].info.name).toBe('Char1')
  })
})

describe('PATCH /api/v1/ficha/characters/:id/attributes/:key', () => {
  it('updates attribute base value', async () => {
    const token = await getAuthToken()
    const created = await request(app)
      .post('/api/v1/ficha/characters')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Kael' })

    const id = created.body.id
    const res = await request(app)
      .patch(`/api/v1/ficha/characters/${id}/attributes/WS`)
      .set('Authorization', `Bearer ${token}`)
      .send({ base: 35 })

    expect(res.status).toBe(200)
    expect(res.body.attrs['WS'].base).toBe(35)
  })

  it('returns 422 for invalid attribute key', async () => {
    const token = await getAuthToken()
    const created = await request(app)
      .post('/api/v1/ficha/characters')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Kael' })

    const res = await request(app)
      .patch(`/api/v1/ficha/characters/${created.body.id}/attributes/INVALID`)
      .set('Authorization', `Bearer ${token}`)
      .send({ base: 35 })

    expect(res.status).toBe(422)
  })
})

describe('POST + DELETE /api/v1/ficha/characters/:id/xp', () => {
  it('adds XP and increments experience', async () => {
    const token = await getAuthToken()
    const created = await request(app)
      .post('/api/v1/ficha/characters')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Kael' })

    const id = created.body.id
    const res = await request(app)
      .post(`/api/v1/ficha/characters/${id}/xp`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 200, reason: 'Mission completed' })

    expect(res.status).toBe(201)
    expect(res.body.info.experience).toBe(200)
    expect(res.body.xpLog).toHaveLength(1)
  })

  it('removes XP entry and decrements experience', async () => {
    const token = await getAuthToken()
    const created = await request(app)
      .post('/api/v1/ficha/characters')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Kael' })

    const id = created.body.id
    const afterXp = await request(app)
      .post(`/api/v1/ficha/characters/${id}/xp`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 200, reason: 'Mission' })

    const entryId = afterXp.body.xpLog[0].id
    const res = await request(app)
      .delete(`/api/v1/ficha/characters/${id}/xp/${entryId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.info.experience).toBe(0)
  })
})

describe('DELETE /api/v1/ficha/characters/:id', () => {
  it('returns 404 when accessing another user character', async () => {
    const token1 = await getAuthToken('u1@test.com', 'u1')
    const token2 = await getAuthToken('u2@test.com', 'u2')

    const created = await request(app)
      .post('/api/v1/ficha/characters')
      .set('Authorization', `Bearer ${token1}`)
      .send({ name: 'Kael' })

    const res = await request(app)
      .delete(`/api/v1/ficha/characters/${created.body.id}`)
      .set('Authorization', `Bearer ${token2}`)

    expect(res.status).toBe(404)
  })
})
