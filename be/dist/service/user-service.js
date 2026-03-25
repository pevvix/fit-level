import { userRepo } from '../dao/dao-factory';
import { getWorkoutPlanById } from './workout-plan-service';
// import { getPoints, getLevel, getDayStreak } from './user-stats-service';
function toUserEntity(user) {
    return {
        id: user.id || crypto.randomUUID(),
        name: user.userName,
        workout_plan_id_ref: user.workoutPlanId
    };
}
function toUserDto(user) {
    return {
        id: user.id,
        userName: user.name,
        workoutPlanId: user.workout_plan_id_ref
    };
}
function toScore(userEntity) {
    return {
        points: userEntity.points || 0,
        level: userEntity.level || 1,
        dayStreak: userEntity.day_streak || 0
    };
}
async function toWorkoutSummaryDto(userEntity) {
    const user = toUserDto(userEntity);
    const score = toScore(userEntity);
    const workoutPlan = user.workoutPlanId ? await getWorkoutPlanById(user.workoutPlanId) : null;
    return {
        user: user,
        score: score,
        workoutPlan: workoutPlan,
    };
}
export async function createUser(userDto) {
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
export async function getAllUsers() {
    const userEntities = await userRepo.getAll();
    return await Promise.all(userEntities.map(user => toWorkoutSummaryDto(user)));
}
export async function getUserById(userId) {
    const userEntity = await userRepo.findById(userId);
    if (userEntity) {
        return await toWorkoutSummaryDto(userEntity);
    }
    return null;
}
export async function updateUser(userId, userData) {
    userData.id = userId;
    const userEntity = toUserEntity(userData);
    await userRepo.update(userEntity);
    return await toWorkoutSummaryDto(userEntity);
}
//# sourceMappingURL=user-service.js.map