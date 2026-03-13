# Whalo Game Backend

A Node.js microservices backend for a mobile game, managing player profiles, game scores, leaderboards, and client logs. Built with TypeScript, Express.js, MongoDB, Redis, and Kafka.

---

## Architecture Overview

The system is composed of 4 independent microservices and a shared common package, all communicating asynchronously via Kafka.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Player Svc    │────▶│  Gamescore Svc  │────▶│ Leaderboard Svc │     │    Logs Svc     │
│   Port: 4000    │     │   Port: 4001    │     │   Port: 4002    │     │   Port: 4003    │
│   MongoDB       │     │   Redis         │     │   Redis         │     │   Redis         │
│                 │     │   MongoDB       │     │                 │     │   MongoDB       │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
         │                      │                        ▲                       ▲
         │                      │                        │                       │
         └──────────────────────┴──────── Kafka ─────────┴───────────────────────┘
```

### Event Flow

- `player.created` — emitted by Player Svc → consumed by Gamescore Svc and Logs Svc (caches valid player IDs in Redis)
- `player.deleted` — emitted by Player Svc → consumed by Gamescore Svc and Logs Svc (removes player ID from Redis cache)
- `score.submitted` — emitted by Gamescore Svc → consumed by Leaderboard Svc (updates Redis sorted set)
- `logs.committed` — emitted by Logs Svc (HTTP route) → consumed by Logs Svc worker (batched MongoDB writes)

---

## Services

### 1. Common Package (`@liad123121/whalo-common`)

A shared npm package containing utilities used across all services:

- Kafka connection, shared consumer and topic initialization
- DB connections
- Shared TypeScript types and enums
- Common middleware (error handler, input validation)
- Winston logger configuration

### 2. Player Service (Port 4000)

Manages player profiles stored in MongoDB. Exposes full CRUD endpoints for player management. On player creation, emits a `player.created` Kafka event so downstream services can cache the player ID. On deletion, emits `player.deleted` to invalidate the cache.

**Endpoints:**
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/players` | Create a new player |
| GET | `/players/:playerId` | Get a player by ID |
| PUT | `/players/:playerId` | Update a player's username or email |
| DELETE | `/players/:playerId` | Delete a player |

### 3. Gamescore Service (Port 4001)

Handles game score submissions and retrieval. Before accepting a score, validates the `playerId` against a Redis cache populated by Kafka events from the Player Service — eliminating cross-service HTTP calls. Scores are stored in MongoDB, and a `score.submitted` event is emitted to Kafka on each submission for the Leaderboard Service to consume.

**Endpoints:**
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/scores` | Submit a new score |
| GET | `/scores/top` | Retrieve the top 10 highest scores |

### 4. Leaderboard Service (Port 4002)

Maintains a real-time leaderboard using Redis Sorted Sets (`ZINCRBY`). Consumes `score.submitted` events from Kafka and increments each player's total score in Redis automatically. Supports cursor-based pagination.

**Endpoints:**
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/players/leaderboard` | Get players ranked by total score (paginated) |

**Query params:** `?page=0&limit=10`

### 5. Logs Service (Port 4003)

Accepts log entries from game clients and processes them asynchronously via a Kafka pipeline. The HTTP endpoint responds immediately with `202 Accepted` without waiting for the database write, keeping latency low under high volume.

**Endpoints:**
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/logs` | Submit a log entry |

**Log pipeline features:**

- **Batching** — log entries are accumulated and written to MongoDB in bulk using `insertMany`, reducing database round trips significantly
- **Rate Limiting** — implemented using [Bottleneck](https://github.com/SGravard/bottleneck), combining three strategies:
  - **Token Bucket** — limits total write operations over time using a refilling token reservoir
  - **Leaky Bucket** — enforces a minimum interval between writes (`minTime`)
  - **Concurrency Control** — restricts simultaneous database writes (`maxConcurrent`)
- **Queue Prioritization** — logs are routed to separate Kafka partitions by severity (`CRITICAL → partition 0`, `INFO → partition 1`), ensuring critical logs are never delayed by bursts of lower-priority entries. The Bottleneck scheduler also prioritizes critical batches at the worker level.
- **Fault Tolerance** — Kafka offsets are only committed after a successful MongoDB write (`autoCommit: false`). If the service crashes mid-batch, Kafka re-delivers the unprocessed messages on restart with no data loss.
- **Horizontal Scaling** — the service can be scaled to multiple worker instances via Docker replicas. Kafka automatically distributes partitions across workers within the same consumer group.

**Request body:**

```json
{
  "playerId": "string (required)",
  "logData": "string (required)",
  "level": 0
}
```

Log levels: `0 = CRITICAL`, `1 = INFO`

---

## How to Run

### Prerequisites

- Node.js 18+
- Docker and Docker Compose

### Environment Variables

Create a `.env` file in each service folder with the following values:

**`player-svc/.env`**

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/whalo_playerdb
KAFKA_BROKERS=localhost:29092
KAFKA_CLIENT_ID=player-service
```

**`gamescore-svc/.env`**

```env
PORT=4001
MONGODB_URI=mongodb://localhost:27017/whalo_gamescoredb
KAFKA_BROKERS=localhost:29092
KAFKA_CLIENT_ID=gamescore-service
REDIS_URL=redis://localhost:6379
```

**`leaderboard-svc/.env`**

```env
PORT=4002
KAFKA_BROKERS=localhost:29092
KAFKA_CLIENT_ID=leaderboard-service
REDIS_URL=redis://localhost:6379
```

**`logs-svc/.env`**

```env
PORT=4003
MONGODB_URI=mongodb://localhost:27017/whalo_logsdb
KAFKA_BROKERS=localhost:29092
KAFKA_CLIENT_ID=logs-service
KAFKA_NUM_PARTITIONS=2
REDIS_URL=redis://localhost:6379
```

### Option A — Docker (Recommended)

Runs all dependencies and services in containers:

```bash
cd docker
docker compose up --build
```

Services will be available at:

- Player Svc: `http://localhost:4000`
- Gamescore Svc: `http://localhost:4001`
- Leaderboard Svc: `http://localhost:4002`
- Logs Svc: `http://localhost:4003`

### Option B — Local Development (VSCode)

1. Start dependencies only via Docker:

```bash
cd docker
docker compose up zookeeper kafka redis mongo
```

2. Open the project in VSCode, go to **Run and Debug**, and select **"Run All Services"**. This will start all 4 services in the correct order using the VSCode launch configuration.

---

## Testing

Import the Postman collection `Whalo.postman_collection.json` into Postman to test all endpoints. The collection includes example requests for each service with dynamic variables for generating random player data and chained requests that automatically pass `playerId` between requests.
