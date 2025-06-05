# Budgetron

[![Docker Publish](https://github.com/raghavan-dev/budgetron/actions/workflows/docker-publish.yml/badge.svg?branch=master)](https://github.com/raghavan-dev/budgetron/actions/workflows/docker-publish.yml) ![version](https://img.shields.io/badge/version-v0.4.2-blue)

Budgetron is a personal budgeting app built with Next.js and Tailwind CSS.

## Getting Started

### Set the environment variables

Copy the `.env.example` file to `.env` and set the environment variables.

| Variable                  | Description                                          |
| ------------------------- | ---------------------------------------------------- |
| DOCKER_PORT               | The port on which the app will run                   |
| AUTH_SECRET               | The secret used for authentication                   |
| AUTH_URL                  | The URL of the authentication service                |
| GOOGLE_CLIENT_ID          | The client ID of the Google Sign In service          |
| GOOGLE_CLIENT_SECRET      | The client secret of the Google Sign In service      |
| DB_URL                    | The URL of the database                              |
| OLLAMA_URL                | The URL of the Ollama service                        |
| OLLAMA_MODEL              | The model used for AI predictions                    |
| EMAIL_PROVIDER_API_KEY    | The API key of the email provider                    |
| EMAIL_PROVIDER_FROM_EMAIL | The email address from which the emails will be sent |
| BLOB_READ_WRITE_TOKEN     | The API token for the Vercel blob storage            |

### Run the app

To run the app in development mode, run the following command:

```bash
pnpm dev
```

To run the app in production mode, run the following command:

```bash
pnpm build
pnpm start
```
