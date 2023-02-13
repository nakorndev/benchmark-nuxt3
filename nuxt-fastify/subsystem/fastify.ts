import fastify from 'fastify'

const app = fastify()

app.get('/ping', () => 'pong')

export default defineEventHandler(async (event) => {
  await app.ready()
  app.server.emit('request', event.node.req, event.node.res)
})