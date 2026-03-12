
import { WorkoutPlan } from "../model/model";
import { WorkoutPlanDto } from "../dto/dto";

export function createWorkoutPlan(workoutPlan: WorkoutPlanDto): WorkoutPlanDto {
    const newWorkoutPlan = new WorkoutPlan({
        id: crypto.randomUUID(),
        name: workoutPlan.name,
        description: workoutPlan.description,
        activityTypeByDay: workoutPlan.activityTypeByDay
    });

    // Here you would typically save the newWorkoutPlan to a database

    workoutPlan.id = newWorkoutPlan.id; 
    return workoutPlan;
}

export function getAllWorkoutPlans(): WorkoutPlanDto[] {
    // Here you would typically retrieve all workout plans from a database
    // For demonstration, we will return a list with a single dummy workout plan
    return [
        {
            id: "dummy-id",
            name: "Dummy Workout Plan",
            description: "This is a dummy workout plan for testing.",
            activityTypeByDay: {
                MONDAY: ['cardio'],
                TUESDAY: ['strength'],
                WEDNESDAY: ['yoga'],
                THURSDAY: [],
                FRIDAY: ['swimming'],
                SATURDAY: [],
                SUNDAY: ['flexibility']
            }
        }
    ] as WorkoutPlanDto[];
}   

export function getWorkoutPlanById(id: string): WorkoutPlanDto | null{
    // Here you would typically retrieve the workout plan from a database using the id
    // For demonstration, we will return a dummy workout plan if the id matches a specific value
    return {
        id: "dummy-id",
        name: "Dummy Workout Plan",
        description: "This is a dummy workout plan for testing.",
        activityTypeByDay: {
            MONDAY: ['cardio'],
            TUESDAY: ['strength'],
            WEDNESDAY: ['yoga'],
            THURSDAY: [],
            FRIDAY: ['swimming'],
            SATURDAY: [],
            SUNDAY: ['flexibility']
        }
    } as WorkoutPlanDto;
}

export function updateWorkoutPlan(id: string, workoutPlan: WorkoutPlanDto): WorkoutPlanDto {
    // Here you would typically update the workout plan in a database using the id and the new data
    // For demonstration, we will return the updated workout plan with the same id
    return workoutPlan;
}   