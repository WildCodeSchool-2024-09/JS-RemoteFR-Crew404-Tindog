import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";
import type { Like } from "../../types/interfaces";

class LikeRepository {
  async create(liker_pet_id: number, liked_pet_id: number) {
    await databaseClient.query<Result>(
      "INSERT INTO likes (liker_pet_id, liked_pet_id) VALUES (?, ?)",
      [liker_pet_id, liked_pet_id],
    );

    // Vérifier si le like est réciproque pour créer un match
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM likes WHERE liker_pet_id = ? AND liked_pet_id = ?",
      [liked_pet_id, liker_pet_id],
    );

    if (rows.length > 0) {
      // Match trouvé, on l'enregistre dans la table matches
      await databaseClient.query<Result>(
        "INSERT INTO matches (pet1_id, pet2_id) VALUES (?, ?)",
        [liker_pet_id, liked_pet_id],
      );
    }
  }

  async findLikesForPet(pet_id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM likes WHERE liked_pet_id = ?",
      [pet_id],
    );
    return rows as Like[];
  }

  async findLikesByPet(pet_id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM likes WHERE liker_pet_id = ?",
      [pet_id],
    );
    return rows as Like[];
  }
}

export default new LikeRepository();
