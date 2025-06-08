import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt";
import jwt from "jsonwebtoken"
import { stat } from "fs";

export function jwtUserAuthorization(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
        res.send("Missing Authorization.");
        return;
    }

    const authHeader = req.headers.authorization
    if (!verifyJWT(authHeader)) {
        res.json({
            status: 200,
            message: "Invalid authorization token."
        });
        return;
    }

    next();

}

export function jwtAdminAuthorization(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
        res.send("Missing Authorization.");
        return;
    }

    const authHeader = req.headers.authorization;
    const jwtPayload = verifyJWT(authHeader);
    if (!jwtPayload) {
        res.json({
            status: 200,
            message: "Invalid authorization token."
        });
        return;
    }

    if (jwtPayload.role == "ADMIN") {
        next()
    } else {
        res.json({
            status: 200,
            message: "Invalid authorization token."
        });
    }

}