import debug from "debug";
import UsersDao from "../daos/users.dao";
import { CRUD } from "../../common/interfaces/crud.interface";
import { UserDto } from "../dto/users.model";

const log = debug("application:users-service");

class UsersService implements CRUD {
  private static instance: UsersService;

  private constructor() {
    log("Created new instance of UsersService");
  }

  static getInstance(): UsersService {
    if (!UsersService.instance) {
      UsersService.instance = new UsersService();
    }
    return UsersService.instance;
  }

  async list(limit?: number, page?: number) {
    return await UsersDao.getUsers();
  }

  async create(resource: UserDto) {
    return await UsersDao.addUser(resource);
  }

  async readById(resourceId: string) {
    return await UsersDao.getUserById(resourceId);
  }

  async getUserByEmail(email: string) {
    return UsersDao.getUserByEmail(email);
  }

  async putById(resource: UserDto) {
    return await UsersDao.putUserById(resource);
  }

  async patchById(resource: UserDto) {
    return await UsersDao.patchUserById(resource);
  }

  async deleteById(resourceId: string) {
    return await UsersDao.removeUserById(resourceId);
  }
}

export default UsersService.getInstance();
