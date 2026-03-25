import { ActivityRecordDto, UserDto, WorkoutPlanDto } from "../dto/dto";
import { ActivityRecordEntity } from "../model/entities";

export function syncUserScores() {
    // 1. Fetch all users from the service -> user-service.getAllUsers()
    // 2. For each user, get its ActivityRecordsDto from the service -> user-activity-service.getUserActivities(userId)
    // 3. Calculate their score based on their activities and workout plan (fillMissedActivityGap)
    // 4. Update the user's score in the database - user-service.update(userId, userData) where userData contains updated score (points, level, dayStreak)
    // 5. Save "missed" activities to the database - user-activity-service.createActivityRecord(userId, activityRecord)
}


const weekDays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const;

function isActivityDay(workoutPlan: WorkoutPlanDto, day: Date): boolean {
    return workoutPlan.activityTypeByDay[weekDays[day.getDay()]].length > 0;
  }

function fillMissedActivityGap(user: UserDto, workoutPlan: WorkoutPlanDto, activities: ActivityRecordDto[]) {
    // 1. In loop from last activity date to current date, check if "day_i" is in the workout plan (isActivityDay(day_i) == true)
    // 3. If yes, create "missed" Activity with esercise = false and push to list of activities
    // 4. If not do nothing and continue to the next day
    if (activities.length === 0) {
      return;
    }

    const lastIndex = activities.length - 1;
    const lastActivityDate = new Date(activities[lastIndex].activityDate);
    lastActivityDate.setDate(lastActivityDate.getDate() + 1); // Start checking from the day after the last activity
    const currentDate = new Date();

    for (let d = new Date(lastActivityDate); d < currentDate; d.setDate(d.getDate() + 1)) {
      if (!isActivityDay(workoutPlan, d)) {
        continue;
      }
       const missedActivity = {
        id: crypto.randomUUID(),
        exercise: false,
        activityDate: new Date(d)
      } as ActivityRecordDto;

      activities.push(missedActivity);
    }
  }
