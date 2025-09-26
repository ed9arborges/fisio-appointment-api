// Load environment variables
import "dotenv/config"
import { app } from "./app"

const PORT = Number(process.env.PORT) || 3333

app
  .listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server is running on port ${PORT}`)
    console.log(`📍 Health check: http://localhost:${PORT}/health`)
    console.log(
      `🌐 CORS origins: ${process.env.CORS_ORIGINS || "http://localhost:5173"}`
    )
  })
  .on("error", (err: Error) => {
    if (err.message.includes("EADDRINUSE")) {
      console.error(
        `❌ Port ${PORT} is already in use. Please use a different port.`
      )
      process.exit(1)
    } else {
      console.error("❌ Server failed to start:", err)
      process.exit(1)
    }
  })
