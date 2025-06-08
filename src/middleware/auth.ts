import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt";
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