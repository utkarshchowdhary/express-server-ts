import mongoose from 'mongoose'
import debug from 'debug'

const log = debug('app:mongoose-service')

const database = process.env.DATABASE!

class MongooseService {
  private count = 0

  constructor() {
    this.connectWithRetry()
  }

  getMongoose() {
    return mongoose
  }

  connectWithRetry = () => {
    log('Attempting MongoDB connection (will retry if needed)')

    mongoose
      .connect(database)
      .then(() => {
        log('MongoDB is connected')
      })
      .catch((err) => {
        const retrySeconds = 5
        log(
          `MongoDB connection unsuccessful (will retry #${++this
            .count} after ${retrySeconds} seconds):`,
          err
        )
        setTimeout(this.connectWithRetry, retrySeconds * 1000)
      })
  }
}

export default new MongooseService()
