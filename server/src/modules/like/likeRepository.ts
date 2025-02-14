import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

class LikeRepository {
  async create(user_id: number, pet_id: number) {
    try {
      //  Vérifie si l'utilisateur est le propriétaire de l'animal qu'il essaie de liker
      const [ownerRows] = await databaseClient.query<Rows>(
        "SELECT owner_id FROM pets WHERE id = ?",
        [pet_id],
      );

      // Si l'animal n'existe pas ou si l'utilisateur est le propriétaire de l'animal
      if (ownerRows.length > 0 && ownerRows[0].owner_id === user_id) {
        throw new Error("You cannot like your own pet!");
      }

      // J'insère le like si la vérification passe
      await databaseClient.query<Result>(
        "INSERT INTO likes (user_id, pet_id) VALUES (?, ?)",
        [user_id, pet_id],
      );

      // Vérifie si le propriétaire du pet liké a déjà liké un de mes animaux
      const [rows] = await databaseClient.query<Rows>(
        `SELECT p.owner_id FROM pets p
         JOIN likes l ON l.pet_id = p.id
         WHERE l.user_id = ? AND p.owner_id = ?`,
        [user_id, pet_id], // Qui a liké / Qui est le propriétaire
      );

      if (rows.length > 0) {
        const ownerId = rows[0].owner_id;

        // Je m'assure que user1_id est toujours le plus petit
        const user1_id = Math.min(user_id, ownerId);
        const user2_id = Math.max(user_id, ownerId);

        // Si le propriétaire du pet liké a aussi liké un de mes pets, on crée un match
        await databaseClient.query<Result>(
          "INSERT INTO matches (user1_id, user2_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE matched_at = NOW()",
          [user1_id, user2_id],
        );
        return { message: "match!" };
      }

      return { message: "Like registered!" };
    } catch (error: unknown) {
      if (error instanceof Error && "code" in error) {
        const sqlError = error as { code: string; message: string };
        if (sqlError.code === "ER_DUP_ENTRY") {
          throw new Error("You have already liked this pet.");
        }
      }
      throw new Error(`Database error: ${(error as Error).message}`);
    }
  }
}

export default new LikeRepository();
