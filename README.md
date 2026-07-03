# Suffra map

## Prequesites
To start project locally :
 - Docker
 - Docker compose
 - tmux

## Quick start

### Install dependencides :
```bash
docker compose run proxy-server npm install
docker compose run client npm install
```

Then kill orphan containers :
```bash
docker compose down --remove-orphans
```

### Set env configuration
Copy `.env.example` into `.env` then modify values if you want

### Run and down project (developpement)
```bash
./dev-up.sh
```

Then you can look at server typescript and execution logs with :
```bash
./dev-server-logs.sh
```

And look at client logs with :
```bash
docker compose logs -f client
```

To down the project :
```bash
./dev-down.sh
```

### Run and down project (production)
```bash
docker compose up -d
```
Then connect to localhost, with port configured in .env file (default 3000)

Down the project with :
```bash
docker compose down
```

## Command Execution

To execute commands:

```bash
# In proxy-server/ folder
npm run cmd <command> <opt1> <opt2>
```

Or if using Docker:

```bash
docker compose exec proxy-server npm run cmd <command> <opt1> <opt2>
```
