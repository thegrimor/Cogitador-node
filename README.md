# Cogitador Node

Backend API REST para Dark Heresy Cogitator. Arquitectura hexagonal con DDD.

## Stack

- Node.js 20+ / TypeScript
- Express 5
- Zod (validación HTTP)
- Jest + supertest (tests)
- JWT + bcrypt (auth)

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo con hot-reload |
| `npm run build` | Compilar TypeScript |
| `npm start` | Ejecutar build compilado |
| `npm test` | Ejecutar tests |
| `npm run lint` | Linter |
| `npm run format` | Prettier |

## Arquitectura

```
src/
  modules/
    auth/         — Registro y login (JWT)
    ficha/        — Fichas de personaje (bounded context principal)
    proyectos/    — Proyectos de campaña (scaffold)
    sequito/      — Séquito (scaffold)
  shared/
    domain/       — Primitivos DDD: Entity, ValueObject, Result
    infrastructure/http/  — Middleware: auth, error handler, JWT
  app.ts          — Express factory
  index.ts        — Bootstrap
```

## API

### Auth

```
POST /api/v1/auth/register  { email, username, password }
POST /api/v1/auth/login     { email, password }
GET  /api/v1/auth/me        (requiere Authorization: Bearer <token>)
```

### Ficha (requiere auth)

```
GET    /api/v1/ficha/characters
POST   /api/v1/ficha/characters
GET    /api/v1/ficha/characters/:id
DELETE /api/v1/ficha/characters/:id
PATCH  /api/v1/ficha/characters/:id/info
PATCH  /api/v1/ficha/characters/:id/attributes/:key
PATCH  /api/v1/ficha/characters/:id/wounds
PATCH  /api/v1/ficha/characters/:id/fate
POST   /api/v1/ficha/characters/:id/xp
DELETE /api/v1/ficha/characters/:id/xp/:entryId
```
