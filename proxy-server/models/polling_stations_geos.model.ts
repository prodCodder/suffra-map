import mongoose, { Schema } from "mongoose";


import PollingStationMetadataSchema, {
    IPollingStationMetadata
} from "./sub_models/pooling_station_metadata.submodel.js";

export interface IPollingStationGeometry {
    type: "MultiPolygon";

    coordinates: number[][][][];
}

export interface IPollingStationsGeos {
    polling_station: IPollingStationMetadata;

    geometry: IPollingStationGeometry;

    official_calcul_date: Date;
}

const PollingStationGeometrySchema =
    new Schema<IPollingStationGeometry>(
        {
            type: {
                type: String,
                enum: ["MultiPolygon"],
                required: true
            },

            coordinates: {
                type: [[[[Number]]]],
                required: true
            }
        },
        {
            _id: false
        }
    );

const PollingStationsGeosSchema =
    new Schema<IPollingStationsGeos>(
        {
            polling_station: {
                type: PollingStationMetadataSchema,
                required: true
            },

            geometry: {
                type: PollingStationGeometrySchema,
                required: true
            },

            official_calcul_date: {
                type: Date,
                required: true
            }
        },
        {
            timestamps: false
        }
    );

// Index géospatial MongoDB
PollingStationsGeosSchema.index({
    geometry: "2dsphere",
    official_calcul_date: 1
});

// Jointure logique avec ElectionResults
PollingStationsGeosSchema.index(
    {
        "polling_station.city_code": 1,
        "polling_station.polling_station_num": 1,
        official_calcul_date: 1
    },
    {
        unique: true
    }
);

export default mongoose.model<IPollingStationsGeos>(
    "PollingStationsGeos",
    PollingStationsGeosSchema
);