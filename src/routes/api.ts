import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Bindings } from '../types'
import { getActiveMembers } from '../data'

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors({ origin: '*' }))

app.get('/members', async (c) => {
  const members = await getActiveMembers(c.env.WEBRING)
  c.header('Cache-Control', 'public, max-age=300')
  return c.json(members)
})

export default app
