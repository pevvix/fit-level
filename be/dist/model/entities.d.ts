export declare const ActivityTypes: Readonly<{
    readonly CARDIO: "cardio";
    readonly STRENGTH: "strength";
    readonly SWIMMING: "swimming";
    readonly BICYCLE: "bicycle";
    readonly YOGA: "yoga";
    readonly RUNNING: "running";
    readonly FLEXIBILITY: "flexibility";
    readonly OTHERS: "others";
}>;
export type ActivityType = typeof ActivityTypes[keyof typeof ActivityTypes];
type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
type ActivityTypeByDay = {
    [key in DayOfWeek]: ActivityType[];
};
interface WorkoutPlanData {
    id: string;
    name: string;
    description: string;
    activityTypeByDay?: ActivityTypeByDay;
}
export declare class WorkoutPlan {
    id: string;
    name: string;
    description: string;
    activityTypeByDay: ActivityTypeByDay;
    constructor(data: WorkoutPlanData);
    createBlankPlan(): ActivityTypeByDay;
    static from(obj: WorkoutPlanData): WorkoutPlan;
}
interface ActivityRecordData {
    id: string;
    activityType: ActivityType;
    duration: number;
    activityDate: Date | string;
}
export declare class ActivityRecord {
    id: string;
    activeityType: ActivityType;
    duration: number;
    activityDate: Date | string;
    constructor(data: ActivityRecordData);
    static from(obj: ActivityRecordData): ActivityRecord;
}
interface UserData {
    id: string;
    name: string;
    workoutPlan: WorkoutPlan;
    activities?: ActivityRecord[];
    points?: number;
}
export declare class User {
    id: string;
    name: string;
    workoutPlan: WorkoutPlan;
    activities: ActivityRecord[];
    points: number;
    constructor(data: UserData);
    getLevel(): string;
    static from(obj: UserData): User;
}
export {};
//# sourceMappingURL=entities.d.ts.map