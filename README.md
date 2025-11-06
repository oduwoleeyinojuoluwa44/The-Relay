# The Relay

**Distributed Real-Time Messaging Engine**

The Relay is a scalable, real-time chat backend built with TypeScript, designed to run locally with SQLite and seamlessly migrate to a production environment using Postgres. It leverages WebSockets for instant communication and Redis Pub/Sub for message synchronization across multiple instances.

## Architecture

```
[Architecture Diagram Placeholder]
```

## Features

-   **Real-Time Communication**: WebSocket-based communication for instant message delivery.
-   **Scalable Architecture**: Distributed message synchronization using Redis Pub/Sub.
-   **Database Flexibility**: Supports both SQLite for local development and Postgres for production.
-   **ORM with Drizzle**: Modern TypeScript ORM for database interactions.
-   **Input Validation**: Zod for robust input validation.
-   **Containerized**: Dockerfile for easy deployment.
-   **Cloud-Ready**: Configuration for Fly.io deployment.

## Tech Stack

-   **Backend**: Node.js, Express, TypeScript
-   **Real-Time**: ws, ioredis
-   **Database**: Drizzle ORM, SQLite, Postgres
-   **Validation**: Zod
-   **Development**: ts-node-dev, ESLint, Prettier

## Local Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/the-relay.git
    cd the-relay
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file by copying the example:

    ```bash
    cp .env.example .env
    ```

    Update the `.env` file with your local configuration:

    ```
    PORT=8080
    REDIS_URL=redis://localhost:6379
    DATABASE_URL=./db.sqlite
    NODE_ENV=development
    ```

4.  **Run database migrations:**

    ```bash
    npm run migrate
    ```

5.  **Start the development server:**

    ```bash
    npm run dev
    ```

    The server will be running at `http://localhost:8080`.

## Commands

-   `npm run dev`: Start the development server with auto-reloading.
-   `npm run build`: Compile TypeScript to JavaScript.
-   `npm run start`: Start the production server.
-   `npm run migrate`: Run database migrations.

## Environment Variables

-   `PORT`: The port for the server to listen on (default: `8080`).
-   `REDIS_URL`: The connection URL for your Redis instance.
-   `DATABASE_URL`: The connection URL for your database (SQLite or Postgres).
-   `NODE_ENV`: The environment mode (`development` or `production`).

## Database Migrations

Drizzle ORM is used for managing database schemas. To create and apply migrations:

1.  **Generate a new migration:**

    ```bash
    npx drizzle-kit generate:pg --schema=src/db/schema.ts --out=migrations
    ```

2.  **Apply migrations:**

    ```bash
    npm run migrate
    ```

## Deployment Guide (Fly.io + Upstash + Neon)

### 1. Upstash (Redis)

1.  Create a new Redis database on [Upstash](https://upstash.com/).
2.  Copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from your Upstash dashboard.
3.  Set the `REDIS_URL` in your Fly.io secrets.

### 2. Neon (Postgres)

1.  Create a new Postgres database on [Neon](https://neon.tech/).
2.  Copy the connection string from your Neon dashboard.
3.  Set the `DATABASE_URL` in your Fly.io secrets.

### 3. Fly.io

1.  **Install the Fly.io CLI:**

    ```bash
    curl -L https://fly.io/install.sh | sh
    ```

2.  **Log in to Fly.io:**

    ```bash
    flyctl auth login
    ```

3.  **Launch the app:**

    ```bash
    flyctl launch
    ```

4.  **Set secrets:**

    ```bash
    flyctl secrets set REDIS_URL="your-upstash-redis-url"
    flyctl secrets set DATABASE_URL="your-neon-postgres-url"
    ```

5.  **Deploy the app:**

    ```bash
    flyctl deploy
    ```
