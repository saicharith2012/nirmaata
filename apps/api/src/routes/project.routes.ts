import { Router } from "express";
import { authenticateUser } from "../middleware/auth.middleware";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProject,
} from "../controllers/project.controllers";

const router = Router();

router.post("/", authenticateUser, createProject);
router.get("/all", authenticateUser, getAllProjects);
router.get("/:id", authenticateUser, getProject);
router.delete("/:id", authenticateUser, deleteProject);

export default router;
