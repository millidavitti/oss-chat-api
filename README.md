# Setting Up the Express App with Redis and Postgres

## 1. Configure Your Environment

### 1.1 Create a `.env` File

Create a `.env` file in your project root with the following contents:

```env
DATABASE_URL=postgres://postgres:mysecretpassword@localhost:5432/postgres
DATABASE_URL="http://postgres:mysecretpassword@localhost:5050/db_name"
ORIGIN="http://localhost:3000"
AUTH_SECRET=

# Gmail
EMAIL_FROM="badger@monk.com"
EMAIL_SERVER_USER="abuadonald@gmail.com"
EMAIL_SERVER_PASSWORD=
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587

# Node Environment
NODE_ENV="development"

#Google OpenId
REDIRECT_URI=http://localhost:5000/auth/callback/google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

#Redis
REDIS_HOST=
REDIS_PORT=

#Azure OpenAI
OPENAI_ENDPOINT=
OPENAI_API_KEY=

#Azure Identity
AZURE_CLIENT_ID=
```

> **Note**: These assume you're running Redis and Postgres locally via Docker with the default ports and credentials.

---

## 2. Set Up Dependencies

Install dependencies using `pnpm`:

```bash
pnpm install
```

---

## 3. Set Up PostgreSQL and Redis with Docker

### 3.1 Start Redis

```bash
docker run --name some-redis -p 6379:6379 -d redis
```

### 3.2 Start PostgreSQL

```bash
docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
```

### 3.3 Connect to Postgres (Optional)

To verify the DB is running:

```bash
docker exec -it some-postgres psql -U postgres
```

Or from your host (if `psql` CLI is installed):

```bash
psql -h localhost -U postgres
```

---

## 4. Start the Application

Start your development server:

```bash
pnpm dev
```

---

## 5. Test the API

Once running, hit the health check endpoint:

[http://localhost:5000/auth/ping](http://localhost:5000/auth/ping)
