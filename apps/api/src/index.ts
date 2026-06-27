import express from "express";
import { env } from "./utils/env";
import authRouter from "./routes/auth.routes";
import projectRouter from "./routes/project.routes";
import conversationRouter from "./routes/conversation.routes"

const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/conversation", conversationRouter)

app.get("/health", (req, res) => {
  res.status(200).send("Nirmaata API server is up and running.");
});

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}...`);
});
