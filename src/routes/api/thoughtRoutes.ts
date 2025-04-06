import { Router } from 'express';
const router = Router();
import {
  getAllThoughts,
  GetThoughtById,
  createThought,
  deleteThought,
} from '../../controllers/thoughtsController.js';

// /api/thoughts
router.route('/').get(getAllThoughts).post(createThought);

// /api/thoughts/:thoughtId
router.route('/:thoughtId').get(GetThoughtById).delete(deleteThought);


export default router ;
