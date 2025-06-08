import { Request, RequestHandler, Response } from "express"
import bcrypt from 'bcryptjs'
import prisma from "../config/database";
import { Prisma } from "@prisma/client";
import { generateJWT } from "../utils/jwt";

interface registerRequest {
    email: string;
    password: string;
}

interface loginRequest {
    email: string;
    password: string;
}

interface jwtUser {
    userId: string;
    role: string;
}

class AuthController {
    static async register(req: Request, res: Response): Promise<void> {
        const reqBody: registerRequest = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(reqBody.password, salt)

        try {
            // save user to db
            await prisma.user.create({
                data: {
                    email: reqBody.email,
                    passwordHash: hashPassword
                }
            });

            res.status(201).json({
                status: 201,
                message: "Account created successfully."
            });
            return
        }
        catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError)
                //error if email already in use
                if (e.code == 'P2002') {
                    res.status(400).json({ message: 'Email already in use.' });
                    return
                }
        }
        res.status(500).json({
            status: 500,
            message: "An error occurred while creating the user."
        });
        return

    }

    static async login(req: Request, res: Response): Promise<void> {
        const reqBody: loginRequest = req.body;

        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: reqBody.email
                }
            })

            //user not exist
            if (!user) {
                res.status(403).json({
                    status: 403,
                    message: "email or password is invalid."
                });
                return;
            }

            //if user exist -> check password
            const isPassValid = await bcrypt.compare(reqBody.password, user.passwordHash)
            if (!isPassValid) {
                res.status(403).json({
                    status: 403,
                    message: "email or password is invalid."
                });
                return;
            }

            //valid user -> send JWT Token
            const jwtUser: jwtUser = { userId: user.id, role: user.role };
            const jwtToken = generateJWT(jwtUser)
            res.json({
                status: 200,
                accessToken: jwtToken,
                message: "You logged in successfully."
            })
            return

        } catch (error) {
            res.json({
                status: 500,
                message: "An error occurred while logged in user."
            })
        }
    }

}

export default AuthController