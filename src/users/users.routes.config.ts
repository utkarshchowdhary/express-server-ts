import express from "express";
import { CommonRoutesConfig } from "../common/common.routes.config";
import UsersController from "./controllers/users.controller";
import UsersMiddleware from "./middleware/users.middleware";

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "UsersRoutes");
  }

  configureRoutes() {
    this.app
      .route(`/users`)
      .get(UsersController.listUsers)
      .post(
        UsersMiddleware.validateRequiredUserBodyFields,
        UsersMiddleware.validateSameEmailDoesntExist,
        UsersController.createUser
      );

    this.app
      .route(`/users/:userId`)
      .all(UsersMiddleware.validateUserExists)
      .get(UsersController.getUserById)
      .put(
        UsersMiddleware.validateRequiredUserBodyFields,
        UsersMiddleware.validateSameEmailBelongToSameUser,
        UsersController.put
      )
      .patch(UsersMiddleware.validatePatchEmail, UsersController.patch)
      .delete(UsersController.removeUser);

    return this.app;
  }
}
