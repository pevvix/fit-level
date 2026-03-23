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
}

export interface ActivityRecordEntity {
  id: string;
  user_id_ref: string;
  desription?: string; // Matching your schema typo
  activity_type?: string;
  exercise: number; // 0 or 1 for SQLite BOOLEAN
  activity_date?: string;
}

