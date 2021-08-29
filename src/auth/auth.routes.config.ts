import { Application } from 'express'
import { body } from 'express-validator'
import { CommonRoutesConfig } from '../common/common.routes.config'
import bodyValidationMiddleware from '../common/middleware/body.validation.middleware'
import authMiddleware from './middleware/auth.middleware'
import authController from './controllers/auth.controller'
import jwtMiddleware from './middleware/jwt.middleware'

export class AuthRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, 'AuthRoutes')
  }

  configureRoutes(): void {
    this.app
      .route('/auth')
      .post(
        body('email').isEmail(),
        body('password').isString(),
        bodyValidationMiddleware.verifyBodyFieldsErrors,
        authMiddleware.verifyUserPassword,
        authController.createJWT
      )

    this.app
      .route('/auth/refresh-token')
      .post(
        jwtMiddleware.validJWTNeeded,
        body('refreshToken').isString(),
        bodyValidationMiddleware.verifyBodyFieldsErrors,
        jwtMiddleware.validRefreshNeeded,
        authController.createJWT
      )
  }
}
