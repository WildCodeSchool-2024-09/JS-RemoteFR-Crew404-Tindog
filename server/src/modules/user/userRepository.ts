import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";
import type { User } from "../../types/interfaces";

class UserRepository {
  async create(user: Omit<User, "id" | "created_at">) {
    try {
      const [result] = await databaseClient.query<Result>(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [user.username, user.email, user.password],
      );

      // Si l'insertion n'a pas fonctionné
      if (result.affectedRows !== 1) {
        throw new Error("User not created");
      }

      return result.insertId;
    } catch (error: unknown) {
      // Si l'erreur est un doublon
      if (error instanceof Error && error.message.includes("ER_DUP_ENTRY")) {
        throw new Error("User already exists");
      }

      // Si l'erreur est inconnue
      throw new Error("Database error");
    }
  }

  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM users WHERE id = ?",
      [id],
    );
    return rows[0] as User;
  }

  async findByEmail(email: string) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    return rows[0] as User;
  }

  async readAll() {
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM users");
    return rows as User[];
  }

  async update(id: number, user: Partial<Omit<User, "id" | "created_at">>) {
    const fields = Object.keys(user)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(user);

    if (fields.length === 0) return null; // Rien à mettre à jour

    await databaseClient.query<Result>(
      `UPDATE users SET ${fields} WHERE id = ?`,
      [...values, id],
    );

    return this.read(id);
  }

  async delete(id: number) {
    await databaseClient.query<Result>("DELETE FROM users WHERE id = ?", [id]);
    return true;
  }
}

export default new UserRepository();
