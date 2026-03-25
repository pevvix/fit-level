import express from 'express';
import { workoutSchema } from '../dto/dto';
import { createWorkoutPlan, getAllWorkoutPlans, getWorkoutPlanById, updateWorkoutPlan } from '../service/workout-plan-service';
export const workoutRouter = express.Router();
workoutRouter.post('/', async (req, res) => {
    const result = workoutSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: JSON.parse(result.error.message) });
    }
    const newWorkoutPlan = await createWorkoutPlan(result.data);
    res.status(201).json(newWorkoutPlan);
});
workoutRouter.get('/', async (req, res) => {
    const workoutPlans = await getAllWorkoutPlans();
    res.status(200).json(workoutPlans);
});
workoutRouter.get('/:id', async (req, res) => {
    const workoutPlanId = req.params.id;
    const workoutPlan = await getWorkoutPlanById(workoutPlanId);
    if (!workoutPlan) {
        return res.status(404).json({ error: 'Workout plan not found' });
    }
    res.status(200).json(workoutPlan);
});
workoutRouter.put('/:id', async (req, res) => {
    const workoutPlanId = req.params.id;
    const result = workoutSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: JSON.parse(result.error.message) });
    }
    const updatedWorkoutPlan = await updateWorkoutPlan(workoutPlanId, result.data);
    res.status(200).json(updatedWorkoutPlan);
});
//# sourceMappingURL=workout-controller.js.map