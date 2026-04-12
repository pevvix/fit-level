import request from 'supertest';
import { jest, test, expect, describe, beforeEach, afterEach } from '@jest/globals';

import { app } from '../src/app.js';
import { ActivityRecordDto, UserDto, WorkoutPlanDto, WorkoutSummaryDto } from '../src/dto/dto.js';
import { db } from '../src/dao/dao-factory.js';

describe('Fit level full test', () => {

    const MOCK_TODAY_FRIDAY = new Date('2026-02-27T00:00:00.000Z');

    beforeEach((done) => {
        db.serialize(() => {
            db.run("DELETE FROM activity_record", () => done());
            db.run("DELETE FROM user", () => done());
            db.run("DELETE FROM workout_plan", () => done());
        });
        jest.useFakeTimers();
        jest.setSystemTime(MOCK_TODAY_FRIDAY);
    });

    afterAll(async () => await db.close());

    afterEach(() => {
        jest.useRealTimers();
    });

    it('check entire flow', async () => {
        // step 1
        const createdWorkoutPlan = await createAndValidateWorkoutPlan() as WorkoutPlanDto;

        // step 2
        const workoutSummary = await createUser('Test_User', createdWorkoutPlan);
        expect(workoutSummary.user).toEqual({
            id: expect.any(String),
            userName: 'Test_User',
            workoutPlanId: createdWorkoutPlan.id
        });
        expect(workoutSummary.workoutPlan).toEqual(createdWorkoutPlan);
        expect(workoutSummary.score).toEqual({points: 0, level: 1, dayStreak: 0});

        // add historical activity records and score to DB     
        await addHistoricalDataToDB(workoutSummary.user.id as string);


        // step 3: add activity record
        await createAndValidateActivityRecord(workoutSummary, true, MOCK_TODAY_FRIDAY);

        // step 4: Retrieve Workout Summary again to check if score is updated
        const responseWorkoutSummary = await request(app)
            .get(`/api/v1/user/${workoutSummary.user.id}`)
            .set('Content-Type', 'application/json');

        expect(responseWorkoutSummary.statusCode).toBe(200);
        const updatedWorkoutSummary = responseWorkoutSummary.body as WorkoutSummaryDto;

        expect(updatedWorkoutSummary.user).toEqual(workoutSummary.user);
        expect(updatedWorkoutSummary.workoutPlan).toEqual(workoutSummary.workoutPlan);
        expect(updatedWorkoutSummary.score).toEqual({points: 100, level: 2, dayStreak: 1});
    });
    

    async function createAndValidateWorkoutPlan(): Promise<WorkoutPlanDto> {
        const workoutPlan = {
            name: 'Test Plan DDD',
            description: 'A test workout plan',
            activityTypeByDay: {
                MONDAY: ['running'],
                TUESDAY: ['cycling'],
                WEDNESDAY: [],
                THURSDAY: ['yoga'],
                FRIDAY: ['weight lifting'],
                SATURDAY: [],
                SUNDAY: []
            }
        } as WorkoutPlanDto;

        // save workout plan
        const responseWorkoutPlan = await request(app)
            .post('/api/v1/workout-plan')
            .set('Content-Type', 'application/json')
            .send(workoutPlan);

        const createdWorkoutPlan = responseWorkoutPlan.body as WorkoutPlanDto;

        expect(responseWorkoutPlan.statusCode).toBe(201);
        expect(createdWorkoutPlan.id).toBeDefined();
        expect(createdWorkoutPlan.name).toBe(workoutPlan.name);
        expect(createdWorkoutPlan.description).toBe(workoutPlan.description);
        expect(createdWorkoutPlan.activityTypeByDay).toEqual(workoutPlan.activityTypeByDay);


        // Retrieve the workout plan to validate it was saved correctly
        const responseGetWorkoutPlan = await request(app)
            .get(`/api/v1/workout-plan/${createdWorkoutPlan.id}`)
            .set('Content-Type', 'application/json');

        expect(responseGetWorkoutPlan.statusCode).toBe(200);
        const retrievedWorkoutPlan = responseGetWorkoutPlan.body as WorkoutPlanDto;

        expect(retrievedWorkoutPlan).toEqual(createdWorkoutPlan);

        return createdWorkoutPlan;
    }

async function createUser(userName: string, createdWorkoutPlan: WorkoutPlanDto): Promise<WorkoutSummaryDto> {
        const user = {
            userName: userName,
            workoutPlanId: createdWorkoutPlan.id
        } as UserDto;

        // create user
        const responseUser = await request(app)
            .post('/api/v1/user')
            .set('Content-Type', 'application/json')
            .send(user);

        expect(responseUser.statusCode).toBe(201);
        const createdWorkoutSummary = responseUser.body as WorkoutSummaryDto;

        const workoutSummary = await request(app)
            .get(`/api/v1/user/${createdWorkoutSummary.user.id}`)
            .set('Content-Type', 'application/json');

        expect(workoutSummary.statusCode).toBe(200);
        const retrievedWorkoutSummary = workoutSummary.body as WorkoutSummaryDto;
        expect(retrievedWorkoutSummary).toEqual(createdWorkoutSummary);

        return createdWorkoutSummary;
    }


    async function createAndValidateActivityRecord(workoutSummary: WorkoutSummaryDto, exercise: boolean, activityDate: Date) {
        const activityRecord = {
            userId: workoutSummary.user.id,
            activityType: 'running',
            description: 'Morning run',
            exercise: exercise,
            activityDate: activityDate
        } as ActivityRecordDto;


        const responseActivityRecord = await request(app)
            .post(`/api/v1/user/${workoutSummary.user.id}/activity`)
            .set('Content-Type', 'application/json')
            .send(activityRecord);

        expect(responseActivityRecord.statusCode).toBe(201);

        const updatedActivityRecord = responseActivityRecord.body as ActivityRecordDto;

        expect(updatedActivityRecord.id).toBeDefined();
        expect(updatedActivityRecord.userId).toEqual(workoutSummary.user.id);
        expect(updatedActivityRecord.activityType).toBe(activityRecord.activityType);
        expect(updatedActivityRecord.description).toBe(activityRecord.description);
        expect(updatedActivityRecord.exercise).toBe(activityRecord.exercise);
        expect(new Date(updatedActivityRecord.activityDate)).toBeInstanceOf(Date);

        const allActivitiesResponse = await request(app)
            .get(`/api/v1/user/${workoutSummary.user.id}/activity`)
            .set('Content-Type', 'application/json');

        expect(allActivitiesResponse.statusCode).toBe(200);
        const activities = allActivitiesResponse.body as ActivityRecordDto[];

        expect(activities.length).toBeGreaterThan(0);
        expect(activities[0]).toEqual(updatedActivityRecord);
    }

    async function addHistoricalDataToDB(userId: string) {
        await new Promise<void>((resolve, reject) => {
            db.serialize(() => {
                db.run(`
                INSERT INTO activity_record (id, user_id_ref, description, activity_type, exercise, activity_date)
                VALUES 
                ('a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5', '${userId}', 'Upper Body Power Day', 'strength', true, '${new Date(MOCK_TODAY_FRIDAY.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString()}'),
                ('b2c3d4e5-f6g7-5h8i-9j0k-l1m2n3o4p5q6', '${userId}', 'Morning 10k Run', 'cardio', true, '${new Date(MOCK_TODAY_FRIDAY.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()}');
            `);

                db.run(`
                UPDATE user 
                SET points = 95, level = 1, day_streak = 5
                WHERE id = '${userId}';
            `, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        });
    }

});

