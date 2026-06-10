import { Schema } from "mongoose";

export interface IPollingStationMetadata {
    polling_station_num: number;

    city_code: string;
    city_label: string;

    department_code: string;
    department_label: string;

    constituency_code?: string;
}

const PollingStationMetadataSchema = new Schema<IPollingStationMetadata>(
    {
        polling_station_num: {
            type: Number,
            required: true
        },

        city_code: {
            type: String,
            required: true
        },

        city_label: {
            type: String,
            required: true
        },

        department_code: {
            type: String,
            required: true
        },

        department_label: {
            type: String,
            required: true
        },

        constituency_code: {
            type: String,
            required: false
        }
    },
    {
        _id: false,
        timestamps: false
    }
);

export default PollingStationMetadataSchema;