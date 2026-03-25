export class WorkoutPlanDAO {
    db;
    constructor(db) {
        this.db = db;
    }
    async create(plan) {
        const sql = `INSERT INTO workout_plan (id, name, description, activities_on_monday, activities_on_tuesday, activities_on_wednesday, activities_on_thursday, activities_on_friday, activities_on_saturday, activities_on_sunday, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [
                plan.id, plan.name, plan.description, plan.activities_on_monday,
                plan.activities_on_tuesday, plan.activities_on_wednesday, plan.activities_on_thursday,
                plan.activities_on_friday, plan.activities_on_saturday, plan.activities_on_sunday,
                plan.created_at
            ], (err) => err ? reject(err) : resolve());
        });
    }
    async update(plan) {
        const sql = `UPDATE workout_plan SET name = ?, description = ?, activities_on_monday = ?, activities_on_tuesday = ?, activities_on_wednesday = ?, activities_on_thursday = ?, activities_on_friday = ?, activities_on_saturday = ?, activities_on_sunday = ?, created_at = ? WHERE id = ?`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [
                plan.name, plan.description, plan.activities_on_monday,
                plan.activities_on_tuesday, plan.activities_on_wednesday, plan.activities_on_thursday,
                plan.activities_on_friday, plan.activities_on_saturday, plan.activities_on_sunday,
                plan.created_at, plan.id
            ], (err) => err ? reject(err) : resolve());
        });
    }
    async findById(id) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM workout_plan WHERE id = ?`, [id], (err, row) => {
                err ? reject(err) : resolve(row);
            });
        });
    }
    async getAll() {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM workout_plan`, [], (err, rows) => {
                err ? reject(err) : resolve(rows);
            });
        });
    }
    async delete(id) {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM workout_plan WHERE id = ?`, [id], (err) => {
                err ? reject(err) : resolve();
            });
        });
    }
}
//# sourceMappingURL=workout-plan-dao.js.map