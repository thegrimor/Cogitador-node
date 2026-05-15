import { Character } from '@ficha/domain/Character'

export interface XpLogEntryDTO {
  id: string
  amount: number
  reason: string
  date: string
}

export interface CharacterResponseDTO {
  id: string
  ownerId: string
  info: {
    name: string
    rank: string
    career: string
    homeworld: string
    experience: number
    xpSpent: number
  }
  attrs: Record<string, { base: number; advances: number; bonuses: number; bonusNote: string; total: number }>
  wounds: { current: number; max: number }
  fate: { current: number; max: number }
  xpLog: XpLogEntryDTO[]
}

export function toResponseDTO(character: Character): CharacterResponseDTO {
  const attrs: CharacterResponseDTO['attrs'] = {}
  for (const [key, av] of Object.entries(character.attrs)) {
    attrs[key] = {
      base: av.base,
      advances: av.advances,
      bonuses: av.bonuses,
      bonusNote: av.bonusNote,
      total: av.total,
    }
  }

  return {
    id: character.id.value,
    ownerId: character.ownerId,
    info: {
      name: character.info.name,
      rank: character.info.rank,
      career: character.info.career,
      homeworld: character.info.homeworld,
      experience: character.info.experience,
      xpSpent: character.info.xpSpent,
    },
    attrs,
    wounds: { current: character.wounds.current, max: character.wounds.max },
    fate: { current: character.fate.current, max: character.fate.max },
    xpLog: character.xpLog.map((e) => ({
      id: e.id,
      amount: e.amount,
      reason: e.reason,
      date: e.date,
    })),
  }
}
