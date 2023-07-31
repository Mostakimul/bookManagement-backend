import { Server } from 'http'
import mongoose from 'mongoose'
import app from './app'
import config from './config'

/**
 * Uncaught exception handling
 */
process.on('uncaughtException', error => {
  console.error(error)
  process.exit(1)
})

let server: Server
/**
 * Boostrap function
 */
async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string)
    console.info('Database connected')

    server = app.listen(config.port, () => {
      console.info(`App listening on port ${config.port}`)
    })
  } catch (error) {
    console.error('Failed to connect', error)
  }

  process.on('unhandledRejection', err => {
    if (server) {
      server.close(() => {
        console.error(err)
        process.exit(1)
      })
    } else {
      process.exit()
    }
  })
}

bootstrap()

/**
 * Sigterm Handler
 */
process.on('SIGTERM', () => {
  console.info('SIGTERM is received')
  if (server) {
    server.close()
  }
})
