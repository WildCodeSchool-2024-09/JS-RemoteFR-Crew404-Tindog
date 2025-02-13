import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

import type { Message } from "../../types/interfaces";

class MessageRepository {
  async create(message: Omit<Message, "id" | "sent_at">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO messages (match_id, sender_id, receiver_id, message) VALUES (?, ?, ?, ?)",
      [
        message.match_id,
        message.sender_id,
        message.receiver_id,
        message.message,
      ],
    );
    return result.insertId;
  }

  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM messages WHERE id = ?",
      [id],
    );
    return rows[0] as Message;
  }

  async readAll() {
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM messages");
    return rows as Message[];
  }

  async findByMatch(match_id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM messages WHERE match_id = ? ORDER BY sent_at ASC",
      [match_id],
    );
    return rows as Message[];
  }

  async update(id: number, message: Partial<Omit<Message, "id" | "sent_at">>) {
    const fields = Object.keys(message)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(message);

    if (fields.length === 0) return null;

    await databaseClient.query<Result>(
      `UPDATE messages SET ${fields} WHERE id = ?`,
      [...values, id],
    );
    return this.read(id);
  }

  async delete(id: number) {
    await databaseClient.query<Result>("DELETE FROM messages WHERE id = ?", [
      id,
    ]);
    return true;
  }
}

export default new MessageRepository();
