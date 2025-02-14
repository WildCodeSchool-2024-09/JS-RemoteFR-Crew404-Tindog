import type { RequestHandler } from "express";

import { hashPassword, verifyPassword } from "../../middlewares/argonMid";
import { createToken } from "../../middlewares/jwtMid";
import userRepository from "./userRepository";

const register: RequestHandler = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({ message: "Missing fields" });
      return;
    }
    // Check if the user already exists
    const userExists = await userRepository.findByEmail(email);
    if (userExists) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    // Hash the password
    const passwordHash = await hashPassword(password);
    req.body.password = passwordHash;

    const user = await userRepository.create(req.body);
    res.status(201).json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(409).json({ message: error.message });
      return;
    }
    next(error);
  }
};

const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Missing fields" });
      return;
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const passwordMatch = await verifyPassword(user.password, password);
    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    const sendUser = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    const token = createToken(user);
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .json(sendUser);
  } catch (error) {
    next(error);
  }
};

const logout: RequestHandler = async (req, res, next) => {
  try {
    res.clearCookie("token").json({ message: "Logged out" });
  } catch (error) {
    next(error);
  }
};

const update: RequestHandler = async (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const user = await userRepository.update(req.user.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    next(error);
  }
};

const me: RequestHandler = async (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const response = await userRepository.read(req.user.id);
    if (!response) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const currentUser = {
      ...response,
      password: undefined,
    };

    res.json(currentUser);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    next(error);
  }
};

export default {
  login,
  register,
  logout,
  update,
  me,
};
