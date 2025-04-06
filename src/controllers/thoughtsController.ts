// ObjectId() method for converting thoughtsId string into an ObjectId for querying database
//import { ObjectId } from 'mongodb';
import { Thought } from '../models/index.js';
import { Request, Response } from 'express';

// TODO: Create an aggregate function to get the number of thoughts overall

interface CustomRequest {
  params: Record<string, any>;
  body: any;
}

interface CustomResponse {
  status: (code: number) => CustomResponse; 
  json: (data:any) => void;
}

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
export const getAllThoughts = async (_req: CustomRequest, res: CustomResponse) => {
    try {
      const getAllThoughts = await Thought.find();
      res.json(getAllThoughts);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
};
  interface GetThoughtById extends CustomRequest {
    params: {
      thoughtId: string;
    }
  };
  
 export const GetThoughtById = async (req: GetThoughtById, res: Response): Promise<void> => {
    try {
      const thought = await Thought.findById(req.params.thoughtId);
      if (!thought) {
        res.status(404).json({ message: 'Thought not found' });
        return;
      }
      res.json(thought);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };
  
  interface CreateThought extends CustomRequest {
    body: {
        text: string;
        username: string;
    };
}

export const createThought = async (req: CreateThought, res: Response): Promise<void> => {
    try {
      const newThought = await Thought.create(req.body);
      res.status(201).json(newThought);
    } catch (error: any) {
      if (error.name === 'ValidationError') {
      res.status(400).json({ message: error.message });
    }}
  };
  interface AddReactionRequest extends CustomRequest {
    params: {
        thoughtId: string;
    };
    body: {
        reactionBody: string;
        username: string;
    };
}
// add Reaction to thought
export const addReaction = async (req: AddReactionRequest, res: Response): Promise<void> => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $push: { reactions: req.body } },
      { new: true }
    );
    if (!thought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }
    res.json(thought);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

interface UpdateThoughtRequest extends CustomRequest {
  params: {
    thoughtId: string;
  };
  body: {
    text?: string; 
    username?: string;
  };
}

// Update a Thought
export const updateThought = async (req: UpdateThoughtRequest, res: Response): Promise<void> => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      req.body, 
      { new: true, runValidators: true } 
    );

    if (!updatedThought) {
       res.status(404).json({ message: 'Thought not found' });
    }

    res.json({ message: 'Thought updated successfully!', updatedThought });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
  
/**
 * DELETE thoughts based on id /thoughts/:id
 * @param string id
 * @returns string 
*/

interface deleteThought extends CustomRequest { 
  params: {
    thoughtId: string;
    reeactionId: string;
  };
}

export const deleteThought = async (req: Request, res: Response) => {
  try {
    const deleteThought = await Thought.deleteOne(req.body);
    res.status(201).json(deleteThought);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
  
    export default { 
        getAllThoughts,
        GetThoughtById,
        createThought,
        addReaction,
        updateThought,
        deleteThought
    };