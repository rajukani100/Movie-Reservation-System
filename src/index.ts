import express, { Application, Request, Response, Router } from "express";
import 'dotenv/config'
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";


const app: Application = express();
const PORT = process.env.PORT || 8001;

app.use(express.json())
app.use("/", userRoutes)
app.use("/admin", adminRoutes)

app.get("/status", (req, res) => {
    res.send("server is running..")
})

app.listen(PORT, () => {
    console.log("Server is running....")
})
