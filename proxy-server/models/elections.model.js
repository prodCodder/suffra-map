const mongoose = require('mongoose');
const ElectionChoicesSchema = require("./sub_models/election_choices.submodel");

const ElectionsSchema = mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: ["presidentielle", "legislative", "municipale", "europeenne"]
        },
        tours: [Date], // Pour chaque tour de l'election, la date associée, par exemple 30 juin 2024 et 7 juillet 2024 pour les législatives 2024

        nb_inscrits: { type: Number, required: true },
        nb_abstention: { type: Number, required: true },
        nb_votes_blancs: { type: Number, required: true },
        nb_votes_nuls: { type: Number, required: true },

        choices: [ElectionChoicesSchema],
    },
)

module.exports = mongoose.model('Elections', ElectionsSchema)