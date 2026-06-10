
# 🗳️ Election Database Documentation

This database models election data with support for multiple election types, multi-round elections, polling stations, and geospatial queries.

---

# 📦 Core Concept

The system is based on 3 main collections:

- Elections → defines the election and available choices
- ElectionResults → stores results (national + polling station level)
- PollingStationsGeos → stores polling station metadata + geometry

---

# 🗳️ 1. Elections Collection

## Purpose

Defines an election and its possible choices (candidates or political blocs).

## Schema

```ts
{
  name: string;
  type: "presidential" | "parliamentary" | "local" | "european";
  rounds: Date[];
  choices: ElectionChoice[];
}
```

## ElectionChoice

```ts
{
  code: string;
  name: string;
  nuance: string;
  trend: string;
  candidate?: {
    firstname: string;
    lastname: string;
    fullname: string;
  };
}
```

## Rules

* Contains all possible choices for the election
* Presidential elections → full list of candidates
* Parliamentary elections → political blocs / parties

---

# 📊 2. ElectionResults Collection

## Purpose

Stores election results at different levels:

* national
* polling station

## Schema

```ts
{
  election_id: ObjectId;
  election_round: number;
  level: "national" | "polling_station";

  polling_station?: PollingStationMetadata;

  nb_registered: number;
  nb_abstentions: number;
  nb_votes_cast: number;
  nb_blank_votes: number;
  nb_invalid_votes: number;

  choices: ElectionChoiceWithVotes[];
}
```

## ElectionChoiceWithVotes

```ts
{
  code: string;
  name: string;
  nuance: string;
  trend: string;
  candidate?: Candidate;
  nb_votes: number;
}
```

---

## Rules

### Presidential elections

* National results:

  * contains candidates + votes
* Polling station results:

  * Votes per bloc, but no mentionning candidates (Candidates or same as in national, so we avoid repeating datas)

### Parliamentary elections

* National results:

  * Votes per bloc, but no mentionning candidates (candidates are only specific to pooling station level)
* Polling station results:

  * full vote breakdown per political bloc and candidates

---

## Indexing Rules

### Uniqueness constraints

* One national result per (election_id, election_round)
* One polling station result per:
  (election_id, election_round, city_code, polling_station_num)

---

# 🗺️ 3. PollingStationsGeos Collection

## Purpose

Stores polling station metadata and geospatial geometry.

## Schema

```ts
{
  polling_station: PollingStationMetadata;

  geometry: {
    type: "MultiPolygon";
    coordinates: number[][][][];
  };

  official_calcul_date: Date;
}
```

## PollingStationMetadata

```ts
{
  polling_station_num: number;
  city_code: string;
  city_label: string;
  department_code: string;
  department_label: string;
  constituency_code?: string;
}
```

---

## Indexing

### Geospatial index

```ts
geometry: "2dsphere"
```

### Lookup index

```ts
(city_code, polling_station_num, official_calcul_date)
```

---

## Usage

* Find polling stations in a geographic zone
* Link geospatial data to election results
* Support map-based election analysis

---

# 🔄 Data Flow

## Typical query pipeline

Geo query
↓
PollingStationsGeos
↓
(city_code + polling_station_num)
↓
ElectionResults
↓
Aggregated election results

---

# 🧠 Design Principles

* Strong separation between definition (Elections) and facts (Results)
* Heavy denormalization for performance
* Geo data isolated for scalability
* Results optimized for analytical queries
* Strict uniqueness constraints to prevent duplicate imports

---

# 📌 Summary

This database supports:

* Multi-round elections
* Presidential + parliamentary + european + local logic
* National and local (pooling station) results
* Geo-based filtering
* High-performance analytics queries
* Duplicate-safe imports via indexes

```