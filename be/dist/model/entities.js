export const ActivityTypes = Object.freeze({
    CARDIO: 'cardio',
    STRENGTH: 'strength',
    SWIMMING: 'swimming',
    BICYCLE: 'bicycle',
    YOGA: 'yoga',
    RUNNING: 'running',
    FLEXIBILITY: 'flexibility',
    OTHERS: 'others'
});
export class WorkoutPlan {
    id;
    name;
    description;
    activityTypeByDay;
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.activityTypeByDay = data.activityTypeByDay || this.createBlankPlan();
    }
    createBlankPlan() {
        return {
            MONDAY: [],
            TUESDAY: [],
            WEDNESDAY: [],
            THURSDAY: [],
            FRIDAY: [],
            SATURDAY: [],
            SUNDAY: []
        };
    }
    static from(obj) {
        return new WorkoutPlan(obj);
    }
}
export class ActivityRecord {
    id;
    activeityType;
    duration;
    activityDate;
    constructor(data) {
        this.id = data.id;
        this.activeityType = data.activityType;
        this.duration = data.duration;
        this.activityDate = data.activityDate;
    }
    static from(obj) {
        return new ActivityRecord(obj);
    }
}
export class User {
    id;
    name;
    workoutPlan;
    activities;
    points;
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.workoutPlan = data.workoutPlan;
        this.activities = data.activities || [];
        this.points = data.points || 0;
    }
    getLevel() {
        if (this.points < 100) {
            return 'Beginner';
        }
        else if (this.points < 500) {
            return 'Intermediate';
        }
        else {
            return 'Advanced';
        }
    }
    static from(obj) {
        return new User(obj);
    }
}
//# sourceMappingURL=entities.js.map