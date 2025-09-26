import { Request, Response } from "express"
import { z } from "zod"
import prisma from "../database/prisma"
import { AppError } from "../utils/AppError"

const createAppointmentSchema = z.object({
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time format (HH:MM)",
  }),
  client: z.string().min(1, "Client name is required"),
})

const getAppointmentsByDateSchema = z.object({
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
})

export class AppointmentController {
  async create(request: Request, response: Response) {
    try {
      const { date, time, client } = createAppointmentSchema.parse(request.body)

      const appointmentDate = new Date(date)

      // Check if there's already an appointment at this date and time
      const existingAppointment = await prisma.appointment.findFirst({
        where: {
          date: {
            gte: new Date(
              appointmentDate.getFullYear(),
              appointmentDate.getMonth(),
              appointmentDate.getDate()
            ),
            lt: new Date(
              appointmentDate.getFullYear(),
              appointmentDate.getMonth(),
              appointmentDate.getDate() + 1
            ),
          },
          time,
        },
      })

      if (existingAppointment) {
        throw new AppError("Time slot already booked", 400)
      }

      const appointment = await prisma.appointment.create({
        data: {
          date: appointmentDate,
          time,
          client,
        },
      })

      return response.status(201).json(appointment)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError(error.issues[0].message, 400)
      }
      throw error
    }
  }

  async getByDate(request: Request, response: Response) {
    try {
      const { date } = getAppointmentsByDateSchema.parse(request.query)

      const queryDate = new Date(date)
      const startOfDay = new Date(
        queryDate.getFullYear(),
        queryDate.getMonth(),
        queryDate.getDate()
      )
      const endOfDay = new Date(
        queryDate.getFullYear(),
        queryDate.getMonth(),
        queryDate.getDate() + 1
      )

      const appointments = await prisma.appointment.findMany({
        where: {
          date: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
        orderBy: {
          time: "asc",
        },
      })

      // Group appointments by time period
      const groupedAppointments = {
        morning: appointments.filter((apt: any) => {
          const hour = parseInt(apt.time.split(":")[0])
          return hour >= 9 && hour < 13
        }),
        afternoon: appointments.filter((apt: any) => {
          const hour = parseInt(apt.time.split(":")[0])
          return hour >= 13 && hour < 19
        }),
        evening: appointments.filter((apt: any) => {
          const hour = parseInt(apt.time.split(":")[0])
          return hour >= 19 && hour < 22
        }),
      }

      return response.json(groupedAppointments)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError(error.issues[0].message, 400)
      }
      throw error
    }
  }

  async getAll(request: Request, response: Response) {
    try {
      const appointments = await prisma.appointment.findMany({
        orderBy: [{ date: "asc" }, { time: "asc" }],
      })

      return response.json(appointments)
    } catch (error) {
      throw error
    }
  }

  async getAvailableSlots(request: Request, response: Response) {
    try {
      const { date } = getAppointmentsByDateSchema.parse(request.query)

      const queryDate = new Date(date)
      const startOfDay = new Date(
        queryDate.getFullYear(),
        queryDate.getMonth(),
        queryDate.getDate()
      )
      const endOfDay = new Date(
        queryDate.getFullYear(),
        queryDate.getMonth(),
        queryDate.getDate() + 1
      )

      const bookedAppointments = await prisma.appointment.findMany({
        where: {
          date: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
        select: {
          time: true,
        },
      })

      const bookedTimes = bookedAppointments.map((apt: any) => apt.time)

      // Define available time slots
      const allSlots = {
        morning: ["09:00", "10:00", "11:00", "12:00"],
        afternoon: ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
        evening: ["19:00", "20:00", "21:00"],
      }

      // Mark slots as available or not
      const availableSlots = {
        morning: allSlots.morning.map((time) => ({
          time,
          available: !bookedTimes.includes(time),
        })),
        afternoon: allSlots.afternoon.map((time) => ({
          time,
          available: !bookedTimes.includes(time),
        })),
        evening: allSlots.evening.map((time) => ({
          time,
          available: !bookedTimes.includes(time),
        })),
      }

      return response.json(availableSlots)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError(error.issues[0].message, 400)
      }
      throw error
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const { id } = request.params

      const appointment = await prisma.appointment.findUnique({
        where: { id },
      })

      if (!appointment) {
        throw new AppError("Appointment not found", 404)
      }

      await prisma.appointment.delete({
        where: { id },
      })

      return response.status(204).send()
    } catch (error) {
      throw error
    }
  }
}
