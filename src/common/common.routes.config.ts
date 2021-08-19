import { Application } from 'express'

export abstract class CommonRoutesConfig {
  app: Application
  _name: string

  constructor(app: Application, name: string) {
    this.app = app
    this._name = name
    this.configureRoutes()
  }

  abstract configureRoutes(): void

  get name() {
    return this._name
  }
}
