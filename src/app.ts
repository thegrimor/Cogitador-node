import express, { Express } from 'express'
import { authRouter } from '@auth/infrastructure/http/authRouter'
import { characterRouter } from '@ficha/infrastructure/http/characterRouter'
import { errorHandler } from '@shared/infrastructure/http/errorHandler'

function corsMiddleware(
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
}

export function createApp(): Express {
  const app = express()

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(corsMiddleware)

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  app.use('/api/v1/auth', authRouter())
  app.use('/api/v1/ficha/characters', characterRouter())

  app.use('/api/v1/proyectos', (_req, res) => {
    res.json({ status: 'not_implemented' })
  })

  app.use('/api/v1/sequito', (_req, res) => {
    res.json({ status: 'not_implemented' })
  })

  app.use(errorHandler)

  return app
}
