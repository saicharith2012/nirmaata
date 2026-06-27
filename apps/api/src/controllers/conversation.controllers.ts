import type { RequestHandler } from "express";
import type {
  GetMessagesRequest,
  GetMessagesResponse,
  GetMessagesRouteParams,
  PostUserMessageRequest,
  PostUserMessageResponse,
  PostUserMessageRouteParams,
} from "../types/types";
import { prisma } from "@nirmaata/db/client";
import { postUserMessageSchema } from "@nirmaata/validators/validationSchema";
import { sendValidationError } from "@nirmaata/validators/validation";

export const getConversation: RequestHandler<
  GetMessagesRouteParams,
  GetMessagesResponse,
  GetMessagesRequest
> = async (req, res) => {
  try {
    const projectId = req.params.id;

    const messages = await prisma.message.findMany({
      where: {
        projectId,
        userId: req.userId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!messages) {
      res.status(400).json({
        ok: false,
        error: "Error while getting messages.",
      });
      return;
    }

    res.status(200).json({
      ok: true,
      projectId: projectId,
      messages: messages.map((msg) => ({
        type: msg.type,
        from: msg.from,
        contents: msg.contents,
        toolCall: msg.toolCall,
        createdAt: msg.createdAt,
      })),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error: `Failed to fetch the conversation. ${error instanceof Error ? error.message : ""}`,
    });
  }
};

export const postUserMessage: RequestHandler<
  PostUserMessageRouteParams,
  PostUserMessageResponse,
  PostUserMessageRequest
> = async (req, res) => {
  try {
    const projectId = req.params.id;

    const parsedBody = postUserMessageSchema.safeParse(req.body);

    if (!parsedBody.success) {
      sendValidationError(res, parsedBody.error);
      return;
    }

    const { prompt } = parsedBody.data;
    const message = await prisma.message.create({
      data: {
        type: "TEXT_MESSAGE",
        from: "USER",
        contents: prompt,
        projectId,
        userId: req.userId,
      },
    });

    if (!message) {
      res.status(400).json({
        ok: false,
        error: "Error while sending the prompt.",
      });
      return;
    }

    res.status(200).json({
      ok: true,
      prompt: message.contents,
      userId: message.userId,
      projectId: message.projectId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error: `Failed to send the prompt. ${error instanceof Error ? error.message : ""}`,
    });
  }
};
