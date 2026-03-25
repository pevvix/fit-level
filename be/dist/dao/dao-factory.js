import sqlite3 from 'sqlite3';
import { UserDAO } from './user-dao';
import { WorkoutPlanDAO } from './workout-plan-dao';
import { ActivityRecordDAO } from './activity-record-dao';
const db = new sqlite3.Database('./../db/fit-level.db');
// CRITICAL: Enable foreign key support
db.run("PRAGMA foreign_keys = ON;");
export const userRepo = new UserDAO(db);
export const workoutPlanRepo = new WorkoutPlanDAO(db);
export const activityRecordRepo = new ActivityRecordDAO(db);
//# sourceMappingURL=dao-factory.js.map