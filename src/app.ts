import express from "express";
import userRoutes from "./modules/users/user.routes"
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api", userRoutes);

export default app;
