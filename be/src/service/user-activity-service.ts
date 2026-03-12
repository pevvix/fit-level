import { ActivityRecordDto } from "../dto/dto";

export function createActivityRecord(userId: string, activityRecord: ActivityRecordDto): ActivityRecordDto {
    return {
        id: 'activity1',
        userId,
        activityType: activityRecord.activityType,
        description: activityRecord.description,
        exercise: activityRecord.exercise,
        activityDate: activityRecord.activityDate
    };
};

export function getUserActivity(userId: string): ActivityRecordDto[] {
    return [
        {
            id: crypto.randomUUID(),
            userId,
            activityType: 'cardio',
            description: '30 minutes of running',
            exercise: true,
            activityDate: new Date()
        }
    ] as ActivityRecordDto[];
};