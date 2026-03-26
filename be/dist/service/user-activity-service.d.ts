import { ActivityRecordDto } from "../dto/dto";
export declare function createActivityRecord(activityRecord: ActivityRecordDto): Promise<ActivityRecordDto>;
export declare function createActivityRecords(activityRecords: ActivityRecordDto[]): Promise<void>;
export declare function getUserActivities(userId: string): Promise<ActivityRecordDto[]>;
export declare function deleteActivityRecord(recordId: string): Promise<void>;
//# sourceMappingURL=user-activity-service.d.ts.map