# Budgetron

[![Build](https://github.com/budgetron-org/budgetron/actions/workflows/check-build.yml/badge.svg?branch=master)](https://github.com/budgetron-org/budgetron/actions/workflows/check-build.yml) [![Docker Image](https://github.com/budgetron-org/budgetron/actions/workflows/docker-publish.yml/badge.svg?branch=master)](https://github.com/budgetron-org/budgetron/actions/workflows/docker-publish.yml) ![version](https://img.shields.io/badge/version-v0.3.0-blue)

A full-featured personal budgeting app built with [Next.js](https://nextjs.org/), [Drizzle ORM](https://orm.drizzle.team/), and [PostgreSQL](https://www.postgresql.org/), with AI-powered transaction categorization using local LLMs or OpenAI-compatible APIs.

## ✨ Features

- 🚀 Modern App Router architecture
- 🔐 Authentication via BetterAuth with Google & custom OAuth support
- 💾 PostgreSQL + Drizzle ORM
- 📊 Budgeting, reporting, and transaction insights
- 🧠 AI transaction categorization (local or remote)
- 📤 Blob upload, email notifications, and more
- 🐳 Dockerized and production-ready

## 📦 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript
- **Backend**: Drizzle ORM, oRPC, PostgreSQL
- **AI**: Local LLaMA 3 or OpenAI-compatible APIs (Ollama, OpenAI)
- **UI**: shadcn/ui + Tailwind CSS
- **Auth**: BetterAuth
- **Infra**: Docker, Postgres

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/raghavan-dev/budgetron.git
cd budgetron
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Copy the example file:

```bash
cp .env.example .env
```

Then fill in your actual values.

## ⚙️ Environment Variables

> These should be configured in `.env` or passed in at container runtime.

### 🔧 Docker (optional)

> Required only if you want to override the default port for Docker.

| Variable      | Description                                   | Required |
| ------------- | --------------------------------------------- | -------- |
| `DOCKER_PORT` | Port to expose the container (default `3000`) | ❌       |

### 🔐 Authentication

| Variable      | Description                                      | Required |
| ------------- | ------------------------------------------------ | -------- |
| `AUTH_SECRET` | JWT secret for session encryption                | ✅ Yes   |
| `AUTH_URL`    | Public app URL (e.g., `https://app.example.com`) | ✅ Yes   |

### 🔓 Google Sign-In (optional)

> Required only if you want to use Google sign-in.

| Variable               | Description                | Required |
| ---------------------- | -------------------------- | -------- |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID     | ❌       |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | ❌       |

### 🪪 Custom OAuth (optional)

> Required only if you want to use custom OAuth providers.

| Variable                   | Description                         | Required |
| -------------------------- | ----------------------------------- | -------- |
| `OAUTH_CLIENT_ID`          | OAuth client ID                     | ❌       |
| `OAUTH_CLIENT_SECRET`      | OAuth client secret                 | ❌       |
| `OAUTH_PROVIDER_NAME`      | Display name of your OAuth provider | ❌       |
| `OPENID_CONFIGURATION_URL` | OpenID config discovery URL         | ❌       |

### 🛢️ Database

| Variable | Description                  | Required |
| -------- | ---------------------------- | -------- |
| `DB_URL` | PostgreSQL connection string | ✅ Yes   |

### 🧠 AI Provider (optional)

> Required only if you want AI-based transaction categorization.

| Variable                     | Description                                    | Required |
| ---------------------------- | ---------------------------------------------- | -------- |
| `OPENAI_COMPATIBLE_PROVIDER` | Friendly name (e.g., `ollama`, `groq`)         | ❌       |
| `OPENAI_COMPATIBLE_BASE_URL` | Base URL of the provider’s API                 | ❌       |
| `OPENAI_COMPATIBLE_API_KEY`  | API key for the provider                       | ❌       |
| `OPENAI_COMPATIBLE_MODEL`    | Model to use (e.g., `llama3`, `mixtral`, etc.) | ❌       |

### 📧 Email Provider (optional)

> Required only if you want to support password reset, account deletion, etc.

| Variable                    | Description                             | Required |
| --------------------------- | --------------------------------------- | -------- |
| `EMAIL_PROVIDER_API_KEY`    | API key for email service (e.g. Resend) | ❌       |
| `EMAIL_PROVIDER_FROM_EMAIL` | From email address                      | ❌       |

### 📦 Blob Storage (optional)

> Required only if you want to support profile picture uploads.

| Variable                | Description                                     | Required |
| ----------------------- | ----------------------------------------------- | -------- |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob Read/Write Token (for file uploads) | ❌       |

## 🐳 Docker Usage

### Build the image

```bash
docker build -t budgetron .
```

### Run the container

```bash
docker run -e DB_URL="postgres://user:pass@host:5432/db" -e AUTH_SECRET="your-secret" -e AUTH_URL="https://app.example.com" -p 3000:3000 budgetron
```

The app will:

1. Wait for the DB to be ready
2. Apply Drizzle migrations
3. Start the server

## 🧪 Local Development

### Start dev server

```bash
pnpm dev
```

### Apply migrations

```bash
pnpm run db:migrate
```

## 📁 Project Structure

```
src/
  app/         # Route handlers (App Router)
  components/  # UI components (shadcn ui and other ui components)
  data/        # Static data for the app
  emails/      # Email templates
  env/         # Runtime env validation
  features/    # Business logic (budgeting, auth, reports, etc.)
  hooks/       # Custom hooks
  lib/         # Utility functions
  providers/   # Custom React providers
  rpc/         # oRPC configuration
  server/      # Server-side logic (DB, AI, email, and auth logic)
  types/       # Custom typeScript types
```
