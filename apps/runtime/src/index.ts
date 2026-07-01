import express from "express";
import agentPath from "@nirmaata/agent";
import { ApiError } from "@nirmaata/common/customApiError";
import { broadcaster } from "./broadcast/eventBroadCaster";
import { executor } from "./execute/executionManager";

const app = express();

app.use(express.json());

app.get("/health", async (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Nirmaata sandbox runtime. OK.",
  });
});

app.post("/execute", async (req, res) => {
  try {
    const { prompt } = req.body;

    console.log(agentPath);

    executor.execute(prompt, agentPath);

    res.status(202).json({
      ok: true,
      message: "Agent process started.",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: `Failed to start the agent. ${error instanceof Error ? error.message : ""}`,
    });
  }
});

app.get("/events", async (req, res) => {
  res.writeHead(200, {
    "content-type": "text/event-stream",
    "cache-control": "no-cache",
    connection: "keep-alive",
  });

  res.write(": ok\n\n");

  broadcaster.addClient(res);
  console.log(`Client connected. Total active: ${broadcaster.noOfClients()}`);

  req.on("close", () => {
    broadcaster.removeClient(res);
    console.log(
      `Client disconnected. Remaining active: ${broadcaster.noOfClients}`,
    );
  });
});

app.listen(process.env.PORT ?? 3000, () => {
  console.log(
    `nirmaata sandbox runtime...running on port ${process.env.PORT ?? 3000}`,
  );
});
