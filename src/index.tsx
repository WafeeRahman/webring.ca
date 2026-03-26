import { Hono } from 'hono'
import type { Bindings } from './types'
import Layout from './templates/Layout'
import landing from './routes/landing'
import directory from './routes/directory'
import redirect from './routes/redirect'
import embed from './routes/embed'
import api from './routes/api'
import { runHealthCheck } from './cron/healthcheck'
import { runShuffle } from './cron/shuffle'

const app = new Hono<{ Bindings: Bindings }>()

app.route('/', landing)
app.route('/', directory)
app.route('/', redirect)
app.route('/', embed)
app.route('/api', api)

app.notFound((c) => {
  return c.html(
    <Layout title="Not Found">
      <h1>404</h1>
      <p>Page not found. <a href="/">Go home</a></p>
    </Layout>,
    404
  )
})

app.onError((_err, c) => {
  return c.html(
    <Layout title="Error">
      <h1>Something went wrong</h1>
      <p>Please try again later. <a href="/">Go home</a></p>
    </Layout>,
    500
  )
})

export default {
  fetch: app.fetch,
  scheduled: async (event: ScheduledEvent, env: { WEBRING: KVNamespace }, ctx: ExecutionContext) => {
    switch (event.cron) {
      case '0 0 * * *':
        ctx.waitUntil(runHealthCheck(env.WEBRING))
        break
      case '0 0 * * 0':
        ctx.waitUntil(runShuffle(env.WEBRING))
        break
    }
  },
}
