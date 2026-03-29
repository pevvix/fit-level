import { ScoreDto, UserDto, WorkoutSummaryDto } from '../dto/dto';
import { userRepo } from '../dao/dao-factory';
import { UserEntity, } from '../model/entities';
import { getWorkoutPlanById } from './workout-plan-service';
// import { getPoints, getLevel, getDayStreak } from './user-stats-service';

function toUserEntity(user: UserDto): UserEntity {
    return {
        id: user.id || crypto.randomUUID(),
        name: user.userName,
        workout_plan_id_ref: user.workoutPlanId
    } as UserEntity;
}


function toUserDto(user: UserEntity): UserDto {
    return {
        id: user.id,
        userName: user.name,
        workoutPlanId: user.workout_plan_id_ref
    } as UserDto;
}

function toScoreDto(userEntity: UserEntity): ScoreDto {
    return {
        points: userEntity.points || 0,
        level: userEntity.level || 1,
        dayStreak: userEntity.day_streak || 0
    } as ScoreDto;
}

async function toWorkoutSummaryDto(userEntity: UserEntity): Promise<WorkoutSummaryDto> {
    const user = toUserDto(userEntity);
    const score = toScoreDto(userEntity);
    const workoutPlan = user.workoutPlanId ? await getWorkoutPlanById(user.workoutPlanId) : null;
    return {
        user: user,
        score: score,
        workoutPlan: workoutPlan,
    } as WorkoutSummaryDto;
}


export async function createUser(userDto: UserDto): Promise<WorkoutSummaryDto> {
    if (userDto.workoutPlanId) {
        const workoutPlan = await getWorkoutPlanById(userDto.workoutPlanId);
        if (!workoutPlan) {
            throw new Error(`Workout plan with ID ${userDto.workoutPlanId} not found`);
        }
    }
    let userEntity = toUserEntity(userDto);
    userEntity.id = crypto.randomUUID();
    await userRepo.create(userEntity);
    return await toWorkoutSummaryDto(userEntity);
}

export async function getAllUserWorkoutSummaries(): Promise<WorkoutSummaryDto[]> {
    const userEntities = await userRepo.getAll();
    return await Promise.all(userEntities.map(user => toWorkoutSummaryDto(user)));
}

export async function getUserWorkoutSummaryById(userId: string): Promise<WorkoutSummaryDto | null> {
    const userEntity = await userRepo.findById(userId);
    if (userEntity) {
        return await toWorkoutSummaryDto(userEntity);
    }
    return null;
}

export async function updateUser(userId: string, userData: UserDto): Promise<WorkoutSummaryDto> {
    userData.id = userId;
    const userEntity = toUserEntity(userData);
    await userRepo.updateUserDetails(userEntity);
    return await toWorkoutSummaryDto(userEntity);
}

export async function updateUserScore(userId: string, score: ScoreDto): Promise<void> {
   userRepo.updateUserScore(userId, score.points, score.level, score.dayStreak);
}


