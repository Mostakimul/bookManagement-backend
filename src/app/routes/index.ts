import express from 'express'
import { ModuleRoutesType } from '../../interfaces/common'
import { AuthRoutes } from '../modules/auth/auth.route'
import { BookRoutes } from '../modules/book/book.route'
import { ReviewRoutes } from '../modules/review/review.route'
import { UserRoutes } from '../modules/user/user.route'

const router = express.Router()

const moduleRoutes: ModuleRoutesType[] = [
  { path: '/users', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/books', route: BookRoutes },
  { path: '/reviews', route: ReviewRoutes },
]

moduleRoutes.forEach((route: ModuleRoutesType) => {
  router.use(route.path, route.route)
})

export default router
