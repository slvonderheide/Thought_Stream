import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { thoughts, Course } from '../models/index.js';

// Aggregate function to get number of thoughtss overall

export const headCount = async () => {
    const numberOfthoughtss = await thoughts.aggregate()
        .count('thoughtsCount');
    return numberOfthoughtss;
}

// Aggregate function for getting the overall grade using $avg
export const grade = async (thoughtsId: string) =>
    thoughts.aggregate([
        // only include the given thoughts by using $match
        { $match: { _id: new ObjectId(thoughtsId) } },
        {
            $unwind: '$reactions',
        },
        {
            $group: {
                _id: new ObjectId(thoughtsId),
                overallGrade: { $avg: '$reactions.score' },
            },
        },
    ]);

/**
 * GET All thoughtss /thoughtss
 * @returns an array of thoughtss
*/
export const getAllthoughtss = async (_req: Request, res: Response) => {
    try {
        const thoughtss = await thoughts.find();

        const thoughtsObj = {
            thoughtss,
            headCount: await headCount(),
        }

        res.json(thoughtsObj);
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
}

/**
 * GET thoughts based on id /thoughtss/:id
 * @param string id
 * @returns a single thoughts object
*/
export const getthoughtsById = async (req: Request, res: Response) => {
    const { thoughtsId } = req.params;
    try {
        const thoughts = await thoughts.findById(thoughtsId);
        if (thoughts) {
            res.json({
                thoughts,
                grade: await grade(thoughtsId)
            });
        } else {
            res.status(404).json({
                message: 'thoughts not found'
            });
        }
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
};

/**
 * POST thoughts /thoughtss
 * @param object thoughts
 * @returns a single thoughts object
*/

export const createthoughts = async (req: Request, res: Response) => {
    try {
        const thoughts = await thoughts.create(req.body);
        res.json(thoughts);
    } catch (err) {
        res.status(500).json(err);
    }
}
/**
 * DELETE thoughts based on id /thoughtss/:id
 * @param string id
 * @returns string 
*/

export const deletethoughts = async (req: Request, res: Response) => {
    try {
        const thoughts = await thoughts.findOneAndDelete({ _id: req.params.thoughtsId });

        if (!thoughts) {
            return res.status(404).json({ message: 'No such thoughts exists' });
        }

        const course = await Course.findOneAndUpdate(
            { thoughtss: req.params.thoughtsId },
            { $pull: { thoughtss: req.params.thoughtsId } },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({
                message: 'thoughts deleted, but no courses found',
            });
        }

        return res.json({ message: 'thoughts successfully deleted' });
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}

/**
 * POST Assignment based on /thoughtss/:thoughtsId/reactions
 * @param string id
 * @param object assignment
 * @returns object thoughts 
*/

export const addAssignment = async (req: Request, res: Response) => {
    console.log('You are adding an assignment');
    console.log(req.body);
    try {
        const thoughts = await thoughts.findOneAndUpdate(
            { _id: req.params.thoughtsId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        );

        if (!thoughts) {
            return res
                .status(404)
                .json({ message: 'No thoughts found with that ID :(' });
        }

        return res.json(thoughts);
    } catch (err) {
        return res.status(500).json(err);
    }
}

/**
 * DELETE Assignment based on /thoughtss/:thoughtsId/reactions
 * @param string assignmentId
 * @param string thoughtsId
 * @returns object thoughts 
*/

export const removeAssignment = async (req: Request, res: Response) => {
    try {
        const thoughts = await thoughts.findOneAndUpdate(
            { _id: req.params.thoughtsId },
            { $pull: { reactions: { assignmentId: req.params.assignmentId } } },
            { runValidators: true, new: true }
        );

        if (!thoughts) {
            return res
                .status(404)
                .json({ message: 'No thoughts found with that ID :(' });
        }

        return res.json(thoughts);
    } catch (err) {
        return res.status(500).json(err);
    }
}
