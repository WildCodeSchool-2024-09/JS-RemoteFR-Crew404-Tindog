import "dotenv/config";
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import type { User } from "../types/interfaces";

const secret = process.env.APP_SECRET;

export const createToken = ({ id, username, email }: User) => {
  if (!secret) {
    throw new Error("APP_SECRET is not defined");
  }
  return jwt.sign({ id, username, email }, secret, {
    expiresIn: "1h",
  });
};

export const jwtMid: RequestHandler = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    if (!secret) {
      throw new Error("APP_SECRET is not defined");
    }
    const payload = jwt.verify(token, secret);
    req.user = payload as User;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
