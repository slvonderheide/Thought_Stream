import { Router } from 'express';
const router = Router();
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../../controllers/usersController.js';

// /api/userss
router.route('/').get(getAllUsers).post(createUser);

// /api/userss/:usersId
router
  .route('/:usersId')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

export { router as usersRouter };
