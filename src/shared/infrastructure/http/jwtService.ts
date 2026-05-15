import jwt from 'jsonwebtoken'

export interface TokenPayload {
  userId: string
  email: string
}

const getSecret = () => process.env.JWT_SECRET ?? 'dev_secret_change_in_production'
const getExpiresIn = () => process.env.JWT_EXPIRES_IN ?? '7d'

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: getExpiresIn() as jwt.SignOptions['expiresIn'] })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, getSecret()) as TokenPayload
  } catch {
    return null
  }
}
