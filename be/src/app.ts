
import 'dotenv/config';
import express from 'express';
 import { workoutRouter } from './controller/workout-controller';
import cors from 'cors';
import { userRouter } from './controller/user-contoller';
import { activityRouter } from './controller/user-activity-controller';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/workout-plan", workoutRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/user/:userId/activity", activityRouter);


if (process.env.NODE_ENV !== 'test') {
  app.listen(3001);
}