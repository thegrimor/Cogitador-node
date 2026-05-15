import { z } from 'zod'

export const createCharacterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  rank: z.string().optional(),
  career: z.string().optional(),
  homeworld: z.string().optional(),
})

export const updateCharacterInfoSchema = z.object({
  name: z.string().min(1).optional(),
  rank: z.string().optional(),
  career: z.string().optional(),
  homeworld: z.string().optional(),
  experience: z.coerce.number().min(0).optional(),
  xpSpent: z.coerce.number().min(0).optional(),
})

export const updateAttributeSchema = z.object({
  base: z.number().min(0).optional(),
  advances: z.number().min(0).optional(),
  bonuses: z.number().min(0).optional(),
  bonusNote: z.string().optional(),
})

export const updateVitalSchema = z.object({
  field: z.enum(['current', 'max']),
  value: z.number().min(0),
})

export const addXpEntrySchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  reason: z.string().min(1, 'Reason is required'),
})
