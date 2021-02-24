export interface CRUD {
  list: (page?: number, limit?: number) => Promise<any>;
  create: (resource: any) => Promise<any>;
  readById: (resourceId: any) => Promise<any>;
  putById: (resourceId: any) => Promise<any>;
  patchById: (resourceId: any) => Promise<any>;
  deleteById: (resourceId: any) => Promise<any>;
}
