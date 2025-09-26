import { Router } from "express"

import { appointmentsRoutes } from "./appointments-routes"

const routes = Router()

routes.use("/appointments", appointmentsRoutes)

export { routes }
