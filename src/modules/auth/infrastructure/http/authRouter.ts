import { Router } from 'express'
import { authMiddleware } from '@shared/infrastructure/http/authMiddleware'
import { signToken } from '@shared/infrastructure/http/jwtService'
import { InMemoryUserRepository } from '../persistence/InMemoryUserRepository'
import { AuthController } from './authController'
import { RegisterUser } from '@auth/application/RegisterUser'
import { LoginUser } from '@auth/application/LoginUser'
import { GetCurrentUser } from '@auth/application/GetCurrentUser'

export function authRouter(): Router {
  const router = Router()
  const repo = InMemoryUserRepository.getInstance()

  const controller = new AuthController(
    new RegisterUser(repo),
    new LoginUser(repo, (userId, email) => signToken({ userId, email })),
    new GetCurrentUser(repo)
  )

  router.post('/register', controller.register)
  router.post('/login', controller.login)
  router.get('/me', authMiddleware, controller.me)

  return router
}
