import { Request, Response, NextFunction } from 'express'
import { AppError } from '@shared/infrastructure/http/errorHandler'
import {
  CreateCharacter,
  GetCharacter,
  ListCharacters,
  UpdateCharacterInfo,
  UpdateAttribute,
  UpdateWounds,
  UpdateFate,
  AddXpEntry,
  RemoveXpEntry,
  DeleteCharacter,
} from '@ficha/application/index'
import {
  createCharacterSchema,
  updateCharacterInfoSchema,
  updateAttributeSchema,
  updateVitalSchema,
  addXpEntrySchema,
} from './characterSchemas'

export class CharacterController {
  constructor(
    private readonly createCharacter: CreateCharacter,
    private readonly getCharacter: GetCharacter,
    private readonly listCharacters: ListCharacters,
    private readonly updateCharacterInfo: UpdateCharacterInfo,
    private readonly updateAttribute: UpdateAttribute,
    private readonly updateWounds: UpdateWounds,
    private readonly updateFate: UpdateFate,
    private readonly addXpEntry: AddXpEntry,
    private readonly removeXpEntry: RemoveXpEntry,
    private readonly deleteCharacter: DeleteCharacter
  ) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const result = await this.listCharacters.execute(req.userId!)
    if (result.isFail()) { next(new AppError(500, result.error)); return }
    res.json(result.value)
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = createCharacterSchema.safeParse(req.body)
    if (!parsed.success) { next(new AppError(400, parsed.error.message, 'VALIDATION_ERROR')); return }
    const result = await this.createCharacter.execute({ ...parsed.data, ownerId: req.userId! })
    if (result.isFail()) { next(new AppError(422, result.error, 'DOMAIN_ERROR')); return }
    res.status(201).json(result.value)
  }

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const result = await this.getCharacter.execute({ id: req.params['id']!, ownerId: req.userId! })
    if (result.isFail()) { next(new AppError(404, result.error, 'NOT_FOUND')); return }
    res.json(result.value)
  }

  updateInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = updateCharacterInfoSchema.safeParse(req.body)
    if (!parsed.success) { next(new AppError(400, parsed.error.message, 'VALIDATION_ERROR')); return }
    const result = await this.updateCharacterInfo.execute({ id: req.params['id']!, ownerId: req.userId!, ...parsed.data })
    if (result.isFail()) { next(new AppError(result.error === 'Character not found' ? 404 : 422, result.error)); return }
    res.json(result.value)
  }

  updateAttr = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = updateAttributeSchema.safeParse(req.body)
    if (!parsed.success) { next(new AppError(400, parsed.error.message, 'VALIDATION_ERROR')); return }
    const result = await this.updateAttribute.execute({
      characterId: req.params['id']!,
      ownerId: req.userId!,
      attributeKey: req.params['key']!,
      updates: parsed.data,
    })
    if (result.isFail()) { next(new AppError(result.error.includes('not found') ? 404 : 422, result.error)); return }
    res.json(result.value)
  }

  updateWoundsHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = updateVitalSchema.safeParse(req.body)
    if (!parsed.success) { next(new AppError(400, parsed.error.message, 'VALIDATION_ERROR')); return }
    const result = await this.updateWounds.execute({ characterId: req.params['id']!, ownerId: req.userId!, ...parsed.data })
    if (result.isFail()) { next(new AppError(result.error.includes('not found') ? 404 : 422, result.error)); return }
    res.json(result.value)
  }

  updateFateHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = updateVitalSchema.safeParse(req.body)
    if (!parsed.success) { next(new AppError(400, parsed.error.message, 'VALIDATION_ERROR')); return }
    const result = await this.updateFate.execute({ characterId: req.params['id']!, ownerId: req.userId!, ...parsed.data })
    if (result.isFail()) { next(new AppError(result.error.includes('not found') ? 404 : 422, result.error)); return }
    res.json(result.value)
  }

  addXp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = addXpEntrySchema.safeParse(req.body)
    if (!parsed.success) { next(new AppError(400, parsed.error.message, 'VALIDATION_ERROR')); return }
    const result = await this.addXpEntry.execute({ characterId: req.params['id']!, ownerId: req.userId!, ...parsed.data })
    if (result.isFail()) { next(new AppError(result.error.includes('not found') ? 404 : 422, result.error)); return }
    res.status(201).json(result.value)
  }

  removeXp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const result = await this.removeXpEntry.execute({
      characterId: req.params['id']!,
      ownerId: req.userId!,
      entryId: req.params['entryId']!,
    })
    if (result.isFail()) { next(new AppError(result.error.includes('not found') ? 404 : 422, result.error)); return }
    res.json(result.value)
  }

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const result = await this.deleteCharacter.execute({ id: req.params['id']!, ownerId: req.userId! })
    if (result.isFail()) { next(new AppError(404, result.error, 'NOT_FOUND')); return }
    res.status(204).send()
  }
}
