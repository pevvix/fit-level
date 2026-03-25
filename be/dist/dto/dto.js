import z from "zod";
export const activityTypeSchema = z.enum(['cardio', 'strength', 'swimming', 'bicycle', 'yoga', 'running', 'flexibility', 'others']);
//export type DayOfWeek = typeof weekDays[number];
export const activityTypeByDaySchema = z.object({
    MONDAY: z.array(activityTypeSchema),
    TUESDAY: z.array(activityTypeSchema),
    WEDNESDAY: z.array(activityTypeSchema),
    THURSDAY: z.array(activityTypeSchema),
    FRIDAY: z.array(activityTypeSchema),
    SATURDAY: z.array(activityTypeSchema),
    SUNDAY: z.array(activityTypeSchema)
});
// Activity Record
export const activityRecordSchema = z.object({
    id: z.uuidv4().optional(),
    userId: z.uuidv4(),
    activityType: z.string().optional(),
    description: z.string().optional(),
    exercise: z.boolean().default(false),
    activityDate: z.date().default(() => new Date())
});
// Score
export const scoreSchema = z.object({
    points: z.number().default(0),
    level: z.number().default(1),
    dayStreak: z.number().default(0)
});
// User
export const userSchema = z.object({
    id: z.uuidv4().optional(),
    workoutPlanId: z.uuidv4().optional(),
    userName: z.string()
});
// Workout Plan
export const workoutSchema = z.object({
    id: z.uuidv4().optional(),
    name: z.string(),
    description: z.string().optional(),
    activityTypeByDay: activityTypeByDaySchema
});
//# sourceMappingURL=dto.js.map