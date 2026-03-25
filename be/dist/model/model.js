const weekDays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
class WorkoutPlan {
    id;
    name;
    description;
    activityTypeByDay;
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.activityTypeByDay = data.activityTypeByDay;
    }
    isActivityDay(day) {
        return this.activityTypeByDay[weekDays[day.getDay()]].length > 0;
    }
    static from(obj) {
        return new WorkoutPlan({
            id: obj.id,
            name: obj.name,
            description: obj.description,
            activityTypeByDay: obj.activityTypeByDay
        });
    }
}
class ActivityRecord {
    id;
    activeityType;
    description;
    exercise;
    activityDate;
    constructor(data) {
        this.id = data.id;
        this.activeityType = data.activityType;
        this.exercise = data.exercise;
        this.activityDate = data.activityDate;
    }
    static from(obj) {
        return new ActivityRecord(obj);
    }
}
class User {
    id;
    name;
    workoutPlan;
    _activities; // List of all activities performed by the user sorted by date
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.workoutPlan = data.workoutPlan;
        this._activities = data.activities;
        this.fillMissedActivityGap();
    }
    get activities() {
        // Return a readonly array so users can't push/pop items
        return this._activities;
    }
    addActivity(activity) {
        this.fillMissedActivityGap();
        this._activities.push(activity);
    }
    getDayStreak() {
        if (this._activities.length === 0) {
            return 0;
        }
        // Count backwards from the most recent activity
        let currentStreak = 0;
        for (let i = this._activities.length - 1; i >= 0; i--) {
            const activity = this._activities[i];
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
    getLevel() {
        const points = this.getPoints();
        return Math.floor(points / 100) + 1;
    }
    getPoints() {
        const totalPoints = this._activities.reduce((totalPoints, activity) => activity.exercise ? totalPoints + 10 : totalPoints - 5, 0);
        return totalPoints < 0 ? 0 : totalPoints;
    }
    fillMissedActivityGap() {
        // 1. In loop from last activity date to current date, check if "day_i" is in the workout plan (isActivityDay(day_i) == true)
        // 3. If yes, create "missed" Activity with esercise = false and push to list of activities
        // 4. If not do nothing and continue to the next day
        if (this._activities.length === 0) {
            return;
        }
        const lastIndex = this._activities.length - 1;
        const lastActivityDate = new Date(this._activities[lastIndex].activityDate);
        lastActivityDate.setDate(lastActivityDate.getDate() + 1); // Start checking from the day after the last activity
        const currentDate = new Date();
        for (let d = new Date(lastActivityDate); d < currentDate; d.setDate(d.getDate() + 1)) {
            if (!this.workoutPlan.isActivityDay(d)) {
                continue;
            }
            const missedActivity = new ActivityRecord({
                id: crypto.randomUUID(),
                exercise: false,
                activityDate: new Date(d)
            });
            this._activities.push(missedActivity);
        }
    }
    static from(obj) {
        return new User(obj);
    }
}
export {};
//# sourceMappingURL=model.js.map