import express from 'express';
import { userSchema } from '../dto/dto';
import { createUser, getAllUsers, getUserById, updateUser } from '../service/user-service';
export const userRouter = express.Router();
userRouter.post('/', async (req, res) => {
    const result = userSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: JSON.parse(result.error.message) });
    }
    const newUser = await createUser(result.data);
    res.status(201).json(newUser);
});
userRouter.get('/', async (req, res) => {
    // Here you would typically retrieve all users from a database
    // For demonstration, we will return a list with a double dummy user
    const users = await getAllUsers();
    res.status(200).json(users);
});
userRouter.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
    // Here you would typically retrieve the user's workout summary from a database
    // For demonstration, we will return a dummy summary
    const summary = await getUserById(userId);
    if (!summary) {
        return res.status(404).json({ error: `User with ID ${userId} not found` });
    }
    res.status(200).json(summary);
});
userRouter.put('/:userId', async (req, res) => {
    const userId = req.params.userId;
    const updatedData = userSchema.safeParse(req.body);
    if (!updatedData.success) {
        return res.status(400).json({ errors: JSON.parse(updatedData.error.message) });
    }
    // Here you would typically update the user's information in a database
    // For demonstration, we will return a success message with the provided data
    const updatedUser = await updateUser(userId, updatedData.data);
    res.status(200).json({ message: `User ${userId} updated`, data: updatedData });
});
//# sourceMappingURL=user-contoller.js.map