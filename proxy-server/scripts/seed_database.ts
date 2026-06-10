import ElectionsModel, {
  IEElectionTypes
} from "../models/elections.model.js";

import ElectionResultsModel, {
  IEElectionResultLevel
} from "../models/election_results.model.js";

import PollingStationsGeosModel from "../models/polling_stations_geos.model.js";

import connectMongoDB from '../config/dbMongo.js';
import ENV from '../config/env.js';

export async function seedElectionData() {
  await connectMongoDB(ENV.MONGO_HOST, ENV.MONGO_DB_NAME, ENV.MONGO_USERNAME, ENV.MONGO_PASSWORD)

  await ElectionsModel.deleteMany({});
  await ElectionResultsModel.deleteMany({});
  await PollingStationsGeosModel.deleteMany({});

  /*
   * --------------------------------------------------------
   * POLLING STATIONS
   * --------------------------------------------------------
   */

  const parisStation = {
    polling_station_num: 1,
    city_code: "75056",
    city_label: "Paris",
    department_code: "75",
    department_label: "Paris"
  };

  const marseilleStation = {
    polling_station_num: 1,
    city_code: "13055",
    city_label: "Marseille",
    department_code: "13",
    department_label: "Bouches-du-Rhône"
  };

  const rennesStation = {
    polling_station_num: 1,
    city_code: "35238",
    city_label: "Rennes",
    department_code: "35",
    department_label: "Ille-et-Vilaine"
  };

  const stations = [
    parisStation,
    marseilleStation,
    rennesStation
  ];

  /*
   * --------------------------------------------------------
   * GEOMETRIES
   * --------------------------------------------------------
   */

  await PollingStationsGeosModel.insertMany(
    stations.map((s, i) => ({
      polling_station: s,
      official_calcul_date: new Date("2024-01-01"),
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [2 + i * 0.1, 48 + i * 0.1],
              [2 + i * 0.1 + 0.01, 48 + i * 0.1],
              [2 + i * 0.1 + 0.01, 48 + i * 0.1 + 0.01],
              [2 + i * 0.1, 48 + i * 0.1 + 0.01],
              [2 + i * 0.1, 48 + i * 0.1]
            ]
          ]
        ]
      }
    }))
  );

/*
* --------------------------------------------------------
* PRESIDENTIAL 2022
* --------------------------------------------------------
*/

const presidential2022 = await ElectionsModel.create({
    name: "Présidentielle 2022",
    type: IEElectionTypes.presidential,
    rounds: [
        new Date("2022-04-10"),
        new Date("2022-04-24")
    ],

    choices: [
        { 
            code: "MACRON", 
            name: "Macron", 
            nuance: "ENS", 
            trend: "center",
            candidate: {
                firstname: "Emmanuel",
                lastname: "MACRON",
                fullname: "Emmanuel MACRON"
            },
        },
        { 
            code: "LEPEN", 
            name: "Le Pen", 
            nuance: "RN", 
            trend: "right",
            candidate: {
                firstname: "Marine",
                lastname: "LEPEN",
                fullname: "Marine LEPEN"
            },
        },
        { 
            code: "MELENCHON", 
            name: "Mélenchon", 
            nuance: "LFI", 
            trend: "left",
            candidate: {
                firstname: "Jean-Luc",
                lastname: "MELENCHON",
                fullname: "Jean-Luc MELENCHON"
            },
        }
    ]
  });

  const presidentialRound1rdChoices = presidential2022.choices
  const presidentialRound2ndChoices = presidential2022.choices.slice(0,2)
  const presidentialChoicesByRoundIndex = [presidentialRound1rdChoices, presidentialRound2ndChoices]

  /*
   * --------------------------------------------------------
   * PRESIDENTIAL NATIONAL RESULTS (WITH CANDIDATES)
   * --------------------------------------------------------
   */

  const presidentialNationalResults: any[] = [];

  for (const round of [1, 2]) {
    presidentialNationalResults.push(
      await ElectionResultsModel.create({
        election_id: presidential2022._id,
        election_round: round,
        level: IEElectionResultLevel.national,

        nb_registered: 1000000,
        nb_abstentions: 250000,
        nb_votes_cast: 750000,
        nb_blank_votes: 10000,
        nb_invalid_votes: 5000,

        choices: presidentialChoicesByRoundIndex[round-1].map(c => ({
          ...c,
          nb_votes: Math.floor(Math.random() * 300000)
        }))
      })
    );
  }

  /*
   * --------------------------------------------------------
   * PRESIDENTIAL POLLING STATION RESULTS (NO CANDIDATES)
   * --------------------------------------------------------
   */

  for (const round of [1, 2]) {
    for (const station of stations) {
      await ElectionResultsModel.create({
        election_id: presidential2022._id,
        election_round: round,
        level: IEElectionResultLevel.polling_station,

        polling_station: station,

        nb_registered: 1000,
        nb_abstentions: 200,
        nb_votes_cast: 800,
        nb_blank_votes: 10,
        nb_invalid_votes: 5,

        choices: presidentialChoicesByRoundIndex[round-1].map(c => ({
          ...c,
          candidate: undefined,
          nb_votes: Math.floor(Math.random() * 300)
        }))
      });
    }
  }

  /*
   * --------------------------------------------------------
   * PARLIAMENTARY 2024
   * --------------------------------------------------------
   */

  const parliamentaryCandidates = [
    {
        firstname: "Camille",
        lastname: "Delaunay",
        fullname: "Camille Delaunay"
    },
    {
        firstname: "Lucas",
        lastname: "Morel",
        fullname: "Lucas Morel"
    },
    {
        firstname: "Élise",
        lastname: "Martin",
        fullname: "Élise Martin"
    }
  ]

  const parliamentary2024 = await ElectionsModel.create({
    name: "Législatives 2024",
    type: IEElectionTypes.parliamentary,
    rounds: [
      new Date("2024-06-30"),
      new Date("2024-07-07")
    ],

    choices: [
      { code: "NFP", name: "NFP", nuance: "NFP", trend: "left" },
      { code: "RN", name: "RN", nuance: "RN", trend: "right" },
      { code: "ENS", name: "ENS", nuance: "ENS", trend: "center" }
    ]
  });

  /*
   * --------------------------------------------------------
   * PARLIAMENTARY NATIONAL RESULTS (NO CANDIDATES)
   * --------------------------------------------------------
   */

  for (const round of [1, 2]) {
    await ElectionResultsModel.create({
      election_id: parliamentary2024._id,
      election_round: round,
      level: IEElectionResultLevel.national,

      nb_registered: 1000000,
      nb_abstentions: 300000,
      nb_votes_cast: 700000,
      nb_blank_votes: 15000,
      nb_invalid_votes: 5000,

      choices: parliamentary2024.choices.map(c => ({
        ...c,
        nb_votes: Math.floor(Math.random() * 300000)
      }))
    });
  }

  /*
   * --------------------------------------------------------
   * PARLIAMENTARY POLLING STATION RESULTS (WITH CANDIDATES)
   * --------------------------------------------------------
   */

  for (const round of [1, 2]) {
    for (const station of stations) {
      await ElectionResultsModel.create({
        election_id: parliamentary2024._id,
        election_round: round,
        level: IEElectionResultLevel.polling_station,

        polling_station: station,

        nb_registered: 1000,
        nb_abstentions: 250,
        nb_votes_cast: 750,
        nb_blank_votes: 20,
        nb_invalid_votes: 10,

        choices: presidential2022.choices.map((c,i) => ({
          ...c,
          candidate: parliamentaryCandidates[i],
          nb_votes: Math.floor(Math.random() * 300)
        }))
      });
    }
  }

  return {
    presidential2022,
    parliamentary2024
  };
}

console.log("Running Seed elections datas");
seedElectionData().then(() => {
    console.log("Seed elections datas done");
    process.exit()
})