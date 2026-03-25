import express from 'express';
import { activityRecordSchema } from '../dto/dto';
import { createActivityRecord, getUserActivities as getUserActivities } from '../service/user-activity-service';
export const activityRouter = express.Router({ mergeParams: true });
activityRouter.post('/', async (req, res) => {
    const userId = req.params.userId;
    const result = activityRecordSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: JSON.parse(result.error.message) });
    }
    const activityData = createActivityRecord(userId, result.data);
    res.status(201).json({ message: `Activity record added for user ${userId}`, data: activityData });
});
activityRouter.get('/', async (req, res) => {
    const userId = req.params.userId;
    const activities = await getUserActivities(userId);
    res.status(200).json(activities);
});
//# sourceMappingURL=user-activity-controller.js.map