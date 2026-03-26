export class ActivityRecordDAO {
    db;
    constructor(db) {
        this.db = db;
    }
    // async create(record: ActivityRecordEntity): Promise<void> {
    //   const sql = `INSERT INTO activity_record (id, user_id_ref, desription, activity_type, exercise, activity_date)
    //                VALUES (?, ?, ?, ?, ?, ?)`;
    //   return new Promise((resolve, reject) => {
    //     this.db.run(sql, [
    //       record.id, record.user_id_ref, record.description, 
    //       record.activity_type, record.exercise, record.activity_date
    //     ], (err) => err ? reject(err) : resolve());
    //   });
    // }
    async create(records) {
        const normalizedRecords = Array.isArray(records) ? records : [records];
        if (normalizedRecords.length === 0) {
            return;
        }
        const placeholders = normalizedRecords.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');
        const sql = `INSERT INTO activity_record (id, user_id_ref, desription, activity_type, exercise, activity_date) VALUES ${placeholders}`;
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
    async getActivitiesByUserId(userId) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM activity_record WHERE user_id_ref = ? order by activity_date desc`, [userId], (err, rows) => {
                err ? reject(err) : resolve(rows);
            });
        });
    }
    async delete(id) {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM activity_record WHERE id = ?`, [id], (err) => {
                err ? reject(err) : resolve();
            });
        });
    }
}
//# sourceMappingURL=activity-record-dao.js.map