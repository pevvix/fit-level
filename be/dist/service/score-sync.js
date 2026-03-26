import { getAllUsers, updateUserScore } from "./user-service";
import { createActivityRecords, getUserActivities } from "./user-activity-service";
export async function syncUserScores() {
    // 1. Fetch all users from the service -> user-service.getAllUsers()
    // 2. For each user, get its ActivityRecordsDto from the service -> user-activity-service.getUserActivities(userId)
    // 3. Calculate their score based on their activities and workout plan (fillMissedActivityGap)
    // 4. Update the user's score in the database - user-service.update(userId, userData) where userData contains updated score (points, level, dayStreak)
    // 5. Save "missed" activities to the database - user-activity-service.createActivityRecord(userId, activityRecord)
    const users = await getAllUsers();
    users.forEach(async (user) => {
        const activities = await getUserActivities(user.id);
        if (!user.workoutPlan) {
            return;
        }
        const sortedHistoricalActivities = activities.sort((a, b) => new Date(a.activityDate).getTime() - new Date(b.activityDate).getTime());
        const missedActivities = getMissedActivityGap(user.user, user.workoutPlan, sortedHistoricalActivities);
        const allActivities = [...sortedHistoricalActivities, ...missedActivities];
        createActivityRecords(missedActivities);
        updateUserScore(user.id, {
            points: getPoints(allActivities),
            level: getLevel(allActivities),
            dayStreak: getDayStreak(allActivities)
        });
    });
}
const weekDays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
function isActivityDay(workoutPlan, day) {
    return workoutPlan.activityTypeByDay[weekDays[day.getDay()]].length > 0;
}
function getMissedActivityGap(user, workoutPlan, sortedHistoricalActivities) {
    // 1. In loop from last activity date to current date, check if "day_i" is in the workout plan (isActivityDay(day_i) == true)
    // 3. If yes, create "missed" Activity with esercise = false and push to list of activities
    // 4. If not do nothing and continue to the next day
    const missedActivities = [];
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
            });
        }
    }
    return missedActivities;
}
function getDayStreak(activites) {
    if (activites.length === 0) {
        return 0;
    }
    // Count backwards from the most recent activity
    let currentStreak = 0;
    for (let i = activites.length - 1; i >= 0; i--) {
        const activity = activites[i];
        if (activity.exercise) {
            currentStreak++;
        }
        else {
            // Streak is broken, stop counting
            break;
        }
    }
    return currentStreak;
}
function getPoints(activites) {
    const totalPoints = activites.reduce((totalPoints, activity) => activity.exercise ? totalPoints + 10 : totalPoints - 5, 0);
    return totalPoints < 0 ? 0 : totalPoints;
}
function getLevel(activites) {
    const points = getPoints(activites);
    return Math.floor(points / 100) + 1;
}
//# sourceMappingURL=score-sync.js.map