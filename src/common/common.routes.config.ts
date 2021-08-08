import express from 'express'

export abstract class CommonRoutesConfig {
  app: express.Application
  _name: string

  constructor(app: express.Application, name: string) {
    this.app = app
    this._name = name
    this.configureRoutes()
  }

  abstract configureRoutes(): void

  get name() {
    return this._name
  }
}
