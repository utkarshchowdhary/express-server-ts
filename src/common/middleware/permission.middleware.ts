import { Request, Response, NextFunction } from 'express'
import { PermissionFlag } from '../enums/permissionflag.enum'

class PermissionMiddleware {
  permissionFlagRequired(requiredPermissionFlag: PermissionFlag) {
    return (req: Request, res: Response, next: NextFunction) => {
      const userPermissionFlags = res.locals.jwt.permissionFlags
      if (userPermissionFlags & requiredPermissionFlag) {
        next()
      } else {
        res.status(403).send({ errors: ['Not Authorized'] })
      }
    }
  }

  async onlySameUserOrAdminCanDoThisAction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (req.body.id === res.locals.jwt.userId) {
      return next()
    } else {
      const userPermissionFlags = res.locals.jwt.permissionFlags
      if (userPermissionFlags & PermissionFlag.ADMIN_PERMISSION) {
        return next()
      } else {
        return res.status(403).send({ errors: ['Not Authorized'] })
      }
    }
  }
}

export default new PermissionMiddleware()
