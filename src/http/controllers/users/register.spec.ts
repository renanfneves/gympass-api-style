import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Register (e2e)', () => {
  // for test e2e with supertest we must wait till app be ready
  beforeAll(async () => {
    await app.ready()
  })

  // for test e2e with supertest we must wait till app be closed
  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })
})
