import { ActivityRecordDto, ScoreDto, UserDto, WorkoutPlanDto, WorkoutSummaryDto } from "../dto/dto";
import { getAllUserWorkoutSummaries, getUserWorkoutSummaryById, updateUserScore } from "./user-service";
import { createActivityRecords, getUserActivities, getUserLastActivity } from "./user-activity-service";
import cron from 'node-cron';

// run every day at midnight to sync user scores based on their activities and workout plans
cron.schedule('0 0 * * *', recalculateUserScores);

const EMPTY_SCORE = {
  points: 0,
  level: 1,
  dayStreak: 0
} as ScoreDto;

export async function recalculateUserScores() {
  const workoutSummaries = await getAllUserWorkoutSummaries();
  workoutSummaries.forEach(async (workoutSummary) => recalculateAndUpdateUserScore(workoutSummary));
}

export async function recalculateAndUpdateUserScoreByUserId(userId: string, fromUserLastActivity: boolean = true): Promise<ScoreDto> {
  const workoutSummary = await getUserWorkoutSummaryById(userId);
  if (workoutSummary) {
    return recalculateAndUpdateUserScore(workoutSummary, fromUserLastActivity);
  }
  return EMPTY_SCORE;
}

export async function recalculateAndUpdateUserScore(workoutSummary: WorkoutSummaryDto, fromUserLastActivity: boolean = true): Promise<ScoreDto> {
  if (!workoutSummary.workoutPlan) {
    return EMPTY_SCORE;
  }
  const userId = workoutSummary.user.id as string;

  let activities: ActivityRecordDto[] = [];
  if (fromUserLastActivity) {
    const lastActivity = await getUserLastActivity(userId)
    if (lastActivity) {
      activities = [lastActivity];
    }
  }
  else {
    activities = await getUserActivities(userId);
  }

  const sortedHistoricalActivities = activities.sort((a, b) => new Date(a.activityDate).getTime() - new Date(b.activityDate).getTime());
  const missedActivities = getMissedActivityGap(workoutSummary.user, workoutSummary.workoutPlan, sortedHistoricalActivities);
  if (missedActivities && missedActivities.length > 0) {
    createActivityRecords(missedActivities);
  }

  const activitiesToScoreCalculation = fromUserLastActivity ? missedActivities : [...sortedHistoricalActivities, ...missedActivities];

  const points = calculatePoints(activitiesToScoreCalculation, fromUserLastActivity ? (workoutSummary.score?.points || 0) : 0);
  const dayStreak = calculateDayStreak(activitiesToScoreCalculation, fromUserLastActivity ? (workoutSummary.score?.dayStreak || 0) : 0);
  const level = calculateLevel(points);

  const score = { points: points, level: level, dayStreak: dayStreak } as ScoreDto;

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


function calculateDayStreak(activites: ActivityRecordDto[], currentStreak: number = 0): number {
  if (activites.length === 0) {
    return currentStreak;
  }

  // Count backwards from the most recent activity
  let streak = 0;
  for (let i = activites.length - 1; i >= 0; i--) {
    const activity = activites[i];
    if (activity.exercise) {
      streak++;
    } else {
      return streak; // Streak is broken, stop counting
    }
  }

  return streak + currentStreak;
}

export const REWARD_POINTS = 10;
export const PENALTY_POINTS = 5;

function calculatePoints(activites: ActivityRecordDto[], initialPoints: number = 0): number {
  const totalPoints = activites.reduce((totalPoints, activity) =>
    activity.exercise ? totalPoints + REWARD_POINTS : totalPoints - PENALTY_POINTS, initialPoints);
  return totalPoints < 0 ? 0 : totalPoints;
}

export function calculateLevel(points: number): number {
  return Math.floor(points / 100) + 1;
}

