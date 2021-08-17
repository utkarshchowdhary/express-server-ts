import 'source-map-support/register'
import express from 'express'
import winston from 'winston'
import expressWinston from 'express-winston'
import debug from 'debug'
import cors from 'cors'
import { CommonRoutesConfig } from './common/common.routes.config'
import { UsersRoutes } from './users/users.routes.config'

const app: express.Application = express()

const port = 3000

const routes: Array<CommonRoutesConfig> = []

const log: debug.IDebugger = debug('app')

app.use(express.json())

app.use(cors())

const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  )
}

if (!process.env.DEBUG) {
  loggerOptions.meta = false // when not debugging, ignore metadata
}

// log all HTTP requests
app.use(expressWinston.logger(loggerOptions))

routes.push(new UsersRoutes(app))

app.listen(port, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    log(`Routes configured for ${route.name}`)
  })
  console.log(`Server running at http://localhost:${port}`)
})
