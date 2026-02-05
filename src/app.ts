import express from "express";
import userRoutes from "./modules/users/user.routes"
const app = express();

app.use(express.json());
app.use("/api", userRoutes);

export default app;
