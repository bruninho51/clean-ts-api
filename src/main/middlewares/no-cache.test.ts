import { Request, Response } from 'express'
import request from 'supertest'
import app from '@/main/config/app'

describe('NoCache Middleware', () => {
  test('Should disable cache', async () => {
    app.get('/test_no_cache', (req: Request, res: Response) => {
      res.send()
    })
    await request(app)
      .post('/test_no_cache')
      .expect('cache-control', 'no-store, no-cache, trust-revalidate, proxy-revalidate')
      .expect('pragma', 'no-cache')
      .expect('expires', '0')
      .expect('surrogate-control', 'no-store')
  })
})
