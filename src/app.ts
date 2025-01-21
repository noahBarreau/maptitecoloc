// src/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import colocationRoutes from "./routes/colocation.routes";
import authRoutes from "./routes/authRoutes";
import memberRoutes from "./routes/member.routes";

const app = express();

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  throw new Error("Il n'y a rien d'implémenté dans cette route, à vous de jouer !");
});

app.use("/auth", authRoutes);
app.use("/colocations", colocationRoutes);
app.use("/members", memberRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    statusCode,
    errorCode: err.code || "INTERNAL_SERVER_ERROR",
    message: err.message || "An unexpected error occurred",
  });
});

export default app;
