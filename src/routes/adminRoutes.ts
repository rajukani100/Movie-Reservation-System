import { Router, Request, Response } from "express";
import MovieController from "../controller/movieController"
import { jwtAdminAuthorization } from "../middleware/auth"
import ShowtimeController from "../controller/showtimeController"
import ReservationController from "../controller/reservationController"

const adminRoutes: Router = Router()
adminRoutes.use(jwtAdminAuthorization)

adminRoutes.post("/add-movie", MovieController.addMovie)
adminRoutes.put("/update-movie/:id", MovieController.updateMovie)
adminRoutes.delete("/delete-movie/:id", MovieController.deleteMovie)

adminRoutes.post("/showtimes", ShowtimeController.addShowtime)

adminRoutes.get("/reservations", ReservationController.getAllReservation)

export default adminRoutes;

