import { Router, Request, Response } from "express";
import AuthController from "../controller/authController"
import { jwtUserAuthorization } from "../middleware/auth";
import MovieController from "../controller/movieController";
import ShowtimeController from "../controller/showtimeController";
import SeatController from "../controller/seatController";
import ReservationController from "../controller/reservationController"

const userRoutes: Router = Router()
userRoutes.use(jwtUserAuthorization)

userRoutes.post("/register", AuthController.register)
userRoutes.post("/login", AuthController.login)

userRoutes.get("/movie", MovieController.listMovies)
userRoutes.get("/movie/:id/showtimes", ShowtimeController.getShowtime)

userRoutes.get("/showtime/:id/seats", SeatController.getAllSeats)

userRoutes.post("/reservations", ReservationController.makeReservation)
userRoutes.get("/reservations", ReservationController.getMyReservations)
userRoutes.delete("/reservations/:id", ReservationController.cancelReservation)

export default userRoutes;

