import { Request, Response, NextFunction } from 'express'
import { AppError } from '@shared/infrastructure/http/errorHandler'
import { RegisterUser } from '@auth/application/RegisterUser'
import { LoginUser } from '@auth/application/LoginUser'
import { GetCurrentUser } from '@auth/application/GetCurrentUser'
import { registerSchema, loginSchema } from './authSchemas'

export class AuthController {
  constructor(
    private readonly registerUser: RegisterUser,
    private readonly loginUser: LoginUser,
    private readonly getCurrentUser: GetCurrentUser
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = registerSchema.safeParse(req.body)
    if (!parsed.success) {
      next(new AppError(400, parsed.error.message, 'VALIDATION_ERROR'))
      return
    }
    const result = await this.registerUser.execute(parsed.data)
    if (result.isFail()) {
      next(new AppError(409, result.error, 'CONFLICT'))
      return
    }
    res.status(201).json(result.value)
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = loginSchema.safeParse(req.body)
    if (!parsed.success) {
      next(new AppError(400, parsed.error.message, 'VALIDATION_ERROR'))
      return
    }
    const result = await this.loginUser.execute(parsed.data)
    if (result.isFail()) {
      next(new AppError(401, result.error, 'UNAUTHORIZED'))
      return
    }
    res.json(result.value)
  }

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const result = await this.getCurrentUser.execute(req.userId!)
    if (result.isFail()) {
      next(new AppError(404, result.error, 'NOT_FOUND'))
      return
    }
    res.json(result.value)
  }
}
