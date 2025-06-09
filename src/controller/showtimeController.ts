import { Request, Response } from "express"
import prisma from "../config/database"

interface CreateShowtimeRequest {
    movieId: string;
    startTime: string;
    totalSeats?: number;
}

class ShowtimeController {
    static async addShowtime(req: Request, res: Response) {
        const { movieId, startTime, totalSeats = 80 }: CreateShowtimeRequest = req.body;

        try {
            const movie = await prisma.movie.findUnique({
                where: { id: movieId },
            });

            if (!movie) {
                res.status(404).json({ message: "Movie not found." });
                return
            }

            await prisma.$transaction(async (tx) => {
                // Create showtime
                const showtime = await tx.show.create({
                    data: {
                        movieId,
                        startTime: new Date(startTime),
                    },
                });

                const seatData = [];

                for (let i = 1; i <= totalSeats; i++) {
                    seatData.push({
                        seatNumber: `A${i}`,
                        ShowId: showtime.id,
                    });
                }

                await tx.seat.createMany({
                    data: seatData
                });

                return showtime;
            });

            res.status(201).json({
                status: 201,
                message: "Showtime and seats created successfully.",
            });
            return
        } catch (error) {
            console.log("rollaback")
            res.status(500).json({
                status: 500,
                message: "Failed to create showtime. Transaction rolled back."
            });
        }
    }

    static async getShowtime(req: Request, res: Response) {
        const movieId = req.params.id;

        try {
            const showList = await prisma.show.findMany({
                where: {
                    movieId: movieId
                },
                orderBy: {
                    startTime: 'asc'
                }
            })

            if (!showList) {
                res.json({
                    status: 200,
                    message: "No shows found."
                })
                return;
            }

            res.json(showList)
            return
        } catch (e) {
            res.status(500).json({
                status: 500,
                message: "Error occured while finding show."
            })
        }

    }
}

export default ShowtimeController