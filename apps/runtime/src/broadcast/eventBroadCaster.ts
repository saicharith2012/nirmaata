import type { Response } from "express";
import type { EventInfo } from "../types/types";

class EventBroadcaster {
  private clients = new Set<Response>();

  addClient(res: Response) {
    this.clients.add(res);
  }

  removeClient(res: Response) {
    this.clients.delete(res);
  }

  broadcast(event: EventInfo) {
    for (const client of this.clients) {
      client.write(`data: ${JSON.stringify(event)}\n\n`);
    }
  }

  noOfClients(): number {
    return this.clients.size;
  }
}

export const broadcaster = new EventBroadcaster();
