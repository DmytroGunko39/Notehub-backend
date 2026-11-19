# NoteHub API

NoteHub is a note-taking application. This repository contains its backend: a REST
API built with Express and MongoDB that handles user registration and
authentication, session management with access and refresh tokens, password reset
by email, user profiles, and full CRUD for notes with search, tag filtering and
pagination. Every note belongs to a user and is only ever readable or writable by
its owner. The web client is a separate repository and consumes this API over HTTP.

**Live API:** https://notehub-backend-nke3.onrender.com
**Frontend repository:** https://09-auth-kappa-lyart.vercel.app/

## Tech stack

- **Runtime:** Node.js (ES modules)
- **Framework:** Express 5
- **Database:** MongoDB with Mongoose 9
- **Validation:** Joi
- **Auth:** opaque access/refresh tokens stored in MongoDB, `bcrypt` for password hashing, `cookie-parser` for refresh-token cookies
- **Email:** Brevo transactional email REST API (password reset)
- **Hardening:** `cors`, `express-rate-limit`, `http-errors`
- **Logging:** `pino-http` (`pino-pretty` outside production)
- **Tests:** Vitest
- **Tooling:** ESLint, Prettier, nodemon

## Features

- Email/password registration and login
- Session-based auth: a short-lived access token (30 minutes) sent as a Bearer
  token, plus a refresh token (7 days) stored in an httpOnly cookie
- Session refresh and logout, with token rotation on every refresh
- Password reset by email, using a hashed single-use token valid for one hour
- Get and update the current user profile (name, avatar, email, password)
- Create, read, update and delete notes, scoped to the authenticated user
- List notes with full-text-style search over title and content, tag filtering and
  pagination metadata
- Centralised validation, error handling and 404 handling
- Rate limiting on all authentication routes (100 requests per 15 minutes per IP)

## Getting started

### Prerequisites

- Node.js 22.12 or newer (required by Vitest; Mongoose 9 requires at least 20.19)
- A MongoDB Atlas cluster and a database user
- Optionally, a Brevo account and API key — required only for password reset emails

### Install

```bash
npm install
```

### Environment variables

Create a `.env` file in the project root. The variables below are the ones the code
reads; `src/utils/getEnvVar.js` throws on startup if a required one is missing.

| Variable             | Required        | Purpose                                                                                  |
| -------------------- | --------------- | ---------------------------------------------------------------------------------------- |
| `PORT`               | No              | Port the HTTP server listens on. Defaults to `3000`.                                     |
| `MONGODB_USER`       | Yes             | MongoDB Atlas database user.                                                             |
| `MONGODB_PASSWORD`   | Yes             | Password for that user.                                                                  |
| `MONGODB_URL`        | Yes             | Atlas cluster host, e.g. the `cluster0.xxxxx.mongodb.net` part of the connection string. |
| `MONGODB_DB`         | Yes             | Name of the database to connect to.                                                      |
| `BREVO_API_KEY`      | No              | Brevo API key. If unset, password reset silently skips sending the email.                |
| `BREVO_SENDER_EMAIL` | Only with Brevo | Verified sender address for outgoing email.                                              |
| `BREVO_SENDER_NAME`  | No              | Sender display name. Defaults to `NoteHubApp`.                                           |
| `FRONTEND_URL`       | No              | Base URL used to build the password-reset link. Defaults to `http://localhost:3000`.     |
| `NODE_ENV`           | No              | Set to `production` to disable pretty logging and error stack output.                    |

A template with the same keys and no values is in `.env.example`.

### Run

```bash
npm run dev    # nodemon, reloads on change
npm start      # plain node
npm run lint   # ESLint
```

Note that the allowed CORS origin is currently hardcoded in `src/server.js` and
credentials are enabled, so a frontend served from a different origin needs that
value changed.

## API endpoints

All responses are JSON in the shape `{ status, message, data }`, except `204 No
Content` responses. Routes marked **Bearer** require an `Authorization: Bearer
<accessToken>` header; routes marked **Cookie** read an httpOnly cookie set at login
instead. All `/auth` routes are rate limited.

| Method | Path                    | Auth                    | Description                                                                                                                 |
| ------ | ----------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/auth/register`        | No                      | Register with `email` and `password`. Returns the created user.                                                             |
| POST   | `/auth/login`           | No                      | Log in. Returns an access token and sets the `refreshToken` and `sessionId` cookies.                                        |
| POST   | `/auth/logout`          | Cookie (`sessionId`)    | Delete the session and clear both cookies. Returns `204`.                                                                   |
| GET    | `/auth/session`         | Cookie (`refreshToken`) | Rotate the session and return a fresh access token and the user.                                                            |
| POST   | `/auth/forgot-password` | No                      | Send a password-reset link to `email`. Always responds `200`, whether or not the account exists.                            |
| POST   | `/auth/reset-password`  | No                      | Set a new `password` using the `token` from the reset email. Invalidates all sessions.                                      |
| GET    | `/users/me`             | Bearer                  | Return the authenticated user's profile.                                                                                    |
| PATCH  | `/users/me`             | Bearer                  | Update any of `name`, `avatar`, `email`, `password`.                                                                        |
| GET    | `/notes`                | Bearer                  | List the user's notes. Query: `search`, `tag`, `page` (default `1`), `perPage` (default `10`). Returns pagination metadata. |
| POST   | `/notes`                | Bearer                  | Create a note from `title`, `content` and optional `tag`.                                                                   |
| GET    | `/notes/:noteId`        | Bearer                  | Return one note owned by the user.                                                                                          |
| PATCH  | `/notes/:noteId`        | Bearer                  | Update `title`, `content` or `tag`. At least one field is required.                                                         |
| DELETE | `/notes/:noteId`        | Bearer                  | Delete a note. Returns `204`.                                                                                               |

### Request constraints

- `email` must be a valid address; `password` is 6–100 characters.
- Note `title` is 1–50 characters, `content` is at least 1 character, `tag` is up to
  50 characters and may be null or empty.
- Profile `name` is 2–50 characters and `avatar` must be a URI.
- `:noteId` must be a valid MongoDB ObjectId, otherwise the API responds `400`.
- Password hashes and reset tokens are never included in a user payload.

## Tests

Unit tests run with [Vitest](https://vitest.dev).

```bash
npm test         # run the suite once
npm run test:watch   # watch mode
```

Current coverage is the pure, dependency-free parts of the codebase:

- **Validation schemas** — `createNoteSchema` (title and content bounds, optional tag)
- **Middleware** — `isValidId` (ObjectId format check and the error it forwards)
- **Utilities** — `ctrlWrapper` (error forwarding from async controllers)

Integration tests covering the HTTP routes against a test database are planned.

## Deployment

The API is deployed on [Render](https://render.com) as a web service running
`npm start`. Environment variables are configured in the Render dashboard rather
than from a `.env` file.
