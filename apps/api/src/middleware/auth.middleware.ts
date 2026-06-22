import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../utils/env";

export const authenticateUser: RequestHandler = (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.replace("Bearer ", "");

    if (!token) {
      res.status(403).json({
        error: "Forbidden Request.",
      });
      return;
    }

    const decodedToken = jwt.verify(token, env.jwtSecret);

    const userId = (decodedToken as jwt.JwtPayload).userId;

    req.userId = userId;

    next();
  } catch (error) {
    console.log(
      `Authentication failed. ${error instanceof Error ? error.message : ""}`,
    );
    res.status(401).json({
      error: `Authentication failed. ${error instanceof Error ? error.message : ""}`,
    });
  }
};
