import mongoose, { Schema, Types } from "mongoose";

import ElectionChoicesSchema, {
    IElectionChoice
} from "./sub_models/election_choices.submodel.js";

import PollingStationMetadataSchema, {
    IPollingStationMetadata
} from "./sub_models/pooling_station_metadata.submodel.js";

export enum IEElectionResultLevel {
    national = "national",
    polling_station = "polling_station"
}

export interface IElectionResult {
    // Référence vers Election._id
    election_id: Types.ObjectId;

    // Index du tour (1, 2...)
    election_round: number;

    // Niveau du résultat
    level: IEElectionResultLevel;

    // Renseigné uniquement pour les bureaux
    polling_station?: IPollingStationMetadata;

    nb_registered: number;
    nb_abstentions: number;
    nb_votes_cast: number;
    nb_blank_votes: number;
    nb_invalid_votes: number;

    choices: IElectionChoice[];
}

const ElectionResultsSchema = new Schema<IElectionResult>(
    {
        election_id: {
            type: Schema.Types.ObjectId,
            ref: "Elections",
            required: true,
            index: true
        },

        election_round: {
            type: Number,
            required: true,
            index: true
        },

        level: {
            type: String,
            required: true,
            enum: Object.values(IEElectionResultLevel),
            index: true
        },

        polling_station: {
            type: PollingStationMetadataSchema,
            required: false
        },

        nb_registered: {
            type: Number,
            required: true,
            min: 0
        },

        nb_abstentions: {
            type: Number,
            required: true,
            min: 0
        },

        nb_votes_cast: {
            type: Number,
            required: true,
            min: 0
        },

        nb_blank_votes: {
            type: Number,
            required: true,
            min: 0
        },

        nb_invalid_votes: {
            type: Number,
            required: true,
            min: 0
        },

        choices: [ElectionChoicesSchema]
    },
    {
        timestamps: false
    }
);

// Requêtes fréquentes
ElectionResultsSchema.index(
    {
        election_id: 1,
        election_round: 1,
    },
    {
        unique: true,
        partialFilterExpression: {
            level: IEElectionResultLevel.national
        }
    }
);

ElectionResultsSchema.index(
    {
        election_id: 1,
        election_round: 1,
        "polling_station.city_code": 1,
        "polling_station.polling_station_num": 1
    },
    {
        unique: true
    }
);

export default mongoose.model<IElectionResult>(
    "ElectionResults",
    ElectionResultsSchema
);