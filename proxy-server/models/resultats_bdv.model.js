const mongoose = require('mongoose');
const ElectionChoicesSchema = require("./sub_models/election_choices.submodel");

const ResultatsBdv = mongoose.Schema(
    {
        election_id: { type: String, required: true },

        code_commune: { type: String, required: true },
        code_departement: { type: String, required: true },
        label_departement: { type: String, required: true },
        label_commune: { type: String, required: true },
        num_circonscription: { type: Number, required: false },

        num_bureau: { type: Number, required: true },

        nb_inscrits: { type: Number, required: true },
        nb_abstention: { type: Number, required: true },
        nb_exprimés: { type: Number, required: true },
        nb_votes_blancs: { type: Number, required: true },
        nb_votes_nuls: { type: Number, required: true },

        choices: [ElectionChoicesSchema],
    }
)

module.exports = mongoose.model('ResultatsBdv', ResultatsBdv)