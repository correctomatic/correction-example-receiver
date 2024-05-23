import fastify from 'fastify'
import { promises as fs } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import env from '../../config/env.js'

const uploadDir = env.uploadDir
await fs.mkdir(uploadDir, { recursive: true })

async function fileExists(path) {
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}

function correctionMessage(data) {
  let content

  if (data.sucess) {
    content = `Grade: ${data.grade}\n`
    content += `Comments: ${data.comments.join('\n')}`
  }
  else content = `Failed to correct the work. Reason: ${data.error}`

  return `
********************************************
**  Received a corrected work for review  **
********************************************
Work ID: ${data.work_id}
${content}
--------------------------------------------
  `
}

async function routes(fastify, _options) {

  fastify.post('/log', async (request, reply) => {
    try {
      let data;

      if (typeof request.body === 'string') {
        data = JSON.parse(request.body);
      } else {
        data = request.body;
      }
      const { work_id } = data
      console.log(data)

      const message = correctionMessage(data)

      // Generate the base file name from work_id
      let baseFileName = work_id.replace(/\s+/g, '_') // Replace spaces with underscores
      let fileName = `${baseFileName}.txt`
      let filePath = join(uploadDir, fileName)

      // Check if file already exists and generate a sequential file name
      let fileIndex = 1
      while (await fileExists(filePath)) {
        fileName = `${baseFileName}_${fileIndex}.json`
        filePath = join(uploadDir, fileName)
        fileIndex++
      }

      // Write the request data to the file
      await fs.writeFile(filePath, message)

      fastify.log.warn(message)
      reply.code(201).send({ message: 'File created', fileName })
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({ error: 'An error occurred while processing the request' })
    }
  })

}

export default routes

