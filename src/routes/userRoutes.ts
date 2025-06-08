import { Router, Request, Response } from "express";
import AuthController from "../controller/authController"
import { jwtUserAuthorization } from "../middleware/auth";

const userRoutes: Router = Router()
// userRoutes.use(jwtUserAuthorization)

userRoutes.post("/register", AuthController.register)
userRoutes.post("/login", AuthController.login)

export default userRoutes;

