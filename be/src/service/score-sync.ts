import { ActivityRecordDto, ScoreDto, UserDto, WorkoutPlanDto, WorkoutSummaryDto } from "../dto/dto";
import { getAllUserWorkoutSummaries, getUserWorkoutSummaryById, updateUserScore } from "./user-service";
import { createActivityRecords, getUserActivities } from "./user-activity-service";
import cron from 'node-cron';

// run every day at midnight to sync user scores based on their activities and workout plans
cron.schedule('0 0 * * *', syncUserScores);

export async function syncUserScores() {
  const workoutSummaries = await getAllUserWorkoutSummaries();
  workoutSummaries.forEach(async (workoutSummary) => recalculateAndUpdateUserScore(workoutSummary));
}

export async function recalculateAndUpdateUserScoreByUserId(userId: string) : Promise<ScoreDto | undefined> {
  const workoutSummary = await getUserWorkoutSummaryById(userId);
  if (workoutSummary) {
    return recalculateAndUpdateUserScore(workoutSummary);
  }
  return undefined;
}

export async function recalculateAndUpdateUserScore(workoutSummary: WorkoutSummaryDto): Promise<ScoreDto | undefined> {
  if (!workoutSummary.workoutPlan) {
    return workoutSummary.score;
  }
  const userId = workoutSummary.user.id as string;
  const activities = await getUserActivities(userId);

  const sortedHistoricalActivities = activities.sort((a, b) => new Date(a.activityDate).getTime() - new Date(b.activityDate).getTime());
  const missedActivities = getMissedActivityGap(workoutSummary.user, workoutSummary.workoutPlan, sortedHistoricalActivities);

  const allActivities = [...sortedHistoricalActivities, ...missedActivities];

  if (missedActivities && missedActivities.length > 0) {
    createActivityRecords(missedActivities);
  }

  const score = {
    points: getPoints(allActivities),
    level: getLevel(allActivities),
    dayStreak: getDayStreak(allActivities)
  } as ScoreDto;

  updateUserScore(userId, score);

  return score;
}

const weekDays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const;

function isActivityDay(workoutPlan: WorkoutPlanDto, day: Date): boolean {
  return workoutPlan.activityTypeByDay[weekDays[day.getDay()]].length > 0;
}

function getMissedActivityGap(user: UserDto, workoutPlan: WorkoutPlanDto, sortedHistoricalActivities: ActivityRecordDto[]): ActivityRecordDto[] {
  // 1. In loop from last activity date to current date, check if "day_i" is in the workout plan (isActivityDay(day_i) == true)
  // 3. If yes, create "missed" Activity with esercise = false and push to list of activities
  // 4. If not do nothing and continue to the next day

  const missedActivities: ActivityRecordDto[] = [];

  if (sortedHistoricalActivities.length === 0) {
    return missedActivities;
  }
  const lastActivity = sortedHistoricalActivities[sortedHistoricalActivities.length - 1];

  const lastActivityDate = new Date(lastActivity.activityDate);
  lastActivityDate.setDate(lastActivityDate.getDate() + 1); // Start checking from the day after the last activity
  const currentDate = new Date();

  for (let d = new Date(lastActivityDate); d < currentDate; d.setDate(d.getDate() + 1)) {
    if (isActivityDay(workoutPlan, d)) {
      missedActivities.push({
        userId: user.id,
        exercise: false,
        activityDate: new Date(d)
      } as ActivityRecordDto);
    }
  }

  return missedActivities;
}


function getDayStreak(activites: ActivityRecordDto[]): number {
  if (activites.length === 0) {
    return 0;
  }

  // Count backwards from the most recent activity
  let currentStreak = 0;
  for (let i = activites.length - 1; i >= 0; i--) {
    const activity = activites[i];
    if (activity.exercise) {
      currentStreak++;
    } else {
      // Streak is broken, stop counting
      break;
    }
  }

  return currentStreak;
}

export const REWARD_POINTS = 10;
export const PENALTY_POINTS = 5;

function getPoints(activites: ActivityRecordDto[]): number {
 
  const totalPoints = activites.reduce((totalPoints, activity) =>
    activity.exercise ? totalPoints + REWARD_POINTS : totalPoints - PENALTY_POINTS, 0);
  return totalPoints < 0 ? 0 : totalPoints;
}

function getLevel(activites: ActivityRecordDto[]): number {
  const points = getPoints(activites);
  return getLevelFromPoints(points);
}

export function getLevelFromPoints(points: number) : number {
  return Math.floor(points / 100) + 1;
}

