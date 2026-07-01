import { fileURLToPath } from "bun";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const agentPath = path.join(__dirname, "agent-worker.ts");

export default agentPath;
