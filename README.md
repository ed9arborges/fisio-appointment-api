# Fisio Appointment API

RESTful backend for managing physiotherapy appointments. Built with Express, TypeScript, and Prisma, it provides endpoints for creating, listing, and deleting appointments while tracking availability per day.

## Features

- CRUD-style endpoints for appointment management
- Time-slot availability grouped by morning, afternoon, and evening periods
- Zod-powered validation with structured error responses
- Prisma ORM with PostgreSQL datasource and migration support
- Centralized error handling middleware and CORS configuration

## Prerequisites

- Node.js 18 or newer
- PostgreSQL database instance

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment variables**

   Copy `.env.example` to `.env` and set the connection string for PostgreSQL:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
   ```

3. **Generate the Prisma client**

   ```bash
   npx prisma generate
   ```

4. **Apply database migrations**

   ```bash
   npx prisma migrate deploy
   ```

   During local development you can instead use `npx prisma migrate dev --name init` to create and apply migrations in one step.

5. **(Optional) Seed the database**

   ```bash
   npm run seed
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

   The API listens on `http://localhost:3333`.

## Available Scripts

- `npm run dev` – run the server in watch mode with TSX
- `npm run seed` – execute `prisma/seed.ts`
- `npx prisma studio` – open Prisma Studio for inspecting data

## API Reference

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `POST` | `/appointments` | Create a new appointment |
| `GET`  | `/appointments?date=YYYY-MM-DD` | Retrieve appointments grouped by period for a specific day |
| `GET`  | `/appointments/all` | List every appointment ordered by date and time |
| `GET`  | `/appointments/available-slots?date=YYYY-MM-DD` | Fetch availability for each slot on the selected date |
| `DELETE` | `/appointments/:id` | Remove an existing appointment |
| `GET` | `/health` | Health-check endpoint |

### Example Requests

Create an appointment:

```bash
curl -X POST http://localhost:3333/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-09-26",
    "time": "14:00",
    "client": "John Doe"
  }'
```

Get availability:

```bash
curl "http://localhost:3333/appointments/available-slots?date=2025-09-26"
```

## Project Structure

```
api/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Generated migrations
├── src/
│   ├── app.ts             # Express app configuration
│   ├── server.ts          # HTTP server bootstrap
│   ├── controlers/        # Appointment controller
│   ├── routes/            # Express routers
│   ├── middlewares/       # Error handling middleware
│   └── utils/             # Custom errors and helpers
└── package.json
```

## Database Schema

```prisma
model Appointment {
  id        String   @id @default(cuid())
  date      DateTime
  time      String
  client    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("appointments")
}
```

## Troubleshooting

- **`PrismaClientInitializationError`**: Verify `DATABASE_URL` and ensure the PostgreSQL instance is reachable.
- **Port already in use**: Update the port in `src/server.ts` or stop the conflicting service.
- **CORS errors from the frontend**: Confirm the frontend origin is listed in the CORS configuration in `src/app.ts`.

## Development Tips

- Run `npx prisma migrate dev` whenever the schema changes to create new migrations.
- Use `npm run dev` while developing so the server reloads automatically after changes.
- Keep validation logic in the controller in sync with frontend expectations to avoid unnecessary 4xx responses.
