const mongoose = require('mongoose');
const fs = require("fs");

const tendancesString = fs.readFileSync(__dirname+"/../../JSON_files/tendances.json").toString();
const tendances = JSON.parse(tendancesString);
const tendancesEnum = Object.keys(tendances);

const CandidatSchema = mongoose.Schema(
    {
        firstname: {type: String, required: true},
        lastname: {type: String, required: true},
        fullname: {type: String, required: true},
    }
)

const ElectionChoicesSchema = mongoose.Schema(
    {
        nuance: { type: String, required: true },
        tendance: {
            type: String,
            required: true,
            enum: tendancesEnum
        },

        code: { type: String, required: true }, // Code du parti ou de la liste (ex: LFI, LR, etc...)
        name: { type: String, required: true }, // Nom du parti ou de la liste (ex: La France Insoumise, Les républicains...)

        // Candidat (personne réelle) mentionné.
        // N'est mentionné quand à la maille locale (bureau de vote)
        // et la maille nationale si on est sur les présidentielles ou les européennes (tête de liste)
        candidat: { type: CandidatSchema, required: false },

        nb_voix: { type: Number, required: true }
    }
)

module.exports = ElectionChoicesSchema;