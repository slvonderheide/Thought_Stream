import { Router } from 'express';
const router = Router();
import {
  getAllthoughtss,
  getthoughtsById,
  createthoughts,
  deletethoughts,
  addAssignment,
  removeAssignment,
} from '../../controllers/thoughtsController.js';

// /api/thoughtss
router.route('/').get(getAllthoughtss).post(createthoughts);

// /api/thoughtss/:thoughtsId
router.route('/:thoughtsId').get(getthoughtsById).delete(deletethoughts);

// /api/thoughtss/:thoughtsId/reactions
router.route('/:thoughtsId/reactions').post(addAssignment);

// /api/thoughtss/:thoughtsId/reactions/:assignmentId
router.route('/:thoughtsId/reactions/:assignmentId').delete(removeAssignment);

export { router as thoughtsRouter} ;
