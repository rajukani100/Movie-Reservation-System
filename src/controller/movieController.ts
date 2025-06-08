import { Request, Response } from "express";
import prisma from "../config/database"
import { stat } from "fs";

interface movieRequest {
    title: string;
    description: string;
    genre: string;
}

class MovieController {
    static async addMovie(req: Request, res: Response) {
        //movie details
        const reqBody: movieRequest = req.body;

        try {
            await prisma.movie.create({
                data: {
                    title: reqBody.title.toLowerCase(),
                    description: reqBody.description.toLowerCase(),
                    genre: reqBody.genre.toLowerCase()
                }
            })

            res.status(201).json({
                status: 201,
                "message": "Movie has been added."
            })
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: "Error occured while adding movie."
            })
        }

    }

    static async listMovies(req: Request, res: Response) {

        const genre = req.query.genre as string | undefined
        try {
            const movies = await prisma.movie.findMany({
                where: genre ? { genre: genre } : {},
            })
            res.json(movies);
            return;
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: "Error occured while fetching movies."
            })
        }
    }

    static async updateMovie(req: Request, res: Response) {
        const { id: movieId } = req.params;
        const reqBody: movieRequest = req.body;

        try {
            // Check if the movie exists
            const existingMovie = await prisma.movie.findUnique({ where: { id: movieId } });

            if (!existingMovie) {
                res.status(404).json({
                    status: 404,
                    message: "Movie not found",
                });
                return
            }

            await prisma.movie.update({
                where: { id: movieId },
                data: reqBody,
            });

            res.status(200).json({
                status: 200,
                message: "Movie details updated successfully.",
            });
            return;

        } catch (error) {
            res.status(500).json({
                status: 500,
                message: "Error occurred while updating movie details.",
            });
        }
    }

    static async deleteMovie(req: Request, res: Response) {
        const { id: movieId } = req.params;

        try {
            // Check if the movie exists
            const existingMovie = await prisma.movie.findUnique({ where: { id: movieId } });

            if (!existingMovie) {
                res.status(404).json({
                    status: 404,
                    message: "Movie not found",
                });
                return;
            }

            await prisma.movie.delete({
                where: { id: movieId }
            });

            res.status(200).json({
                status: 200,
                message: "Movie has been deleted successfully.",
            });
            return;

        } catch (error) {
            res.status(500).json({
                status: 500,
                message: "Error occurred deleting movie",
            });
        }
    }


}

export default MovieController