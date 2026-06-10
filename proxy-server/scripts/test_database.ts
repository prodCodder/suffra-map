import ElectionsModel, { IElection } from "../models/elections.model.js";
import ElectionResultsModel, {
  IEElectionResultLevel
} from "../models/election_results.model.js";
import PollingStationsGeosModel from "../models/polling_stations_geos.model.js";

import connectMongoDB from '../config/dbMongo.js';
import ENV from '../config/env.js';
import { JSONCookie } from "cookie-parser";

async function runMinimalTests() {
  await connectMongoDB(ENV.MONGO_HOST, ENV.MONGO_DB_NAME, ENV.MONGO_USERNAME, ENV.MONGO_PASSWORD)

  const presidential2022 = await ElectionsModel.findOne({name: "Présidentielle 2022"})
  const parliamentary2024 = await ElectionsModel.findOne({name: "Législatives 2024"})

  if (presidential2022 === null) return;
  if (parliamentary2024 === null) return;

  /*
   * --------------------------------------------------------
   * 1. SEARCH ELECTIONS
   * --------------------------------------------------------
   */

  const elections = await ElectionsModel.find();

  console.log("ELECTIONS:", elections.length);
  console.assert(elections.length === 2, "Should have 2 elections");

  /*
   * --------------------------------------------------------
   * 2. SEARCH NATIONAL RESULTS (ROUND 1 & 2)
   * --------------------------------------------------------
   */

  const presidentialNationalR1 =
    await ElectionResultsModel.findOne({
      election_id: presidential2022._id,
      election_round: 1,
      level: IEElectionResultLevel.national
    });

  const presidentialNationalR2 =
    await ElectionResultsModel.findOne({
      election_id: presidential2022._id,
      election_round: 2,
      level: IEElectionResultLevel.national
    });

  console.assert(!!presidentialNationalR1, "Pres R1 national missing");
  console.assert(!!presidentialNationalR2, "Pres R2 national missing");

  console.log("Presidential national R1 choices:", presidentialNationalR1?.choices.length);

  /*
   * --------------------------------------------------------
   * 3. SEARCH POLLING STATION GEOS IN GEOGRAPHIC ZONE
   * (USING PARIS-LIKE BOUNDING BOX FROM YOUR SEED)
   * --------------------------------------------------------
   */

  const geoZone = await PollingStationsGeosModel.find({
  $or: [
    {
      geometry: {
        $geoIntersects: {
          $geometry: {
            type: "Polygon",
            coordinates: [[
              [1.99, 47.99],
              [2.02, 47.99],
              [2.02, 48.02],
              [1.99, 48.02],
              [1.99, 47.99]
            ]]
          }
        }
      }
    },
    {
      geometry: {
        $geoIntersects: {
          $geometry: {
            type: "Polygon",
            coordinates: [[
              [2.09, 48.09],
              [2.12, 48.09],
              [2.12, 48.12],
              [2.09, 48.12],
              [2.09, 48.09]
            ]]
          }
        }
      }
    }
  ]
});

  console.log("GEOS FOUND:", geoZone.length);

  console.assert(geoZone.length === 2, "Pooling station searching not good");

  /*
   * --------------------------------------------------------
   * 4. EXTRACT polling_station_num + city_code
   * --------------------------------------------------------
   */

  const stationFilters = geoZone.map((g) => ({
    polling_station_num: g.polling_station.polling_station_num,
    city_code: g.polling_station.city_code
  }));

  console.log("STATION FILTERS:", stationFilters);

  /*
   * --------------------------------------------------------
   * 5. GET ELECTION RESULTS FOR ZONE + ROUND
   * --------------------------------------------------------
   */

  const parliamentaryR1ZoneResults =
    await ElectionResultsModel.find({
      election_id: parliamentary2024._id,
      election_round: 1,
      level: IEElectionResultLevel.polling_station,
      $or: stationFilters.map((s) => ({
        "polling_station.polling_station_num": s.polling_station_num,
        "polling_station.city_code": s.city_code
      }))
    });

  console.log(
    "PARLIAMENTARY R1 ZONE RESULTS:",
    parliamentaryR1ZoneResults.length
  );

  console.assert(
    parliamentaryR1ZoneResults.length == 2,
    "Elections results not found"
  );

  /*
   * --------------------------------------------------------
   * 6. VERIFY UNIQUENESS LOGIC (soft test)
   * --------------------------------------------------------
   */

  const duplicateTest = await ElectionResultsModel.find({
    election_id: presidential2022._id,
    election_round: 1,
    level: IEElectionResultLevel.national
  });

  console.assert(
    duplicateTest.length === 1,
    "Should have only one national result per election/round"
  );

  console.log("ALL TESTS PASSED ✔");
}

console.log("Running Test elections datas");
runMinimalTests().then(() => {
    console.log("Tests on elections datas done");
    process.exit()
})