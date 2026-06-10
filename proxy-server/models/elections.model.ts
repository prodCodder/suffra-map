import mongoose, { Schema } from "mongoose";
import ElectionChoicesSchema, {
    IElectionChoice
} from "./sub_models/election_choices.submodel.js";

export enum IEElectionTypes {
    presidential = "presidential",
    parliamentary = "parliamentary",
    local = "local",
    european = "european"
}

export interface IElection {
    name: string;

    type: IEElectionTypes;

    // Dates des tours
    rounds: Date[];

    // Choix possibles dans l'élection
    // Sans résultats associés.
    choices: IElectionChoice[];
}

const ElectionsSchema = new Schema<IElection>(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        type: {
            type: String,
            required: true,
            enum: Object.values(IEElectionTypes)
        },

        rounds: [Date],

        choices: [ElectionChoicesSchema]
    },
    {
        timestamps: false
    }
);

export default mongoose.model<IElection>(
    "Elections",
    ElectionsSchema
);