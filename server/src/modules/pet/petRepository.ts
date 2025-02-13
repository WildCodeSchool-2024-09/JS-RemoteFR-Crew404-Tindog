import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

import type { Pet } from "../../types/interfaces";

class PetRepository {
  async create(pet: Omit<Pet, "id" | "created_at">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO pets (owner_id, name, species, breed, age, description, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        pet.owner_id,
        pet.name,
        pet.species,
        pet.breed,
        pet.age,
        pet.description,
        pet.photo_url,
      ],
    );
    return result.insertId;
  }

  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM pets WHERE id = ?",
      [id],
    );
    return rows[0] as Pet;
  }

  async readAll() {
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM pets");
    return rows as Pet[];
  }

  async readAllMyPet(owner_id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM pets WHERE owner_id = ?",
      [owner_id],
    );

    return rows as Pet[];
  }

  async update(id: number, pet: Partial<Omit<Pet, "id" | "created_at">>) {
    const fields = Object.keys(pet)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(pet);

    if (fields.length === 0) return null;

    await databaseClient.query<Result>(
      `UPDATE pets SET ${fields} WHERE id = ?`,
      [...values, id],
    );
    return this.read(id);
  }

  async delete(id: number, owner_id: number) {
    await databaseClient.query<Result>(
      "DELETE FROM pets WHERE id = ? AND owner_id = ?",
      [id, owner_id],
    );
    return true;
  }
}

export default new PetRepository();
