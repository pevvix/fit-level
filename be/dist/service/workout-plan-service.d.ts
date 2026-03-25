import { WorkoutPlanDto } from "../dto/dto";
export declare function createWorkoutPlan(workoutPlan: WorkoutPlanDto): Promise<WorkoutPlanDto>;
export declare function getAllWorkoutPlans(): Promise<WorkoutPlanDto[]>;
export declare function getWorkoutPlanById(id: string): Promise<WorkoutPlanDto | null>;
export declare function updateWorkoutPlan(id: string, workoutPlan: WorkoutPlanDto): Promise<WorkoutPlanDto>;
//# sourceMappingURL=workout-plan-service.d.ts.map