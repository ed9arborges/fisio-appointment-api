import express from "express"
import cors from "cors"

import { routes } from "./routes"
import { errorHandling } from "./middlewares/error-handling"

const app = express()

const defaultOrigins = ["http://localhost:5173", "http://localhost:3000"]
const environmentOrigins =
  process.env.CORS_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? []
const allowedOrigins = [...new Set([...defaultOrigins, ...environmentOrigins])]

const allowAllOrigins = allowedOrigins.includes("*")

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowAllOrigins || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error("Not allowed by CORS"))
    },
    credentials: true,
  })
)
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
