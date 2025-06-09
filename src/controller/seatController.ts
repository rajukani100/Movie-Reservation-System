import { Request, Response } from "express"
import prisma from "../config/database"

class SeatController {
    static async getAllSeats(req: Request, res: Response) {
        const ShowId = req.params.id;

        const availableSeats = await prisma.seat.findMany({
            where: {
                ShowId: ShowId,
                isReserved: false
            },
            orderBy: {
                seatNumber: "asc"
            }
        })

        if (availableSeats.length == 0) {
            res.json({
                "message": "There is no seat available"
            });
            return
        }

        const seatNumbers: string[] = availableSeats.map(seat => seat.seatNumber);

        res.json(seatNumbers)
    }
}

export default SeatController