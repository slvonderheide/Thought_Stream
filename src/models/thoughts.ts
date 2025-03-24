import { Schema, Types, model, type Document } from 'mongoose';

interface Reactions extends Document {
  reactionsId: Schema.Types.ObjectId;
  name: string;
  score: number;
}

interface Thoughts extends Document {
  first: string;
  last: string;
  github: string;
  thoughts: Schema.Types.ObjectId[];
  reactions: Reactions[];
}

const ReactionsSchema = new Schema<Reactions>(
  {
    reactionsId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    name: {
      type: String,
      required: true,
      maxlength: 50,
      minlength: 4,
      default: 'Unnamed reactions',
    },
    score: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

const thoughtsSchema = new Schema<Thoughts>(
  {
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
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thoughts',
      },
    ],
    reactions: [ReactionsSchema],
  },
  {
    toJSON: {
      getters: true,
    },
    timestamps: true,
  }
);

const Thoughts = model<Thoughts>('Thoughts', thoughtsSchema);

export default Thoughts;
