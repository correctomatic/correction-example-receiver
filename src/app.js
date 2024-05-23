import Fastify from 'fastify'
import { join } from 'node:path'
import AutoLoad from '@fastify/autoload'
import env from '../config/env.js'

import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const options = {
  logger: {
    level: env.logLevel
  }
}

const fastify = Fastify(options)

fastify.register(AutoLoad, {
  dir: join(__dirname, 'routes')
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: env.port, host: '0.0.0.0' })
    fastify.log.info(`Server listening on http://0.0.0.0:${env.port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
