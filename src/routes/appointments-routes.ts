import { Router } from "express"
import { AppointmentController } from "../controlers/appointments-controller"

const appointmentsRoutes = Router()
const appointmentController = new AppointmentController()

// Create a new appointment
appointmentsRoutes.post("/", appointmentController.create)

// Get appointments by date
appointmentsRoutes.get("/", appointmentController.getByDate)

// Get all appointments
appointmentsRoutes.get("/all", appointmentController.getAll)

// Get available time slots for a date
appointmentsRoutes.get(
  "/available-slots",
  appointmentController.getAvailableSlots
)

// Delete an appointment
appointmentsRoutes.delete("/:id", appointmentController.delete)

export { appointmentsRoutes }
