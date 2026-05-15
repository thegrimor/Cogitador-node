import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.test.ts'],
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@ficha/(.*)$': '<rootDir>/src/modules/ficha/$1',
    '^@auth/(.*)$': '<rootDir>/src/modules/auth/$1',
    '^@proyectos/(.*)$': '<rootDir>/src/modules/proyectos/$1',
    '^@sequito/(.*)$': '<rootDir>/src/modules/sequito/$1',
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
}

export default config
