import { Schema } from "mongoose";
import { trends, IETPoliticalTrends } from "../../config/political_trends.js";

export interface ICandidate {
    firstname: string;
    lastname: string;
    fullname: string;
}

export interface IElectionChoice {
    nuance: string;

    trend: IETPoliticalTrends;

    code: string;
    name: string;

    candidate?: ICandidate;

    // Undefined in Election definition,
    // populated in ElectionResult documents.
    nb_votes?: number;
}

export const CandidateSchema = new Schema<ICandidate>(
    {
        firstname: {
            type: String,
            required: true
        },

        lastname: {
            type: String,
            required: true
        },

        fullname: {
            type: String,
            required: true
        }
    },
    {
        _id: false
    }
);

const ElectionChoiceSchema = new Schema<IElectionChoice>(
    {
        nuance: {
            type: String,
            required: true
        },

        trend: {
            type: String,
            required: true,
            enum: Object.keys(trends)
        },

        code: {
            type: String,
            required: true
        },

        name: {
            type: String,
            required: true
        },

        candidate: {
            type: CandidateSchema,
            required: false
        },

        nb_votes: {
            type: Number,
            required: false
        }
    },
    {
        _id: false,
        timestamps: false
    }
);

export default ElectionChoiceSchema;