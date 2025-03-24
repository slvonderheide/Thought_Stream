// ObjectId() method for converting thoughtsId string into an ObjectId for querying database
import { ObjectId } from 'mongodb';
import { thoughts, Course } from '../models/index.js';
import { Request, Response } from 'express';

// TODO: Create an aggregate function to get the number of thoughts overall

export const headCount = async () => {
    try {
      const result = await thoughts.aggregate([{ $count: 'totalThoughts' }]);
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
      const allThoughts = await thoughts.find();
  
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
export const getThoughtsById = async (req: Request, res: Response) => {
    const { thoughtsId } = req.params;
  
    if (!ObjectId.isValid(thoughtsId)) {
      return res.status(400).json({ message: 'Invalid Thought ID.' });
    }
  
    try {
      const thought = await thoughts.findById(thoughtsId);
    
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

export const createThoughts = async (req: Request, res: Response) => {
    try {
      const newThought = await thoughts.create(req.body);
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

export const deleteThoughts = async (req: Request, res: Response) => {
    const { thoughtsId } = req.params;
  
    if (!ObjectId.isValid(thoughtsId)) {
      return res.status(400).json({ message: 'Invalid Thought ID.' });
    }
  
    try {
      const thought = await thoughts.findOneAndDelete({ _id: new ObjectId(thoughtsId) });
  
      if (!thought) {
        return res.status(404).json({ message: 'No such thought exists.' });
      }
  
      const course = await Course.findOneAndUpdate(
        { thoughts: thoughtsId },
        { $pull: { thoughts: thoughtsId } },
        { new: true }
      );
  
      if (!course) {
        console.warn(`Thought ${thoughtsId} deleted, but no associated course found.`);
        return res.json({ message: 'Thought deleted, but no associated course found.' });
      }
  
      return res.json({ message: 'Thought successfully deleted.' });
    } catch (error: any) {
      console.error('Error deleting thought:', error);
      return res.status(500).json({ message: error.message });
    }
  };
  
