import { Router } from "express";
import { authenticateUser } from "../middleware/auth.middleware";
import {
  getConversation,
  postUserMessage,
} from "../controllers/conversation.controllers";

const router = Router();

router.get("/projects/:id/messages", authenticateUser, getConversation);
router.post("/projects/:id/messages", authenticateUser, postUserMessage);

export default router;
