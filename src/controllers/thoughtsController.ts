// ObjectId() method for converting thoughtsId string into an ObjectId for querying database
import { ObjectId } from 'mongodb';
import { Thought, User as UsersModel } from '../models/index.js';
import { Request, Response } from 'express';

// TODO: Create an aggregate function to get the number of thoughts overall

export const headCount = async () => {
    try {
      const result = await Thought.aggregate([{ $count: 'totalThoughts' }]);
      return result.length > 0 ? result[0].totalThoughts : 0;
    } catch (error) {
      console.error('Error getting headcount:', error);
      return 0;
    }
  };
  

/**
 * GET All thoughts /thoughts
 * @returns an array of thoughts
*/
export const getAllThoughts = async (_req: Request, res: Response) => {
    try {
      const allThoughts = await Thought.find();
  
      if (allThoughts.length === 0) {
        return res.status(404).json({ message: 'No thoughts found.' });
      }
  
      const responseObj = {
        thoughts: allThoughts,
        headCount: await headCount(),
      };
  
      return res.json(responseObj);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  

/**
 * GET thoughts based on id /thoughts/:id
 * @param string id
 * @returns a single thoughts object
*/
export const getThoughtById = async (req: Request, res: Response) => {
    const { thoughtId } = req.params;
  
    if (!ObjectId.isValid(thoughtId)) {
      return res.status(400).json({ message: 'Invalid Thought ID.' });
    }
  
    try {
      const thought = await Thought.findById(thoughtId);
    
      if (!thought) {
        return res.status(404).json({ message: 'Thought not found' });
      }
  
      return res.json({ thought });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };
  

/**
 * POST thoughts /thoughts
 * @param object thoughts
 * @returns a single thoughts object
*/

export const createThought = async (req: Request, res: Response) => {
    try {
      const newThought = await Thought.create(req.body);
      return res.status(201).json(newThought);
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
  };
  
  
/**
 * DELETE thoughts based on id /thoughts/:id
 * @param string id
 * @returns string 
*/

export const deleteThought = async (req: Request, res: Response) => {
    const { thoughtId } = req.params;
  
    if (!ObjectId.isValid(thoughtId)) {
      return res.status(400).json({ message: 'Invalid Thought ID.' });
    }
  
    try {
        const thought = await Thought.findById(thoughtId);
        if (!thought) {
          return res.status(404).json({ message: 'Thought not found' });
        }
  
      const users = await UsersModel.findOneAndUpdate(
        { thoughts: thoughtId },
        { $pull: { thoughts: thoughtId } },
        { new: true }
      );
  
      if (!users) {
        console.warn(`Thought ${thoughtId} deleted, but no associated users found.`);
        return res.json({ message: 'Thought deleted, but no associated users found.' });
      }
  
      return res.json({ message: 'Thought successfully deleted.' });
    } catch (error: any) {
      console.error('Error deleting thought:', error);
      return res.status(500).json({ message: error.message });
    }
  };
  
