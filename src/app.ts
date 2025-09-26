import express from "express"

import { routes } from "./routes"
import { errorHandling } from "./middlewares/error-handling"

const app = express()

// Simple CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

app.use(express.json())

app.get("/", (req, res) => {
  res.json({
    message: "Fisio Appointment API is running!",
    timestamp: new Date().toISOString(),
  })
})

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() })
})

app.use(routes)
app.use(errorHandling)

export { app }
