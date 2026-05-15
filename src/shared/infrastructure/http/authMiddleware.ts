import { Request, Response, NextFunction } from 'express'
import { verifyToken } from './jwtService'
import { AppError } from './errorHandler'

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) {
    next(new AppError(401, 'No authorization token provided', 'UNAUTHORIZED'))
    return
  }

  const token = auth.slice(7)
  const payload = verifyToken(token)

  if (!payload) {
    next(new AppError(401, 'Invalid or expired token', 'UNAUTHORIZED'))
    return
  }

  req.userId = payload.userId
  next()
}
