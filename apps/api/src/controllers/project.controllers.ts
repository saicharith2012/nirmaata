import type { RequestHandler } from "express";
import { createProjectSchema } from "@nirmaata/validators/validationSchema";
import { sendValidationError } from "@nirmaata/validators/validation";
import { prisma } from "@nirmaata/db/client";
import type {
  CreateProjectRequest,
  CreateProjectResponse,
  DeleteProjectRequest,
  DeleteProjectResponse,
  DeleteProjectRouteParams,
  GetAllProjectsRequest,
  GetAllProjectsResponse,
  GetProjectRequest,
  GetProjectResponse,
  GetProjectRouteParams,
} from "../types/types";

export const createProject: RequestHandler<
  CreateProjectRequest,
  CreateProjectResponse
> = async (req, res) => {
  try {
    const parsedBody = createProjectSchema.safeParse(req.body);

    if (!parsedBody.success) {
      sendValidationError(res, parsedBody.error);
      return;
    }

    const { title, initialPrompt } = parsedBody.data;

    const project = await prisma.project.create({
      data: {
        title,
        initialPrompt,
        userId: req.userId,
      },
    });

    res.status(200).json({
      ok: true,
      message: "Project created succesfully.",
      project: {
        id: project.id,
        title: project.title,
        userId: project.userId,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error: `Failed to create the new project. ${error instanceof Error ? error.message : ""}`,
    });
  }
};

export const getAllProjects: RequestHandler<
  GetAllProjectsRequest,
  GetAllProjectsResponse
> = async (req, res) => {
  try {
    const userId = req.userId;
    const projects = await prisma.project.findMany({
      where: {
        userId,
      },
      orderBy: {
        lastActivityAt: "desc",
      },
    });

    res.status(200).json({
      ok: true,
      userId,
      projects: projects.map((project) => ({
        id: project.id,
        title: project.title,
        lastActivityAt: project.lastActivityAt.toString(),
      })),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error: `Failed to fetch the projects. ${error instanceof Error ? error.message : ""}`,
    });
  }
};

export const getProject: RequestHandler<
  GetProjectRouteParams,
  GetProjectResponse,
  GetProjectRequest
> = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.userId,
      },
    });

    if (!project) {
      res.status(404).json({
        ok: false,
        error: "Project not found.",
      });
      return;
    }

    res.status(200).json({
      ok: true,
      userId: req.userId,
      project: {
        id: project.id,
        title: project.title,
        lastActivityAt: project.lastActivityAt.toString(),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error: `Failed to fetch the project. ${error instanceof Error ? error.message : ""}`,
    });
  }
};

export const deleteProject: RequestHandler<
  DeleteProjectRouteParams,
  DeleteProjectResponse,
  DeleteProjectRequest
> = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await prisma.project.delete({
      where: {
        id: projectId,
        userId: req.userId,
      },
    });

    res.status(200).json({
      ok: true,
      message: "Project deleted succesfully.",
      projectId: project.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error: `Failed to delete the project. ${error instanceof Error ? error.message : ""}`,
    });
  }
};
