import jwt, { JwtPayload } from "jsonwebtoken"

const JWT_SECRET: string = process.env.JWT_SECRET || "";

export function generateJWT(payload: Object): string {
    return jwt.sign(payload, JWT_SECRET, { algorithm: "HS256", expiresIn: "48h" })
}

export function verifyJWT(token: string): JwtPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // jwt.verify returns either a JwtPayload or a string
        if (typeof decoded === 'string') {
            return null;
        }

        return decoded;
    } catch (error) {
        return null;
    }
}