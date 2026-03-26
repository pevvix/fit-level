import express from 'express';
import { activityRecordSchema } from '../dto/dto';
import { createActivityRecord, getUserActivities } from '../service/user-activity-service';


export const activityRouter = express.Router({ mergeParams: true });

activityRouter.post('/', async (req: express.Request, res: express.Response) => {  
    const  userId  = req.params.userId as string;
    const result = activityRecordSchema.safeParse(req.body);
    
    if (!result.success) {
        return res.status(400).json({ errors: JSON.parse(result.error.message) });
    }

    if(userId !== result.data.userId) {
        return res.status(400).json({ error: `User ID in the path (${userId}) does not match user ID in the body (${result.data.userId})` });
    }

    const activityData = createActivityRecord(result.data);

    res.status(201).json({ message: `Activity record added for user ${userId}`, data: activityData });
});

activityRouter.get('/', async (req: express.Request, res: express.Response) => {
    const  userId  = req.params.userId as string;

    const activities = await getUserActivities(userId);

    res.status(200).json(activities);
});
