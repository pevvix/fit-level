
import 'dotenv/config';
import express from 'express';
 import { workoutRouter } from './controller/workout-controller';
import cors from 'cors';
import { userRouter } from './controller/user-contoller';
import { activityRouter } from './controller/user-activity-controller';
import { syncUserScores } from './service/score-sync';

export const app = express();

// Sync scores at startup (non-test environment)
if (process.env.NODE_ENV !== 'test') {
  (async () => {
    try {
      await syncUserScores();
      console.log('syncUserScores completed');
    } catch (err: any) {
      console.error('syncUserScores failed:', err?.message || err);
    }
  })();
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/workout-plan", workoutRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/user/:userId/activity", activityRouter);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!res.headersSent) {
    let status = 500;
    let message = err.message || 'Internal Server Error';

    // Customize status based on error type
    if (err.message?.includes('not found')) {
      status = 404;
    } else if (err.message?.includes('UNIQUE constraint failed')) {
      status = 409;
    } else if (err.name === 'ZodError' || err.message?.includes('validation')) {
      status = 400;
    }

    res.status(status).json({ error: message });
  }
});


if (process.env.NODE_ENV !== 'test') {
  app.listen(3001);
}