import jwt from "jsonwebtoken"

const JWT_SECRET: string = process.env.JWT_SECRET || "";

export function generateJWT(payload: Object): string {
    return jwt.sign(payload, JWT_SECRET, { algorithm: "HS256", expiresIn: "48h" })
}

export function verifyJWT(token: string): string | null {
    try {
        return jwt.verify(token, JWT_SECRET) as string;
    } catch (error) {
        return null;
    }
}