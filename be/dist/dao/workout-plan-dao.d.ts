import sqlite3 from 'sqlite3';
import { WorkoutPlanEntity } from '../model/entities';
export declare class WorkoutPlanDAO {
    private db;
    constructor(db: sqlite3.Database);
    create(plan: WorkoutPlanEntity): Promise<void>;
    update(plan: WorkoutPlanEntity): Promise<void>;
    findById(id: string): Promise<WorkoutPlanEntity | undefined>;
    getAll(): Promise<WorkoutPlanEntity[]>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=workout-plan-dao.d.ts.map