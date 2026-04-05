import request from 'supertest';

import { app } from '../src/app.js';
import { WorkoutPlanDto } from '../src/dto/dto.js';
import { db } from '../src/dao/dao-factory.js';

describe('Fit level full test', () => {

    beforeEach(() => {
        db.serialize(() => ["activity_record", "user", "workout_plan"].forEach(t => db.run(`DELETE FROM ${t}`)));
    });

    afterAll(async () => await db.close());

    it('create workout plan, user and calculate score ', async () => {
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

        const response = await request(app)
            .post('/api/v1/workout-plan')
            .set('Content-Type', 'application/json')
            .send(workoutPlan);

        // Assertions
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');

    });

});