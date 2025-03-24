import { Schema, Types, model, type Document } from 'mongoose';

interface IAssignment extends Document {
    assignmentId: Schema.Types.ObjectId,
    name: string,
    score: number
}

interface Ithoughts extends Document {
    first: string,
    last: string,
    github: string,
    reactions: Schema.Types.ObjectId[]
}

const reactionschema = new Schema<IAssignment>(
    {
        assignmentId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        name: {
            type: String,
            required: true,
            maxlength: 50,
            minlength: 4,
            default: 'Unnamed assignment',
        },
        score: {
            type: Number,
            required: true,
            default: () => Math.floor(Math.random() * (100 - 70 + 1) + 70),
        },
    },
    {
        timestamps: true,
        _id: false
    }
);

const thoughtsSchema = new Schema<Ithoughts>({
    first: {
        type: String,
        required: true,
        max_length: 50,
    },
    last: {
        type: String,
        required: true,
        max_length: 50,
    },
    github: {
        type: String,
        required: true,
        max_length: 50,
    },
    reactions: [reactionschema],
},
    {
        toJSON: {
            getters: true,
        },
        timestamps: true
    }
);

const thoughts = model('thoughts', thoughtsSchema);

export default thoughts;
