import sqlite3 from "sqlite3";
import { ActivityRecordEntity } from "../model/entities";

export class ActivityRecordDAO {
  constructor(private db: sqlite3.Database) {}

  async create(record: ActivityRecordEntity): Promise<void> {
    const sql = `INSERT INTO activity_record (id, user_id_ref, desription, activity_type, exercise, activity_date)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    return new Promise((resolve, reject) => {
      this.db.run(sql, [
        record.id, record.user_id_ref, record.desription, 
        record.activity_type, record.exercise, record.activity_date
      ], (err) => err ? reject(err) : resolve());
    });
  }

  async getByUserId(userId: string): Promise<ActivityRecordEntity[]> {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM activity_record WHERE user_id_ref = ?`, [userId], (err, rows) => {
        err ? reject(err) : resolve(rows as ActivityRecordEntity[]);
      });
    });
  }

  async delete(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(`DELETE FROM activity_record WHERE id = ?`, [id], (err) => {
        err ? reject(err) : resolve();
      });
    });
  }
}
