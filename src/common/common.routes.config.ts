import express from "express";

export abstract class CommonRoutesConfig {
  constructor(public app: express.Application, public name: string) {
    this.configureRoutes();
  }

  abstract configureRoutes(): express.Application;

  getName() {
    return this.name;
  }
}
