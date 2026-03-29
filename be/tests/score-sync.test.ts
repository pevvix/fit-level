import { jest, test, expect, describe, beforeEach, afterEach } from '@jest/globals';
import { UserDto, WorkoutPlanDto, ActivityRecordDto, WorkoutSummaryDto } from '../src/dto/dto';
import { fa } from 'zod/locales';

// 1. Setup the mocks FIRST
jest.unstable_mockModule('../src/service/user-service', () => ({
    getAllUserWorkoutSummaries: jest.fn(),
    updateUserScore: jest.fn(),
}));

jest.unstable_mockModule('../src/service/user-activity-service', () => ({
    createActivityRecords: jest.fn(),
    getUserActivities: jest.fn(),
}));

// 2. Use DYNAMIC imports (await import) AFTER the mocks are defined. 
// Do not use "import x from y" here.
const userService = await import('../src/service/user-service');
const activityService = await import('../src/service/user-activity-service');
const { syncUserScores } = await import('../src/service/score-sync');

const MOCK_TODAY_SUNDAY = new Date('2026-03-01T00:00:00.000Z');

describe('syncUserScores with Mocked Date', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(MOCK_TODAY_SUNDAY);
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    const mockUser: UserDto = { id: 'user-123', userName: 'Artur' };
    const mockWorkoutPlan: WorkoutPlanDto = {
        id: 'plan-123',
        name: 'Daily Grind',
        activityTypeByDay: {
            MONDAY: ['cardio'],
            TUESDAY: ['strength'],
            WEDNESDAY: [],
            THURSDAY: [],
            FRIDAY: ['swimming'],
            SATURDAY: [],
            SUNDAY: []
        }
    };
    const mockActivityRecordPrevSunday: ActivityRecordDto = {
        userId: 'user-123',
        exercise: true,
        activityDate: new Date(MOCK_TODAY_SUNDAY.getTime() - 7 * 24 * 60 * 60 * 1000)
    };
    const mockActivityRecordPrevTuesday: ActivityRecordDto = {
        userId: 'user-123',
        exercise: true,
        // TUESDAY
        activityDate: new Date(MOCK_TODAY_SUNDAY.getTime() - 5 * 24 * 60 * 60 * 1000)
    };

    test('should not do anything because workout plan is not set', async () => {
        const mockWorkoutSummary = {
            user: mockUser
        } as WorkoutSummaryDto;

        jest.mocked(userService.getAllUserWorkoutSummaries).mockResolvedValue([mockWorkoutSummary as WorkoutSummaryDto]);

        await syncUserScores();

        expect(userService.getAllUserWorkoutSummaries).toHaveBeenCalledTimes(1);
        expect(activityService.getUserActivities).not.toHaveBeenCalled();
        expect(activityService.createActivityRecords).not.toHaveBeenCalled();
        expect(userService.updateUserScore).not.toHaveBeenCalled();
    });


    test('should detect that Friday activity is missed and calculate user scores', async () => {
        const mockWorkoutSummary = {
            id: 'summary-1',
            user: mockUser,
            workoutPlan: mockWorkoutPlan
        };

        jest.mocked(userService.getAllUserWorkoutSummaries).mockResolvedValue([mockWorkoutSummary as WorkoutSummaryDto]);
        jest.mocked(activityService.getUserActivities).mockResolvedValue([mockActivityRecordPrevSunday, mockActivityRecordPrevTuesday]);

        await syncUserScores();

        expect(userService.getAllUserWorkoutSummaries).toHaveBeenCalledTimes(1);
        expect(activityService.getUserActivities).toHaveBeenCalledTimes(1);
        expect(activityService.createActivityRecords).toHaveBeenCalledWith(expect.arrayContaining([
            {
                userId: 'user-123',
                exercise: false,
                // FRIDAY (missed)
                activityDate: new Date(MOCK_TODAY_SUNDAY.getTime() - 2 * 24 * 60 * 60 * 1000)
            }
        ]));

        expect(userService.updateUserScore).toHaveBeenCalledWith('user-123', {
            points: 15,
            level: 1,
            dayStreak: 0
        });
    });



    test('should give user level 2, 110 points and day streak 11 for completing all activities in row', async () => {
        const mockWorkoutSummary = {
            id: 'summary-1',
            user: mockUser,
            workoutPlan: mockWorkoutPlan
        };

        const mockActivityRecordPrevFriday: ActivityRecordDto = {
            userId: 'user-123',
            exercise: true,
            // FRIDAY
            activityDate: new Date(MOCK_TODAY_SUNDAY.getTime() - 2 * 24 * 60 * 60 * 1000)
        };

        const mockActivityRecordPrevThursday: ActivityRecordDto = {
            userId: 'user-123',
            exercise: true,
            // THURSDAY
            activityDate: new Date(MOCK_TODAY_SUNDAY.getTime() - 3 * 24 * 60 * 60 * 1000)
        };

        const mockActivityRecordPrevMonday: ActivityRecordDto = {
            userId: 'user-123',
            exercise: true,
            // MONDAY
            activityDate: new Date(MOCK_TODAY_SUNDAY.getTime() - 6 * 24 * 60 * 60 * 1000)
        };

        jest.mocked(userService.getAllUserWorkoutSummaries).mockResolvedValue([mockWorkoutSummary as WorkoutSummaryDto]);

        const mockActivityRecords = [];
        for (let i = 1; i <= 11; i++) {
            mockActivityRecords.push({
                userId: 'user-123',
                exercise: true,
                activityDate: new Date(MOCK_TODAY_SUNDAY.getTime() - i * 24 * 60 * 60 * 1000)
            } as ActivityRecordDto);
        }
        jest.mocked(activityService.getUserActivities).mockResolvedValue(mockActivityRecords);

        await syncUserScores();

        expect(userService.updateUserScore).toHaveBeenCalledWith('user-123', {
            points: 110,
            level: 2,
            dayStreak: 11,
        });
    });

    test('should give user 0 points, level 1 and day streak 0 if all activities are missed ,not going to negative points)', async () => {
        const mockWorkoutSummary = {
            id: 'summary-1',
            user: mockUser,
            workoutPlan: mockWorkoutPlan
        };

        const mockActivityRecordPrevFriday: ActivityRecordDto = {
            userId: 'user-123',
            exercise: false,
            // FRIDAY
            activityDate: new Date(MOCK_TODAY_SUNDAY.getTime() - 2 * 24 * 60 * 60 * 1000)
        };


        const mockActivityRecordPrevThursday: ActivityRecordDto = {
            userId: 'user-123',
            exercise: false,
            // THURSDAY
            activityDate: new Date(MOCK_TODAY_SUNDAY.getTime() - 3 * 24 * 60 * 60 * 1000)
        };

        const mockActivityRecordPrevMonday: ActivityRecordDto = {
            userId: 'user-123',
            exercise: false,
            // MONDAY
            activityDate: new Date(MOCK_TODAY_SUNDAY.getTime() - 6 * 24 * 60 * 60 * 1000)
        };

        jest.mocked(userService.getAllUserWorkoutSummaries).mockResolvedValue([mockWorkoutSummary as WorkoutSummaryDto]);
        jest.mocked(activityService.getUserActivities).mockResolvedValue([
            mockActivityRecordPrevMonday,
            mockActivityRecordPrevThursday,
            mockActivityRecordPrevFriday
        ]);

        await syncUserScores();

        expect(userService.updateUserScore).toHaveBeenCalledWith('user-123', {
            points: 0,
            level: 1,
            dayStreak: 0,
        });
    });


    test('user has done 4 activities in a row, then missed 1 and did 1, should have 45 points, level 1 and day streak 1', async () => {

        const mockWorkoutSummary = {
            id: 'summary-1',
            user: mockUser,
            workoutPlan: mockWorkoutPlan
        };

        const mockActivityRecords = [];
        for (let i = 0; i < 6; i++) {
            mockActivityRecords.push({
                userId: 'user-123',
                exercise: true,
                activityDate: new Date(MOCK_TODAY_SUNDAY.getTime() - (2 + i * 7) * 24 * 60 * 60 * 1000)
            } as ActivityRecordDto);
        }
        mockActivityRecords[1].exercise = false; // Miss the second activity 

        jest.mocked(userService.getAllUserWorkoutSummaries).mockResolvedValue([mockWorkoutSummary as WorkoutSummaryDto]);
        jest.mocked(activityService.getUserActivities).mockResolvedValue(mockActivityRecords);

        await syncUserScores();

        expect(userService.updateUserScore).toHaveBeenCalledWith('user-123', {
            points: 45,
            level: 1,
            dayStreak: 1,
        });


    });

});