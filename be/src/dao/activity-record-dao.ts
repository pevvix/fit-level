import sqlite3 from "sqlite3";
import { ActivityRecordEntity } from "../model/entities";

export class ActivityRecordDAO {
  constructor(private db: sqlite3.Database) {}


  async create(records: ActivityRecordEntity[] | ActivityRecordEntity): Promise<void> {
    const normalizedRecords = Array.isArray(records) ? records : [records];
    if (normalizedRecords.length === 0) {
      return;
    }

    const placeholders = normalizedRecords.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');
    const sql = `INSERT INTO activity_record (id, user_id_ref, description, activity_type, exercise, activity_date) VALUES ${placeholders}`;

    const params = normalizedRecords.flatMap((record) => [
      record.id,
      record.user_id_ref,
      record.description,
      record.activity_type,
      record.exercise,
      record.activity_date
    ]);

    return new Promise((resolve, reject) => {
      this.db.run(sql, params, (err) => {
        err ? reject(err) : resolve();
      });
    });
  }

  async getActivitiesByUserId(userId: string): Promise<ActivityRecordEntity[]> {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM activity_record WHERE user_id_ref = ? order by activity_date desc`, [userId], (err, rows) => {
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
