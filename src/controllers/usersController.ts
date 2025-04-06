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
  try {
    const user = await User.findOne({_id: req.params.userId})
    .select('-_v');
    if (!user) {
      return res.status(404).json({ message: 'No user with that ID' });
      } else {
        return res.json(user);
      }
    } catch (err) {
      return res.status(500).json(err);
  }
};


export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = await User.create(req.body);
    return res.status(201).json(newUser);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};


export const updateUser = async (req: Request, res: Response) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
     req.params.userId,
     req.body,
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


export const deleteUser = async (req: Request, res: Response) => {

  try {
    const user = await User.findByIdAndDelete({_id: req.params.userId});

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete associated thoughts using user.thoughts
    await Thought.deleteMany({ userId: req.params.userId });

    return res.json({ message: 'User and associated thoughts deleted successfully!' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

 // Add a friend to a user's friend list
 export const addFriend = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $addToSet: { friends: req.params.friendId } }, // Add friendId to the friends array if it doesn't already exist
      { new: true } 
    );

    if (!user) {
      return res.status(404).json({ message: 'No user with that ID' });
    }

    return res.json({ message: 'Friend added successfully!', user });
  } catch (err) {
    return res.status(500).json(err);
  }
};

// Remove a friend from a user's friend list
export const removeFriend = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } }, // Remove friendId from the friends array
      { new: true } 
    );

    if (!user) {
      return res.status(404).json({ message: 'No user with that ID' });
    }

    return res.json({ message: 'Friend removed successfully!', user });
  } catch (err) {
    return res.status(500).json(err);
  }
};