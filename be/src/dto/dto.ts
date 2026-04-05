import z from "zod";

export const activityTypeSchema = z.enum([
  'cardio',
  'boxing',
  'weight lifting',
  'swimming',
  'cycling',
  'yoga',
  'running',
  'hiking',
  'skying',
  'dancing',
  'ball games',
  'gymnastics',
  'calisthenics',
  'pilates',
  'crossfit',
  'powerlifting',
  'trx',
  'tennis',
  'golf',
  'climbing',
  'soccer',
  'basketball',
  'volleyball',
  'cricket',
  'baseball',
  'rugby',
  'american_football',
  'pickleball',
  'padel',
  'badminton',
  'table_tennis',
  'squash',
  'martial_arts',
  'mma',
  'jiu_jitsu',
  'muay_thai',
  'fencing',
  'archery',
  'rowing',
  'kayaking',
  'surfing',
  'skateboarding',
  'snowboarding',
  'ice_skating',
  'hockey',
  'lacrosse',
  'handball',
  'water_polo',
  'triathlon',
  'marathon',
  'barre',
  'zumba',
  'spinning',
  'kickboxing',
  'wrestling',
  'bodybuilding',
  'strongman',
  'parkour',
  'bouldering',
  'mountaineering',
  'trail_running',
  'nordic_walking',
  'horseback_riding',
  'sailing',
  'scuba_diving',
  'disc_golf',
  'bowling',
  'billiards',
  'darts',
  'cheerleading',
  'others'
]);
export type ActivityType = z.infer<typeof activityTypeSchema>;


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

export type ActivityTypeByDay = z.infer<typeof activityTypeByDaySchema>;

// Activity Record
export const activityRecordSchema = z.object({
    id: z.uuidv4().optional(),
    userId: z.uuidv4(),
    activityType: z.string().optional(),
    description: z.string().optional(),
    exercise: z.boolean().default(false),
    activityDate: z.date().default(() => new Date())
});

export type ActivityRecordDto = z.infer<typeof activityRecordSchema>;

// Score
export const scoreSchema = z.object({
    points: z.number().default(0),
    level: z.number().default(1),
    dayStreak: z.number().default(0)
});

export type ScoreDto = z.infer<typeof scoreSchema>;

// User
export const userSchema = z.object({
    id: z.uuidv4().optional(),
    workoutPlanId: z.uuidv4().optional(),
    userName: z.string()
});

export type UserDto = z.infer<typeof userSchema>;

// Workout Plan
export const workoutSchema = z.object({
    id: z.uuidv4().optional(),
    name: z.string(),
    description: z.string().optional(),
    activityTypeByDay: activityTypeByDaySchema
});

export type WorkoutPlanDto = z.infer<typeof workoutSchema>;


export type WorkoutSummaryDto = {
    user: UserDto;
    score?: ScoreDto;
    workoutPlan?: WorkoutPlanDto;
}

