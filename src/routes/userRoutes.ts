import { Router, Request, Response } from "express";
import AuthController from "../controller/authController"
import { jwtUserAuthorization } from "../middleware/auth";
import MovieController from "../controller/movieController";


const userRoutes: Router = Router()
// userRoutes.use(jwtUserAuthorization)

userRoutes.post("/register", AuthController.register)
userRoutes.post("/login", AuthController.login)

userRoutes.get("/movie", MovieController.listMovies)

export default userRoutes;

