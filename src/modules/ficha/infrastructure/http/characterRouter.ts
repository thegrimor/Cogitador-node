import { Router } from 'express'
import { authMiddleware } from '@shared/infrastructure/http/authMiddleware'
import { InMemoryCharacterRepository } from '../persistence/InMemoryCharacterRepository'
import { CharacterController } from './characterController'
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

export function characterRouter(): Router {
  const router = Router()
  const repo = InMemoryCharacterRepository.getInstance()

  const controller = new CharacterController(
    new CreateCharacter(repo),
    new GetCharacter(repo),
    new ListCharacters(repo),
    new UpdateCharacterInfo(repo),
    new UpdateAttribute(repo),
    new UpdateWounds(repo),
    new UpdateFate(repo),
    new AddXpEntry(repo),
    new RemoveXpEntry(repo),
    new DeleteCharacter(repo)
  )

  router.use(authMiddleware)

  router.get('/', controller.list)
  router.post('/', controller.create)
  router.get('/:id', controller.getById)
  router.delete('/:id', controller.delete)
  router.patch('/:id/info', controller.updateInfo)
  router.patch('/:id/attributes/:key', controller.updateAttr)
  router.patch('/:id/wounds', controller.updateWoundsHandler)
  router.patch('/:id/fate', controller.updateFateHandler)
  router.post('/:id/xp', controller.addXp)
  router.delete('/:id/xp/:entryId', controller.removeXp)

  return router
}
