import express from 'express';
import { activityRecordSchema } from '../dto/dto';
import { createActivityRecord, getUserActivity } from '../service/user-activity-service';


export const activityRouter = express.Router();

activityRouter.post('/', async (req: express.Request, res: express.Response) => {  
    const  userId  = req.params.userId as string;
    const result = activityRecordSchema.safeParse(req.body);
    
    if (!result.success) {
        return res.status(400).json({ errors: JSON.parse(result.error.message) });
    }

    const activityData = createActivityRecord(userId, result.data);

    res.status(201).json({ message: `Activity record added for user ${userId}`, data: activityData });
});

activityRouter.get('/', async (req: express.Request, res: express.Response) => {
    const  userId  = req.params.userId as string;

    const activity = getUserActivity(userId);

    res.status(200).json(activity);
});
