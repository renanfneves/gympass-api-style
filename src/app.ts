import fastify from 'fastify'

export const app = fastify()

app.get('/ping', (request, reply) => {
  reply.send({ pong: '🏓' })
})
