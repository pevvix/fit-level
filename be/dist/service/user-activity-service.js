import { activityRecordRepo } from "../dao/dao-factory";
function toActivityRecordEntity(activityRecord) {
    return {
        id: activityRecord.id || crypto.randomUUID(),
        user_id_ref: activityRecord.userId,
        activity_type: activityRecord.activityType,
        description: activityRecord.description,
        exercise: activityRecord.exercise ? 1 : 0,
        activity_date: activityRecord.activityDate.toISOString()
    };
}
function toActivityRecordDto(activityRecord) {
    return {
        id: activityRecord.id,
        userId: activityRecord.user_id_ref,
        activityType: activityRecord.activity_type,
        description: activityRecord.description,
        exercise: !!activityRecord.exercise,
        activityDate: new Date(activityRecord.activity_date || new Date())
    };
}
export async function createActivityRecord(activityRecord) {
    const activityRecordEntity = toActivityRecordEntity(activityRecord);
    activityRecordRepo.create(activityRecordEntity);
    activityRecord.id = activityRecordEntity.id;
    return activityRecord;
}
;
export async function createActivityRecords(activityRecords) {
    activityRecordRepo.create(activityRecords.map(toActivityRecordEntity));
}
export async function getUserActivities(userId) {
    const records = await activityRecordRepo.getActivitiesByUserId(userId);
    return records.map(record => toActivityRecordDto(record));
}
;
export async function deleteActivityRecord(recordId) {
    await activityRecordRepo.delete(recordId);
}
;
//# sourceMappingURL=user-activity-service.js.map