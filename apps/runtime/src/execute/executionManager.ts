import { ApiError } from "@nirmaata/common/customApiError";
import { broadcaster } from "../broadcast/eventBroadCaster";
import type { EventInfo } from "../types/types";

class ExecutionManager {
  private agentProcess: Bun.Subprocess<"pipe", "pipe", "pipe"> | null = null;

  execute(prompt: string, path: string) {
    if (this.agentProcess !== null) {
      throw new ApiError("Agent process already running.", 409);
    }

    const proc = Bun.spawn(["bun", path], {
      stdin: "pipe",
      stdout: "pipe",
      stderr: "pipe",
    });

    if (!proc || !proc.stdin) {
      throw new ApiError("Error while starting the agent process.", 400);
    }

    proc.stdin.write(prompt);
    proc.stdin.end();

    this.agentProcess = proc;
    void this.monitorAgentProcess(proc);
  }

  private async monitorAgentProcess(
    proc: Bun.Subprocess<"pipe", "pipe", "pipe">,
  ) {
    try {
      const decoder = new TextDecoder();
      for await (const chunk of proc.stdout) {
        const text = decoder.decode(chunk);
        const event: EventInfo = {
          type: "status",
          message: text,
        };

        console.log(event);
        broadcaster.broadcast(event);
      }

      const exitCode = await proc?.exited;

      console.log(`Agent exited with code ${exitCode}`);
    } finally {
      this.agentProcess = null;
    }
  }
}

export const executor = new ExecutionManager();
