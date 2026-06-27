import * as z from "zod";
import { createProjectSchema } from "@nirmaata/validators/validationSchema";

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
        lastActivityAt: string;
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
        lastActivityAt: string;
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

export type APIError = {
  ok: false;
  error: string;
};
