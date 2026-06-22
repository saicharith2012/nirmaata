import express from "express";
import { env } from "./utils/env";
import authRouter from "./routes/auth.routes";

const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRouter);

app.get("/health", (req, res) => {
  res.status(200).send("Nirmaata API server running.");
});

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}...`);
});
