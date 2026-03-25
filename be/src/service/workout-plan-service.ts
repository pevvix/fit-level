import { WorkoutPlanDto } from "../dto/dto";
import { workoutPlanRepo } from "../dao/dao-factory";
import { WorkoutPlanEntity } from "../model/entities";


function toWorkoutPlanEntity(workoutPlan: WorkoutPlanDto): WorkoutPlanEntity {
    return {
        id: workoutPlan.id || crypto.randomUUID(),
        name: workoutPlan.name,
        description: workoutPlan.description,
        activities_on_monday: JSON.stringify(workoutPlan.activityTypeByDay.MONDAY),
        activities_on_tuesday: JSON.stringify(workoutPlan.activityTypeByDay.TUESDAY),
        activities_on_wednesday: JSON.stringify(workoutPlan.activityTypeByDay.WEDNESDAY),
        activities_on_thursday: JSON.stringify(workoutPlan.activityTypeByDay.THURSDAY),
        activities_on_friday: JSON.stringify(workoutPlan.activityTypeByDay.FRIDAY),
        activities_on_saturday: JSON.stringify(workoutPlan.activityTypeByDay.SATURDAY),
        activities_on_sunday: JSON.stringify(workoutPlan.activityTypeByDay.SUNDAY),
        created_at: new Date().toISOString()
    } as WorkoutPlanEntity;
}

function toWorkoutPlanDto(plan: WorkoutPlanEntity): WorkoutPlanDto {
    return {
        id: plan.id,
        name: plan.name,
        description: plan.description,
        activityTypeByDay: {
            MONDAY: JSON.parse(plan.activities_on_monday || '[]'),
            TUESDAY: JSON.parse(plan.activities_on_tuesday || '[]'),
            WEDNESDAY: JSON.parse(plan.activities_on_wednesday || '[]'),
            THURSDAY: JSON.parse(plan.activities_on_thursday || '[]'),
            FRIDAY: JSON.parse(plan.activities_on_friday || '[]'),
            SATURDAY: JSON.parse(plan.activities_on_saturday || '[]'),
            SUNDAY: JSON.parse(plan.activities_on_sunday || '[]')
        }
    } as WorkoutPlanDto;
}

export async function createWorkoutPlan(workoutPlan: WorkoutPlanDto): Promise<WorkoutPlanDto> {
    workoutPlan.id = crypto.randomUUID();
    await workoutPlanRepo.create(toWorkoutPlanEntity(workoutPlan));
    return workoutPlan;
}

export async function getAllWorkoutPlans(): Promise<WorkoutPlanDto[]> {
    const plans = await workoutPlanRepo.getAll();
    return plans.map(plan => toWorkoutPlanDto(plan));
}

export async function getWorkoutPlanById(id: string): Promise<WorkoutPlanDto | null> {
    const plan = await workoutPlanRepo.findById(id);
    if (plan) {
        return toWorkoutPlanDto(plan);
    }
    return null;
}

export async function updateWorkoutPlan(id: string, workoutPlan: WorkoutPlanDto): Promise<WorkoutPlanDto> {
    workoutPlan.id = id;
    await workoutPlanRepo.update(toWorkoutPlanEntity(workoutPlan));
    return workoutPlan;
}   