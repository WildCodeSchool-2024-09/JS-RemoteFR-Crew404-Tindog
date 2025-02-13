import type { RequestHandler } from "express";
import matchRepository from "./matchRepository";

const getMatches: RequestHandler = async (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const matches = await matchRepository.getMatchesForUser(req.user.id);
    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    next(error);
  }
};

export default {
  getMatches,
};
