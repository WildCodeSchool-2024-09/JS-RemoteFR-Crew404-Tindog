import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";
import type { User } from "../../types/interfaces";

class UserRepository {
  async create(user: Omit<User, "id" | "created_at">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [user.username, user.email, user.password_hash],
    );
    return result.insertId;
  }

  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM users WHERE id = ?",
      [id],
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
