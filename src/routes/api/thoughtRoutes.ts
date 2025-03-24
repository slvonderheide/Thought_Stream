import { Router } from 'express';
const router = Router();
import {
  getAllThoughts,
  getThoughtById,
  createThoughts,
  deleteThought,
} from '../../controllers/thoughtsController.js';

// /api/thoughts
router.route('/').get(getAllThoughts).post(createThoughts);

// /api/thoughts/:thoughtId
router.route('/:thoughtId').get(getThoughtById).delete(deleteThought);


export default router ;
