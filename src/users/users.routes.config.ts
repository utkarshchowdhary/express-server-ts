import { Application } from 'express'
import { CommonRoutesConfig } from '../common/common.routes.config'
import UsersController from './controllers/users.controller'
import UsersMiddleware from './middleware/users.middleware'

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, 'UsersRoutes')
  }

  configureRoutes(): void {
    this.app
      .route('/users')
      .get(UsersController.listUsers)
      .post(
        UsersMiddleware.validateRequiredUserBodyFields,
        UsersMiddleware.validateSameEmailDoesntExist,
        UsersController.createUser
      )

    this.app.param('userId', UsersMiddleware.extractUserId)

    this.app
      .route('/users/:userId')
      .all(UsersMiddleware.validateUserExists)
      .get(UsersController.getUserById)
      .put(
        UsersMiddleware.validateRequiredUserBodyFields,
        UsersMiddleware.validateSameEmailBelongToSameUser,
        UsersController.put
      )
      .patch(
        UsersMiddleware.validateSameEmailBelongToSameUser,
        UsersController.patch
      )
      .delete(UsersController.removeUser)
  }
}
