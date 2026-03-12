import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { User, WorkoutPlan, ActivityRecord } from '../src/model/model';
import { de, fa, tr } from 'zod/locales';
import e from 'express';


describe('User.fillMissedActivityGap()', () => {
  let workoutPlan: WorkoutPlan;
  const TODAY = new Date('2026-03-01'); // Set current date to March 1, 2026 (Sunday)

  beforeEach(() => {
    // Create a workout plan with activities on specific days
    jest.useFakeTimers().setSystemTime(TODAY);

    workoutPlan = new WorkoutPlan({
      id: '1',
      name: 'Weekly Plan',
      description: 'A workout plan with activities on specific days',
      activityTypeByDay: {
        MONDAY: ['cardio'],
        TUESDAY: ['strength'],
        WEDNESDAY: ['yoga','bicycle'],
        THURSDAY: [],
        FRIDAY: ['swimming'],
        SATURDAY: ['bicycle'],
        SUNDAY: []
      }
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should not create missed workouts when user has no activities', () => {
    const user = new User({
      id: '1',
      name: 'John Doe',
      workoutPlan: workoutPlan,
      activities: []
    });

    expect(user.activities.length).toBe(0);

    user.activities.length;
  });

  test('should not create missed workouts when no gap exists - first exercise is today', () => {
    const user = new User({
      id: '1',
      name: 'John Doe',
      workoutPlan: workoutPlan,
      activities: [
        new ActivityRecord({
          id: '1',
          activityType: 'cardio',
          exercise: true,
          activityDate: TODAY
        })
      ]
    });

    // Should only fill gaps up to today, which means no new activities
    expect(user.activities.length).toBe(1);
  });

  test('should create missed workouts for skipped workout days', () => {
    const lastActivityDate = new Date(TODAY);
    lastActivityDate.setDate(TODAY.getDate() - 7); //set last activity to last Sunday
    const user = new User({
      id: '1',
      name: 'John Doe',
      workoutPlan: workoutPlan,
      activities: [
        new ActivityRecord({
          id: '1',
          activityType: 'strength',
          exercise: true,
          activityDate: lastActivityDate
        })
      ]
    });

    // Should have: original activity + 5 missed activites (Monday, Tuesday, Thursday, Friday, Saturday)
    expect(user.activities.length).toBe(6);


    const expectedDate = new Date(lastActivityDate);
    user.activities.slice(1).forEach((activity, index) => {
      expect(activity.exercise).toBe(false);
      expect(activity.id).toBeDefined();
      expectedDate.setDate(expectedDate.getDate() + 1); 
      while (!user.workoutPlan.isActivityDay(expectedDate)) {
        expectedDate.setDate(expectedDate.getDate() + 1);
      }
      expect(activity.activityDate).toEqual(expectedDate);
    });

    // Verify that Thursday (no workout day) doesn't have a missed activity
    const thursdayMissed = user.activities.find(a => {
      const day = a.activityDate.getDay();
      return day === 4; // Thursday
    });
    expect(thursdayMissed).toBeUndefined();

  });
  
});


describe('User.getPoints()/getLevel()/getStreak()', () => {
  let workoutPlan: WorkoutPlan;
  const TODAY = new Date('2026-03-04'); // Set current date to March 4, 2026
  
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(TODAY);
  
    workoutPlan = new WorkoutPlan({
      id: '1',
      name: 'Weekly Plan',
      description: 'A workout plan with activities on specific days',
      activityTypeByDay: {
        MONDAY: ['cardio'],
        TUESDAY: ['strength'],
        WEDNESDAY: ['yoga','bicycle'],
        THURSDAY: [],
        FRIDAY: ['swimming'],
        SATURDAY: ['bicycle'],
        SUNDAY: []
      }
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should return 0 points for empty activites list', () => {
    const user = new User({
      id: '1',
      name: 'John Doe',
      workoutPlan: workoutPlan,
      activities: []
    });

    expect(user.getPoints()).toBe(0);
    expect(user.getLevel()).toBe(1);
    expect(user.getDayStreak()).toBe(0);
  });

   test('should calculate points for missed and exercised activities', () => {
    const user = new User({
      id: '1',
      name: 'John Doe',
      workoutPlan: workoutPlan,
      activities: [
        new ActivityRecord({
          id: '1',
          activityType: 'cardio',
          exercise: true,
          activityDate: new Date('2026-03-02') 
        }),
        new ActivityRecord({
          id: '2',
          activityType: 'strength',
          exercise: true,
          activityDate: new Date('2026-03-03') 
        }),
         new ActivityRecord({
          id: '3',
          activityType: 'strength',
          exercise: false,
          activityDate: new Date('2026-03-07') 
        }),
      ]
    });

    expect(user.getPoints()).toBe(15);
    expect(user.getLevel()).toBe(1);
    expect(user.getDayStreak()).toBe(0);
  });

  test('should calculate points for missed activities', () => {
    const user = new User({
      id: '1',
      name: 'John Doe',
      workoutPlan: workoutPlan,
      activities: [
        new ActivityRecord({
          id: '1',
          activityType: 'cardio',
          exercise: true,
          activityDate: new Date('2026-03-02') 
        }),
        new ActivityRecord({
          id: '2',
          activityType: 'strength',
          exercise: false,
          activityDate: new Date('2026-03-03') 
        }),
         new ActivityRecord({
          id: '3',
          activityType: 'strength',
          exercise: false,
          activityDate: new Date('2026-03-07') 
        }),
        new ActivityRecord({
          id: '4',
          activityType: 'strength',
          exercise: false,
          activityDate: new Date('2026-03-07') 
        }),
      ]
    });

    expect(user.getPoints()).toBe(0);
    expect(user.getLevel()).toBe(1);
    expect(user.getDayStreak()).toBe(0);
  });

 test('should calculate points for activities for level 2', () => {
  const user = new User({
      id: '1',
      name: 'John Doe',
      workoutPlan: workoutPlan,
      activities: [...Array(10)].map((_, i) => new ActivityRecord({
          id: `${i}`,
          activityType: 'strength',
          exercise: true,
          activityDate: new Date(`2026-03-${i + 1}`) 
        }))
    });

    expect(user.getPoints()).toBe(100);
    expect(user.getLevel()).toBe(2);
    expect(user.getDayStreak()).toBe(10);

    user.addActivity(new ActivityRecord({
      id: '11',
      activityType: 'strength',
      exercise: false,
      activityDate: new Date('2026-03-11') 
    }));
    expect(user.activities.length).toBe(11);
    expect(user.getPoints()).toBe(95);
    expect(user.getLevel()).toBe(1);
    expect(user.getDayStreak()).toBe(0);
  });
});


