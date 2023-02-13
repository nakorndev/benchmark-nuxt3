const server = require('fastify')()

server.get('/api/ping', () => 'pong')

server.listen({ port: 3002 }, () => console.log('Fastify on 3002'))