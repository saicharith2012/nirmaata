import type { RequestHandler } from "express";
import { authSchema } from "@nirmaata/validators/validationSchema";
import { sendValidationError } from "@nirmaata/validators/validation";
import { prisma } from "@nirmaata/db/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../utils/env";

export const signupUser: RequestHandler = async (req, res) => {
  try {
    // validate data from request body
    // check if the user already exists (409 if exists)
    // hash password
    // create user in db
    // send success response (200)
    // if error caught, response (500)

    const parsedBody = authSchema.safeParse(req.body);

    if (!parsedBody.success) {
      sendValidationError(res, parsedBody.error);
      return;
    }

    const { username, password } = parsedBody.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUser) {
      res.status(409).json({
        error: "User already exists.",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    if (!newUser) {
      res.status(500).json({
        error: "Error while creating new user.",
      });
      return;
    }

    res.status(200).json({
      message: "Signed up successfully.",
      userId: newUser.id,
    });
  } catch (err) {
    console.log(
      `Error while creating user. ${err instanceof Error ? err.message : ""}`,
    );
    res.status(500).json({
      error: `Error while creating user. ${err instanceof Error ? err.message : ""}`,
    });
  }
};

export const signinUser: RequestHandler = async (req, res) => {
  // validate req body data
  // check if the user exists (404 if doesn't)
  // validate password
  // create jwt token with userId as payload
  // send success response to user (200)
  // if eror is caught, 500 status
  try {
    const parsedBody = authSchema.safeParse(req.body);

    if (!parsedBody.success) {
      sendValidationError(res, parsedBody.error);
      return;
    }

    const { username, password } = parsedBody.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!existingUser) {
      res.status(400).json({
        error: "User not found",
      });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordCorrect) {
      res.status(401).json({
        error: "Invalid credentials.",
      });
      return;
    }

    const token = jwt.sign(
      {
        userId: existingUser.id,
      },
      env.jwtSecret,
    );

    res.status(200).json({
      message: "signed in succesfully.",
      token,
    });
  } catch (err) {
    console.log(
      `Error while signing in user. ${err instanceof Error ? err.message : ""}`,
    );
    res.status(500).json({
      error: `Error while signing in user. ${err instanceof Error ? err.message : ""}`,
    });
  }
};
