export interface WorkoutPlanEntity {
    id: string;
    name: string;
    description?: string;
    activities_on_monday?: string;
    activities_on_tuesday?: string;
    activities_on_wednesday?: string;
    activities_on_thursday?: string;
    activities_on_friday?: string;
    activities_on_saturday?: string;
    activities_on_sunday?: string;
    created_at: string;
}
export interface UserEntity {
    id: string;
    name: string;
    workout_plan_id_ref?: string | null;
    points?: number;
    level?: number;
    day_streak?: number;
}
export interface ActivityRecordEntity {
    id: string;
    user_id_ref: string;
    description?: string;
    activity_type?: string;
    exercise: number;
    activity_date?: string;
}
//# sourceMappingURL=entities.d.ts.map