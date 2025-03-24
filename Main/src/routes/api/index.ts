import { Router } from 'express';
import { courseRouter } from './courseRoutes.js';
import { thoughtsRouter } from './thoughtsRoutes.js';

const router = Router();

router.use('/courses', courseRouter);
router.use('/thoughtss', thoughtsRouter);

export default router;
