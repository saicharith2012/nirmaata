import * as z from "zod";
import { createProjectSchema, postUserMessageSchema } from "@nirmaata/validators/validationSchema";

// api request types
export type CreateProjectRequest = z.infer<typeof createProjectSchema>;
export type GetAllProjectsRequest = {};
export type GetProjectRequest = {};
export type GetProjectRouteParams = {
  id: string;
};
export type DeleteProjectRequest = {};
export type DeleteProjectRouteParams = {
  id: string;
};
export type GetMessagesRequest = {};
export type GetMessagesRouteParams = {
  id: string;
};
export type PostUserMessageRequest = z.infer<typeof postUserMessageSchema>
export type PostUserMessageRouteParams = {
  id: string;
};

// api response types
export type CreateProjectResponse =
  | {
      ok: true;
      message: string;
      project: {
        id: string;
        title: string;
        userId: string;
      };
    }
  | APIError;

export type GetAllProjectsResponse =
  | {
      ok: true;
      userId: string;
      projects: {
        id: string;
        title: string;
        lastActivityAt: Date;
      }[];
    }
  | APIError;

export type GetProjectResponse =
  | {
      ok: true;
      userId: string;
      project: {
        id: string;
        title: string;
        lastActivityAt: Date;
      };
    }
  | APIError;

export type DeleteProjectResponse =
  | {
      ok: true;
      message: string;
      projectId: string;
    }
  | APIError;

export type GetMessagesResponse =
  | {
      ok: true;
      projectId: string;
      messages: {
        type: string;
        from: string;
        contents: string;
        toolCall: string | null;
        createdAt: Date;
      }[];
    }
  | APIError;

export type PostUserMessageResponse = {
  ok: true;
  prompt: string;
  userId: string;
  projectId: string;
} | APIError;

export type APIError = {
  ok: false;
  error: string;
};
