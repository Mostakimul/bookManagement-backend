import express from 'express'
import { ENUM_USER_ROLE } from '../../../enums/users'
import auth from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { UserController } from './user.controller'
import { UserValidation } from './user.validation'

const router = express.Router()

router.patch(
  '/:id',
  validateRequest(UserValidation.updateUserZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  UserController.updateUser
)

router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), UserController.getSingleUser)
router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), UserController.deleteUser)
router.get('/', auth(ENUM_USER_ROLE.ADMIN), UserController.getAllUsers)

export const UserRoutes = router
