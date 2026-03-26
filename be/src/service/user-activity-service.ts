import e from "express";
import { activityRecordRepo } from "../dao/dao-factory";
import { ActivityRecordDto } from "../dto/dto";
import { ActivityRecordEntity } from "../model/entities";

function toActivityRecordEntity(activityRecord: ActivityRecordDto): ActivityRecordEntity {
    return {
        id: activityRecord.id || crypto.randomUUID(),
        user_id_ref: activityRecord.userId,
        activity_type: activityRecord.activityType,
        description: activityRecord.description,
        exercise: activityRecord.exercise ? 1 : 0,
        activity_date: activityRecord.activityDate.toISOString()
    } as ActivityRecordEntity;
}


function toActivityRecordDto(activityRecord: ActivityRecordEntity): ActivityRecordDto {
    return {
        id: activityRecord.id,
        userId: activityRecord.user_id_ref,
        activityType: activityRecord.activity_type,
        description: activityRecord.description,
        exercise: !!activityRecord.exercise,
        activityDate: new Date(activityRecord.activity_date || new Date())
    } as ActivityRecordDto;
}

export async function createActivityRecord(activityRecord: ActivityRecordDto): Promise<ActivityRecordDto> {
    const activityRecordEntity = toActivityRecordEntity(activityRecord);
    activityRecordRepo.create(activityRecordEntity);
    activityRecord.id = activityRecordEntity.id;
    return activityRecord;
};

export async function createActivityRecords(activityRecords: ActivityRecordDto[]) {
    activityRecordRepo.create(activityRecords.map(toActivityRecordEntity));
}

export async function getUserActivities(userId: string): Promise<ActivityRecordDto[]> {
    const records = await activityRecordRepo.getActivitiesByUserId(userId);
    return records.map(record => toActivityRecordDto(record));

};

export async function deleteActivityRecord(recordId: string): Promise<void> {
    await activityRecordRepo.delete(recordId);
};


