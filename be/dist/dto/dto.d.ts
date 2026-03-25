import z from "zod";
export declare const activityTypeSchema: z.ZodEnum<{
    cardio: "cardio";
    strength: "strength";
    swimming: "swimming";
    bicycle: "bicycle";
    yoga: "yoga";
    running: "running";
    flexibility: "flexibility";
    others: "others";
}>;
export type ActivityType = z.infer<typeof activityTypeSchema>;
export declare const activityTypeByDaySchema: z.ZodObject<{
    MONDAY: z.ZodArray<z.ZodEnum<{
        cardio: "cardio";
        strength: "strength";
        swimming: "swimming";
        bicycle: "bicycle";
        yoga: "yoga";
        running: "running";
        flexibility: "flexibility";
        others: "others";
    }>>;
    TUESDAY: z.ZodArray<z.ZodEnum<{
        cardio: "cardio";
        strength: "strength";
        swimming: "swimming";
        bicycle: "bicycle";
        yoga: "yoga";
        running: "running";
        flexibility: "flexibility";
        others: "others";
    }>>;
    WEDNESDAY: z.ZodArray<z.ZodEnum<{
        cardio: "cardio";
        strength: "strength";
        swimming: "swimming";
        bicycle: "bicycle";
        yoga: "yoga";
        running: "running";
        flexibility: "flexibility";
        others: "others";
    }>>;
    THURSDAY: z.ZodArray<z.ZodEnum<{
        cardio: "cardio";
        strength: "strength";
        swimming: "swimming";
        bicycle: "bicycle";
        yoga: "yoga";
        running: "running";
        flexibility: "flexibility";
        others: "others";
    }>>;
    FRIDAY: z.ZodArray<z.ZodEnum<{
        cardio: "cardio";
        strength: "strength";
        swimming: "swimming";
        bicycle: "bicycle";
        yoga: "yoga";
        running: "running";
        flexibility: "flexibility";
        others: "others";
    }>>;
    SATURDAY: z.ZodArray<z.ZodEnum<{
        cardio: "cardio";
        strength: "strength";
        swimming: "swimming";
        bicycle: "bicycle";
        yoga: "yoga";
        running: "running";
        flexibility: "flexibility";
        others: "others";
    }>>;
    SUNDAY: z.ZodArray<z.ZodEnum<{
        cardio: "cardio";
        strength: "strength";
        swimming: "swimming";
        bicycle: "bicycle";
        yoga: "yoga";
        running: "running";
        flexibility: "flexibility";
        others: "others";
    }>>;
}, z.core.$strip>;
export type ActivityTypeByDay = z.infer<typeof activityTypeByDaySchema>;
export declare const activityRecordSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodUUID>;
    userId: z.ZodUUID;
    activityType: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    exercise: z.ZodDefault<z.ZodBoolean>;
    activityDate: z.ZodDefault<z.ZodDate>;
}, z.core.$strip>;
export type ActivityRecordDto = z.infer<typeof activityRecordSchema>;
export declare const scoreSchema: z.ZodObject<{
    points: z.ZodDefault<z.ZodNumber>;
    level: z.ZodDefault<z.ZodNumber>;
    dayStreak: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type ScoreDto = z.infer<typeof scoreSchema>;
export declare const userSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodUUID>;
    workoutPlanId: z.ZodOptional<z.ZodUUID>;
    userName: z.ZodString;
}, z.core.$strip>;
export type UserDto = z.infer<typeof userSchema>;
export declare const workoutSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodUUID>;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    activityTypeByDay: z.ZodObject<{
        MONDAY: z.ZodArray<z.ZodEnum<{
            cardio: "cardio";
            strength: "strength";
            swimming: "swimming";
            bicycle: "bicycle";
            yoga: "yoga";
            running: "running";
            flexibility: "flexibility";
            others: "others";
        }>>;
        TUESDAY: z.ZodArray<z.ZodEnum<{
            cardio: "cardio";
            strength: "strength";
            swimming: "swimming";
            bicycle: "bicycle";
            yoga: "yoga";
            running: "running";
            flexibility: "flexibility";
            others: "others";
        }>>;
        WEDNESDAY: z.ZodArray<z.ZodEnum<{
            cardio: "cardio";
            strength: "strength";
            swimming: "swimming";
            bicycle: "bicycle";
            yoga: "yoga";
            running: "running";
            flexibility: "flexibility";
            others: "others";
        }>>;
        THURSDAY: z.ZodArray<z.ZodEnum<{
            cardio: "cardio";
            strength: "strength";
            swimming: "swimming";
            bicycle: "bicycle";
            yoga: "yoga";
            running: "running";
            flexibility: "flexibility";
            others: "others";
        }>>;
        FRIDAY: z.ZodArray<z.ZodEnum<{
            cardio: "cardio";
            strength: "strength";
            swimming: "swimming";
            bicycle: "bicycle";
            yoga: "yoga";
            running: "running";
            flexibility: "flexibility";
            others: "others";
        }>>;
        SATURDAY: z.ZodArray<z.ZodEnum<{
            cardio: "cardio";
            strength: "strength";
            swimming: "swimming";
            bicycle: "bicycle";
            yoga: "yoga";
            running: "running";
            flexibility: "flexibility";
            others: "others";
        }>>;
        SUNDAY: z.ZodArray<z.ZodEnum<{
            cardio: "cardio";
            strength: "strength";
            swimming: "swimming";
            bicycle: "bicycle";
            yoga: "yoga";
            running: "running";
            flexibility: "flexibility";
            others: "others";
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type WorkoutPlanDto = z.infer<typeof workoutSchema>;
export type WorkoutSummaryDto = {
    user: UserDto;
    score?: ScoreDto;
    workoutPlan?: WorkoutPlanDto;
};
//# sourceMappingURL=dto.d.ts.map