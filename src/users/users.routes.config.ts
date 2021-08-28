import { Application } from 'express'
import { body } from 'express-validator'
import { CommonRoutesConfig } from '../common/common.routes.config'
import UsersController from './controllers/users.controller'
import UsersMiddleware from './middleware/users.middleware'
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware'

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, 'UsersRoutes')
  }

  configureRoutes(): void {
    this.app
      .route('/users')
      .get(UsersController.listUsers)
      .post(
        body('email').isEmail(),
        body('password')
          .isString()
          .isLength({ min: 5 })
          .withMessage('Must include password (5+ characters)'),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        UsersMiddleware.validateSameEmailDoesntExist,
        UsersController.createUser
      )

    this.app.param('userId', UsersMiddleware.extractUserId)

    this.app
      .route('/users/:userId')
      .all(UsersMiddleware.validateUserExists)
      .get(UsersController.getUserById)
      .put(
        body('email').isEmail(),
        body('password')
          .isString()
          .isLength({ min: 5 })
          .withMessage('Must include password (5+ characters)'),
        body('firstName').isString(),
        body('lastName').isString(),
        body('permissionFlags').isInt(),
        BodyValidationMiddleware.verifyBodyFieldsErrors,
        UsersMiddleware.validateSameEmailBelongToSameUser,
        UsersController.put
      )
      .patch(
        body('email').isEmail().optional(),
        body('password')
          .isString()
          .isLength({ min: 5 })
          .withMessage('Must include password (5+ characters)')
          .optional(),
        body('firstName').isString().optional(),
        body('lastName').isString().optional(),
        body('permissionFlags').isInt().optional(),
        UsersMiddleware.validateSameEmailBelongToSameUser,
        UsersController.patch
      )
      .delete(UsersController.removeUser)
  }
}
