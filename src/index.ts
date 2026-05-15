import { createApp } from './app'

const PORT = parseInt(process.env['PORT'] ?? '3000', 10)

const app = createApp()

app.listen(PORT, () => {
  console.log(`[cogitador-node] Listening on http://localhost:${PORT}`)
})
