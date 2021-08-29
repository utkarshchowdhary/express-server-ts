import { Application } from 'express'
import { body } from 'express-validator'
import { CommonRoutesConfig } from '../common/common.routes.config'
import usersController from './controllers/users.controller'
import usersMiddleware from './middleware/users.middleware'
import bodyValidationMiddleware from '../common/middleware/body.validation.middleware'
import jwtMiddleware from '../auth/middleware/jwt.middleware'
import permissionMiddleware from '../common/middleware/permission.middleware'
import { PermissionFlag } from '../common/enums/permissionflag.enum'

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, 'UsersRoutes')
  }

  configureRoutes(): void {
    this.app
      .route('/users')
      .get(
        jwtMiddleware.validJWTNeeded,
        permissionMiddleware.permissionFlagRequired(
          PermissionFlag.ADMIN_PERMISSION
        ),
        usersController.listUsers
      )
      .post(
        body('email').isEmail(),
        body('password')
          .isString()
          .isLength({ min: 5 })
          .withMessage('Must include password (5+ characters)'),
        bodyValidationMiddleware.verifyBodyFieldsErrors,
        usersMiddleware.validateSameEmailDoesntExist,
        usersController.createUser
      )

    this.app.param('userId', usersMiddleware.extractUserId)

    this.app
      .route('/users/:userId')
      .all(
        usersMiddleware.validateUserExists,
        jwtMiddleware.validJWTNeeded,
        permissionMiddleware.onlySameUserOrAdminCanDoThisAction
      )
      .get(usersController.getUserById)
      .put(
        body('email').isEmail(),
        body('password')
          .isString()
          .isLength({ min: 5 })
          .withMessage('Must include password (5+ characters)'),
        body('firstName').isString(),
        body('lastName').isString(),
        bodyValidationMiddleware.verifyBodyFieldsErrors,
        usersMiddleware.validateSameEmailBelongToSameUser,
        usersMiddleware.userCantChangePermission,
        usersController.put
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
        usersMiddleware.validateSameEmailBelongToSameUser,
        usersMiddleware.userCantChangePermission,
        usersController.patch
      )
      .delete(usersController.removeUser)
  }
}
