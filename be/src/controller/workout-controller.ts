import express from 'express';
import { workoutSchema } from '../dto/dto';
import { createWorkoutPlan, getAllWorkoutPlans, getWorkoutPlanById, updateWorkoutPlan } from '../service/workout-plan-service';

export const workoutRouter = express.Router();

workoutRouter.post('/',async (req: express.Request, res: express.Response) => {
    const result =workoutSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ errors: JSON.parse(result.error.message) });
    }

    const newWorkoutPlan = createWorkoutPlan(result.data);
    
    res.status(201).json(newWorkoutPlan);
});

workoutRouter.get('/', async (req: express.Request, res: express.Response) => {
    // Here you would typically retrieve all workout plans from a database
    // For demonstration, we will return a list with a single dummy workout plan
    const workoutPlans = getAllWorkoutPlans();
    
    res.status(200).json(workoutPlans);
});


workoutRouter.get('/:id', async (req: express.Request, res: express.Response) => {
    const workoutPlanId = req.params.id as string;
    const workoutPlan = getWorkoutPlanById(workoutPlanId);
   
    if (!workoutPlan) {
        return res.status(404).json({ error: 'Workout plan not found' });
    }

    res.status(200).json(workoutPlan);
});

workoutRouter.put('/:id', async (req: express.Request, res: express.Response) => {
    const workoutPlanId = req.params.id as string;
    const result = workoutSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ errors: JSON.parse(result.error.message) });
    }

    const updatedWorkoutPlan = updateWorkoutPlan(workoutPlanId, result.data);
    
    res.status(200).json(updatedWorkoutPlan);
});