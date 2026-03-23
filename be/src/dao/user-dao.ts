import sqlite3 from "sqlite3";
import { UserEntity } from "../model/entities";

export class UserDAO {
  constructor(private db: sqlite3.Database) {}

  async create(user: UserEntity): Promise<void> {
    const sql = `INSERT INTO user (id, name, workout_plan_id_ref) VALUES (?, ?, ?)`;
    return new Promise((resolve, reject) => {
      this.db.run(sql, [user.id, user.name, user.workout_plan_id_ref], (err) => {
        err ? reject(err) : resolve();
      });
    });
  }

  async findById(id: string): Promise<UserEntity | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(`SELECT * FROM user WHERE id = ?`, [id], (err, row) => {
        err ? reject(err) : resolve(row as UserEntity);
      });
    });
  }

  async updatePlan(userId: string, planId: string | null): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(`UPDATE user SET workout_plan_id_ref = ? WHERE id = ?`, [planId, userId], (err) => {
        err ? reject(err) : resolve();
      });
    });
  }
}
