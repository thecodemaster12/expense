import { describe, expect, it } from 'vitest'
import app from './index.ts'

describe('api', () => {
  it('GET /api/health returns ok', async () => {
    const res = await app.request('/api/health')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
  })

  it('unknown route returns 404', async () => {
    const res = await app.request('/api/nope')
    expect(res.status).toBe(404)
  })
})
