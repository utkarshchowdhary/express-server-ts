import express from "express";
import http from "http";
import bodyparser from "body-parser";
import winston from "winston";
import expressWinston from "express-winston";
import debug from "debug";
import cors from "cors";
import { CommonRoutesConfig } from "./common/common.routes.config";
import { UsersRoutes } from "./users/users.routes.config";

const app: express.Application = express();
const server = http.createServer(app);
const port: number = 3000;
const routes: CommonRoutesConfig[] = [];
const debugLog = debug("application");

app.use(bodyparser.json());

app.use(cors());

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
  })
);

routes.push(new UsersRoutes(app));

app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
  })
);

server.listen(port, () => {
  debugLog(`Server running on port:${port}`);
  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });
});
