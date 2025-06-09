import prisma from "../config/database"
import { Request, Response } from "express"
import { verifyJWT } from "../utils/jwt";
import { error } from "console";

interface makeReservationRequest {
    showId: string;
    seatNo: string;
}

class ReservationController {

    static async makeReservation(req: Request, res: Response) {
        const reqBody: makeReservationRequest = req.body;

        try {
            const show = await prisma.show.findUnique({
                where: {
                    id: reqBody.showId
                }
            })

            if (!show) {
                res.json({
                    message: "Show does not exist"
                });
                return;
            }

            const jwtToken = req.headers.authorization as string
            const jwtPayload = verifyJWT(jwtToken)


            const reservation = await prisma.$transaction(async (tx) => {
                //is seat available

                const seat = await tx.seat.findFirst({
                    where: {
                        ShowId: reqBody.showId,
                        seatNumber: reqBody.seatNo,
                        isReserved: false
                    }
                })
                if (!seat) {
                    throw new Error("Seat number is invalid or booked.")
                }

                const reservation = await tx.reservation.create({
                    data: {
                        showtimeId: reqBody.showId,
                        userId: jwtPayload!.userId
                    }
                })
                await tx.seat.update({
                    where: {
                        ShowId_seatNumber: {
                            ShowId: reqBody.showId,
                            seatNumber: reqBody.seatNo
                        }
                    },
                    data: {
                        isReserved: true,
                        reservationId: reservation.id,
                    }
                })

                return reservation
            })

            res.json(reservation)
            return;


        } catch (e) {
            if (e instanceof Error) {
                res.status(500).json({
                    status: 500,
                    message: e.message
                })
            }
        }

    }

    static async getMyReservations(req: Request, res: Response) {
        try {
            const jwtToken = req.headers.authorization as string;
            const jwtPayload = verifyJWT(jwtToken);

            const reservations = await prisma.reservation.findMany({
                where: {
                    userId: jwtPayload!.userId
                },
                include: {
                    seats: true,
                    showtime: true
                }
            });

            res.status(200).json(reservations);
            return
        } catch (error) {
            res.status(500).json({ message: "Error occured while fetching reservations info." });
        }
    }


    static async cancelReservation(req: Request, res: Response) {
        const { id: reservationId } = req.params;

        try {
            const existingReservation = await prisma.reservation.findMany({
                where: { id: reservationId }
            });

            if (existingReservation.length == 0) {
                res.status(404).json({ error: "Reservation not found." });
                return
            }

            await prisma.$transaction([
                prisma.seat.updateMany({
                    where: { reservationId },
                    data: {
                        isReserved: false,
                        reservationId: null
                    }
                }),
                prisma.reservation.delete({
                    where: { id: reservationId }
                })
            ]);

            res.status(200).json({ message: "Reservation cancelled successfully." });
        } catch (error) {
            res.status(500).json({ error: "Failed to cancel reservation." });
        }
    }


    static async getAllReservation(req: Request, res: Response) {
        try {
            const reservations = await prisma.reservation.findMany({
                include: {
                    user: true,
                    showtime: true,
                    seats: true
                }
            });

            res.status(200).json(reservations);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch reservations." });
        }
    }


}

export default ReservationController;