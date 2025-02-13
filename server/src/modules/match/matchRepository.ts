import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

import type { Match } from "../../types/interfaces";
class MatchRepository {
  async findByPet(pet_id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM matches WHERE pet1_id = ? OR pet2_id = ?",
      [pet_id, pet_id],
    );
    return rows as Match[];
  }

  async isMatch(pet1_id: number, pet2_id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM matches WHERE (pet1_id = ? AND pet2_id = ?) OR (pet1_id = ? AND pet2_id = ?)",
      [pet1_id, pet2_id, pet2_id, pet1_id],
    );
    return rows.length > 0;
  }
}

export default new MatchRepository();
