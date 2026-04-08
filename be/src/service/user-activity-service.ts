import { activityRecordRepo } from "../dao/dao-factory";
import { ActivityRecordDto, ScoreDto } from "../dto/dto";
import { ActivityRecordEntity } from "../model/entities";
import { getLevelFromPoints, PENALTY_POINTS, recalculateAndUpdateUserScoreByUserId, REWARD_POINTS } from "./score-sync";
import { updateUser, updateUserScore } from "./user-service";

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

export async function createActivityRecordAndRecalculateScore(activityRecord: ActivityRecordDto): Promise<ActivityRecordDto> {
    // add "missed" activity revcords if any for the user
    const score = await recalculateAndUpdateUserScoreByUserId(activityRecord.userId);

    const activityRecordEntity = toActivityRecordEntity(activityRecord);
    await activityRecordRepo.create(activityRecordEntity);
    activityRecord.id = activityRecordEntity.id;

    if(score) {
        const points = score.points + (activityRecordEntity.exercise ? REWARD_POINTS : -PENALTY_POINTS);
        const level = getLevelFromPoints(points);
        const dayStreak = activityRecordEntity.exercise ? score.dayStreak + 1 : 0;
        updateUserScore(activityRecord.userId, {
            points: points,
            level: level,
            dayStreak: dayStreak
        } as ScoreDto);
    }
    
    return activityRecord;
};

export async function createActivityRecords(activityRecords: ActivityRecordDto[]) {
    await activityRecordRepo.create(activityRecords.map(toActivityRecordEntity));
}

export async function getUserActivities(userId: string): Promise<ActivityRecordDto[]> {
    const records = await activityRecordRepo.getActivitiesByUserId(userId);
    return records.map(record => toActivityRecordDto(record));

};

export async function deleteActivityRecord(recordId: string): Promise<void> {
    await activityRecordRepo.delete(recordId);
};


