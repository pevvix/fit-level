export class UserDAO {
    db;
    constructor(db) {
        this.db = db;
    }
    async create(user) {
        const sql = `INSERT INTO user (id, name, workout_plan_id_ref) VALUES (?, ?, ?)`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [user.id, user.name, user.workout_plan_id_ref], (err) => {
                err ? reject(err) : resolve();
            });
        });
    }
    async findById(id) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM user WHERE id = ?`, [id], (err, row) => {
                err ? reject(err) : resolve(row);
            });
        });
    }
    async getAll() {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM user`, [], (err, rows) => {
                err ? reject(err) : resolve(rows);
            });
        });
    }
    async update(user) {
        const sql = `UPDATE user SET name = ?, workout_plan_id_ref = ? WHERE id = ?`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [user.name, user.workout_plan_id_ref, user.id], (err) => {
                err ? reject(err) : resolve();
            });
        });
    }
}
//# sourceMappingURL=user-dao.js.map