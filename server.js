import express from 'express'
import serveStatic from 'serve-static'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use('/', serveStatic(path.join(__dirname, 'dist')))

app.get(/.*/, function (req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
})

const port = process.env.PORT || 8080
app.listen(port)
console.log(`App is listening on port: ${port}`)
