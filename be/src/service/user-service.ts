import { ScoreDto, UserDto, WorkoutPlanDto, WorkoutSummaryDto } from '../dto/dto';

export function createUser(user: UserDto): WorkoutSummaryDto {
    // Here you would typically save the new user to a database and return the created user
    // For demonstration, we will return the provided user data with a generated ID
    user.id = crypto.randomUUID();
    return {
        user,
        score: { points: 0, level: 1, dayStreak: 0 } as ScoreDto,
        workoutPlan: { 
            id: crypto.randomUUID(), 
            name: 'Full Body Workout', 
            description: 'A comprehensive full body workout plan', 
            activityTypeByDay: {
                MONDAY: [],
                TUESDAY: [],
                WEDNESDAY: [],
                THURSDAY: [],
                FRIDAY: [],
                SATURDAY: [],
                SUNDAY: []
            } 
        } as WorkoutPlanDto
    } as WorkoutSummaryDto;
};

export function getAllUsers(): WorkoutSummaryDto[] {
    // Here you would typically retrieve all users from a database
    // For demonstration, we will return a list with a double dummy user
    return [
        {
            user: { id: 'user1', userName: 'John Doe' } as UserDto,
            score: { points: 100, level: 5, dayStreak: 10 } as ScoreDto,
            workoutPlan: { 
                id: crypto.randomUUID(), 
                name: 'Full Body Workout', 
                description: 'A comprehensive full body workout plan', 
                activityTypeByDay: {
                    MONDAY: ['cardio'],
                    TUESDAY: ['strength'],
                    WEDNESDAY: ['yoga'],
                    THURSDAY: [],
                    FRIDAY: ['swimming'],
                    SATURDAY: [],
                    SUNDAY: ['flexibility']
                } 
            } as WorkoutPlanDto
        } as WorkoutSummaryDto,
        {
            user: { id: 'user2', userName: 'Jane Smith' } as UserDto,
            score: { points: 150, level: 7, dayStreak: 15 } as ScoreDto,
            workoutPlan: { 
                id: 'plan2', 
                name: 'Cardio Blast', 
                description: 'An intense cardio workout plan', 
                activityTypeByDay: {
                    MONDAY: ['cardio'],
                    TUESDAY: ['cardio'],
                    WEDNESDAY: ['cardio'],
                    THURSDAY: [],
                    FRIDAY: ['cardio'],
                    SATURDAY: [],
                    SUNDAY: []
                } 
            } as WorkoutPlanDto
        } as WorkoutSummaryDto

    ] as WorkoutSummaryDto[];
};


export function getUserById(userId: string): WorkoutSummaryDto | null {
    // Here you would typically retrieve the user's workout summary from a database using the userId
    // For demonstration, we will return a dummy summary if the userId matches a specific value
    if (userId === 'user1') {
        return {
            user: { id: 'user1', userName: 'John Doe' } as UserDto,
            score: { points: 100, level: 5, dayStreak: 10 } as ScoreDto,
            workoutPlan: { 
                id: crypto.randomUUID(), 
                name: 'Full Body Workout', 
                description: 'A comprehensive full body workout plan', 
                activityTypeByDay: {
                    MONDAY: ['cardio'],
                    TUESDAY: ['strength'],
                    WEDNESDAY: ['yoga'],
                    THURSDAY: [],
                    FRIDAY: ['swimming'],
                    SATURDAY: [],
                    SUNDAY: ['flexibility']
                } 
            } as WorkoutPlanDto
        } as WorkoutSummaryDto;
    }
    return null;
};

export function updateUser(userId: string, userData: UserDto): WorkoutSummaryDto {
    return {
        user: userData ,
        score: { points: 120, level: 6, dayStreak: 12 } as ScoreDto,
        workoutPlan: { 
            id: crypto.randomUUID(), 
            name: 'Full Body Workout', 
            description: 'A comprehensive full body workout plan', 
            activityTypeByDay: {
                MONDAY: ['cardio'],
                TUESDAY: ['strength'],
                WEDNESDAY: ['yoga'],
                THURSDAY: [],
                FRIDAY: ['swimming'],
                SATURDAY: [],
                SUNDAY: ['flexibility']
            } 
        } as WorkoutPlanDto
    } as WorkoutSummaryDto;
}