import { Router } from 'express';
import { usersRouter } from './userRoutes.js';
import thoughtsRouter from './thoughtRoutes.js';

const router = Router();

router.use('/users', usersRouter);
router.use('/thoughts', thoughtsRouter);

export default router;
