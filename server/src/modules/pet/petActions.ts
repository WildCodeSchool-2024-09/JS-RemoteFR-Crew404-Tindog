import type { RequestHandler } from "express";

import petRepository from "./petRepository";

/**
 * Get all pets from the database
 */
const getAll: RequestHandler = async (req, res, next) => {
  try {
    const pets = await petRepository.readAll();
    res.json(pets);
  } catch (error: unknown) {
    // Handle error
    // Check if the error is an instance of Error
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    }
    // Pass the error to the next middleware
    next(error);
  }
};

/**
 * Get my all pets from the database
 */
const getAllMyPets: RequestHandler = async (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const pets = await petRepository.readAllMyPet(req.user.id);
    res.json(pets);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    }
    next(error);
  }
};

/**
 * Get one pet from the database
 */
const getOne: RequestHandler = async (req, res, next) => {
  try {
    const pet = await petRepository.read(+req.params.id);
    res.json(pet);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    }
    next(error);
  }
};

/**
 * Create a new pet in the database
 */
const create: RequestHandler = async (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const { name, species, breed, age, description, photo_url } = req.body;
    if (!name || !species || !breed || !age || !description || !photo_url) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const pet = {
      owner_id: req.user.id,
      ...req.body,
    };
    const id = await petRepository.create(pet);
    res.status(201).json({ message: "Pet created", id });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    }
    next(error);
  }
};

/**
 * Update a pet in the database
 */
const update: RequestHandler = async (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const pet = {
      owner_id: req.user.id,
      ...req.body,
    };
    const petUpdate = await petRepository.update(+req.params.id, pet);
    res.status(200).json({ message: "Pet updated", petUpdate });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    }
    next(error);
  }
};

/**
 * Delete a pet from the database
 */
const destroy: RequestHandler = async (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const id = await petRepository.delete(+req.params.id, req.user.id);
    res.status(200).json({ message: "Pet deleted", id });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    }
    next(error);
  }
};

export default {
  getAll,
  getOne,
  getAllMyPets,
  create,
  update,
  destroy,
};
