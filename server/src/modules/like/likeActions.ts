import type { RequestHandler } from "express";
import likeRepository from "./likeRepository";

const addLike: RequestHandler = async (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const { pet_id } = req.body;

    if (!req.user.id || !pet_id) {
      res.status(400).json({
        error: "Missing required fields",
      });
      return;
    }

    const result = await likeRepository.create(req.user.id, pet_id);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  addLike,
};
