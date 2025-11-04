import express from 'express';
import { getAllUsers, getUser, deleteUser, updateAnyUser, updateOwnProfile } from '../controllers/userController.js';
import authorize from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.get('/', authorize(['admin']), getAllUsers);
userRouter.get('/:id', authorize(['admin', 'customer']), getUser);
userRouter.delete('/:id', authorize(['admin']), deleteUser);
userRouter.put('/profile', authorize(['admin', 'customer']), updateOwnProfile);
userRouter.put('/:id', authorize(['admin']), updateAnyUser);

export default userRouter;