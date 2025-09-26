import express from "express"

import { routes } from "./routes"
import { errorHandling } from "./middlewares/error-handling"

const app = express()
app.use(express.json())

app.get("/", (req, res) => {
  res.json({
    message: "Fisio Appointment API is running!",
    port: 3333,
    timestamp: new Date().toISOString(),
  })
})

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() })
})

app.use(routes)
app.use(errorHandling)

export { app }
