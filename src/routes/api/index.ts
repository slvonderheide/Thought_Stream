import { Router } from 'express';
import { courseRouter } from './courseRoutes.js';
import thoughtsRouter from './thoughtRoutes.js';

const router = Router();

router.use('/courses', courseRouter);
router.use('/thoughts', thoughtsRouter);

export default router;
