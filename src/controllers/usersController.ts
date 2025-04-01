import { Request, Response } from 'express';
import { User, Thought } from '../models/index.js';


export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST create a new user
 * @param username, email
 * @returns Created user object
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * PUT update user details by ID
 * @param userId
 * @returns Updated user object
 */
export const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(updatedUser);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * DELETE user and associated thoughts
 * @param userId
 * @returns Deletion confirmation message
 */
export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete associated thoughts using user.thoughts
    await Thought.deleteMany({ _id: { $in: user.thoughts } });

    return res.json({ message: 'User and associated thoughts deleted successfully!' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
