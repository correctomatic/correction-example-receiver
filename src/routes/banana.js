import fastify from 'fastify'
import { promises as fs } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// Create a __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Create an uploads directory if it doesn't exist
// const uploadDir = join(__dirname, 'uploads')
const uploadDir = '/tmp/uploads'
await fs.mkdir(uploadDir, { recursive: true })

async function fileExists(path) {
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}

async function routes(fastify, _options) {

  fastify.post('/file', async (request, reply) => {
    try {
      const data = request.body
      const { work_id } = data

      // Generate the base file name from work_id
      let baseFileName = work_id.replace(/\s+/g, '_') // Replace spaces with underscores
      let fileName = `${baseFileName}.json`
      let filePath = join(uploadDir, fileName)

      // Check if file already exists and generate a sequential file name
      let fileIndex = 1
      while (await fileExists(filePath)) {
        fileName = `${baseFileName}_${fileIndex}.json`
        filePath = join(uploadDir, fileName)
        fileIndex++
      }

      // Write the request data to the file
      await fs.writeFile(filePath, JSON.stringify(data, null, 2))

      reply.code(201).send({ message: 'File created', fileName })
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({ error: 'An error occurred while processing the request' })
    }
  })

  fastify.post('/console', async (request, reply) => {
    try {
      const data = request.body
      const { work_id } = data

      const correction = `
        Work ID: ${work_id}
        Data: ${JSON.stringify(data, null, 2)}
      `
      fastify.log.info(correction)

      reply.code(201).send('Logged to console')
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({ error: 'An error occurred while processing the request' })
    }
  })

}

export default routes

