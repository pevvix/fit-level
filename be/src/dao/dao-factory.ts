import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import { UserDAO } from './user-dao';
import { WorkoutPlanDAO } from './workout-plan-dao';
import { ActivityRecordDAO } from './activity-record-dao';

dotenv.config({ path:  process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const dbUrl = process.env.DATABASE_URL;
const dbFilePath =  dbUrl ? dbUrl.replace('sqlite:', '') : './db/fit-level.db';

export const db = new sqlite3.Database(dbFilePath, (err) => {
  if (err) {
    console.error('Could not connect to database', err);
    throw err;
  }
});

// CRITICAL: Enable foreign key support
db.run("PRAGMA foreign_keys = ON;");

export const userRepo = new UserDAO(db);
export const workoutPlanRepo = new WorkoutPlanDAO(db);
export const activityRecordRepo = new ActivityRecordDAO(db);

