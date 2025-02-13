import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

import type { Match } from "../../types/interfaces";
class MatchRepository {
  async getMatchesForUser(user_id: number) {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT 
          m.id AS match_id,
          m.matched_at,
          u.id AS matched_user_id,
          u.username,
          u.email
       FROM matches m
       JOIN users u ON (u.id = m.user1_id OR u.id = m.user2_id) 
       WHERE (m.user1_id = ? OR m.user2_id = ?) 
       AND u.id != ?`, // On exclut l'utilisateur lui-même
      [user_id, user_id, user_id],
    );

    return rows as Match[];
  }

  async isMatch(user1_id: number, user2_id: number) {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT * FROM matches 
       WHERE (user1_id = ? AND user2_id = ?) 
       OR (user1_id = ? AND user2_id = ?)`,
      [user1_id, user2_id, user2_id, user1_id],
    );

    return rows.length > 0;
  }
}

export default new MatchRepository();
