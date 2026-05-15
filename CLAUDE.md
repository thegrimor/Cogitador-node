# CLAUDE.md — Cogitador Node

Reglas y convenciones para el agente en este proyecto.

---

## Contexto del proyecto

Backend API REST para **Dark Heresy Cogitator** (Warhammer 40K tabletop RPG). Arquitectura hexagonal con DDD.
Repositorio hermano: `thegrimor/cogitador-react`.

---

## Stack

- Node.js 20+ / TypeScript strict
- Express 5
- Zod (validación en capa HTTP)
- Jest + supertest (tests)
- tsx (dev server: `npm run dev`)
- JWT (`jsonwebtoken`) + bcrypt (auth)

---

## Arquitectura — Hexagonal por bounded context

Cada módulo sigue estrictamente:

```
modules/[bounded-context]/
  domain/          — Entidades, VOs, puerto del repositorio. SIN dependencias externas.
  application/     — Casos de uso. Solo depende de domain/. Un archivo por caso de uso.
  infrastructure/  — Adaptadores HTTP + persistencia. Depende de application/ y domain/.
```

**Regla estricta de dependencias:**
- `domain/` solo importa de `@shared/domain/`
- `application/` importa de `domain/` y `@shared/domain/` únicamente
- Solo `infrastructure/` puede importar Express, Zod, uuid, bcrypt, etc.

---

## Shared Kernel

`src/shared/domain/` contiene las abstracciones base:
- `Entity<T>` — aggregate roots con identidad
- `ValueObject<T>` — inmutable, igualdad por valor
- `UniqueEntityId` — wrapper UUID
- `Result<T, E>` — manejo de errores sin excepciones en dominio (`ok` / `fail`)

`src/shared/infrastructure/http/`:
- `jwtService.ts` — `signToken` / `verifyToken`
- `authMiddleware.ts` — valida JWT, adjunta `req.userId`
- `errorHandler.ts` — `AppError` + middleware global de errores

---

## Convenciones de código

- **Use cases**: clase con método `execute()`. Un archivo por caso de uso.
- **No excepciones en dominio**: usar `Result<T, E>` siempre.
- **Los controladores** solo orquestan: validar con Zod → llamar use case → mapear Result a HTTP.
- **Los repositorios** son interfaces (puertos). Las implementaciones van en `infrastructure/persistence/`.
- **Path aliases**: `@shared/`, `@ficha/`, `@auth/`, `@proyectos/`, `@sequito/`

---

## Bounded Contexts

| Módulo | Estado | Descripción |
|--------|--------|-------------|
| `auth` | Implementado | Registro, login JWT, perfil |
| `ficha` | Implementado | Fichas de personaje Dark Heresy |
| `proyectos` | Scaffold | Proyectos de campaña (placeholder) |
| `sequito` | Scaffold | Séquito / acólitos (placeholder) |

---

## API Endpoints

```
GET  /health

POST /api/v1/auth/register   { email, username, password }
POST /api/v1/auth/login      { email, password }
GET  /api/v1/auth/me         (requiere auth)

GET    /api/v1/ficha/characters              (auth)
POST   /api/v1/ficha/characters              (auth) { name, rank?, career?, homeworld? }
GET    /api/v1/ficha/characters/:id          (auth)
DELETE /api/v1/ficha/characters/:id          (auth)
PATCH  /api/v1/ficha/characters/:id/info     (auth)
PATCH  /api/v1/ficha/characters/:id/attributes/:key  (auth)
PATCH  /api/v1/ficha/characters/:id/wounds   (auth)
PATCH  /api/v1/ficha/characters/:id/fate     (auth)
POST   /api/v1/ficha/characters/:id/xp       (auth)
DELETE /api/v1/ficha/characters/:id/xp/:entryId  (auth)
```

---

## Git — Conventional Commits

```
feat: descripción
fix: descripción
chore: descripción
refactor: descripción
test: descripción
docs: descripción
```

---

## Tests

- Un archivo de test por caso de uso en `application/__tests__/`
- Tests de integración HTTP en `infrastructure/http/__tests__/` usando supertest
- `InMemoryCharacterRepository.reset()` / `InMemoryUserRepository.reset()` en `beforeEach`
- No mockear el repositorio en tests de use cases — usar el InMemory directamente

---

## Comportamiento del agente

### Cambio de bounded context
Antes de modificar un módulo diferente al que se está trabajando, pausar y consultar al usuario.

### Errores de TypeScript o build
Notificar el error antes de actuar. No corregir de forma autónoma.

### Git — esperar confirmación
El agente nunca hace `git add`, `git commit`, `git push` sin que el usuario lo pida explícitamente.
