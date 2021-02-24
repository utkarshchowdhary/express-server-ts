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

  async list(page?: number, limit?: number) {
    const users = await UsersDao.getUsers();

    if (page && page > 0) {
      const per_page = limit || 10;
      const offset = (page - 1) * per_page;

      const paged_users = users.slice(offset).slice(0, per_page);
      const total_pages = Math.ceil(users.length / per_page);

      return {
        page,
        per_page,
        pre_page: page - 1 ? page - 1 : null,
        next_page: total_pages > page ? page + 1 : null,
        total: users.length,
        total_pages,
        data: paged_users,
      };
    }

    return users;
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
