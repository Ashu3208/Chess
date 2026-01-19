# Chess — Real-time Multiplayer Chess

A full-stack real-time chess application.
Frontend built with React (Vite), MUI, and Tailwind.
Backend built with Node.js, Express, MongoDB, JWT authentication, and Socket.IO for realtime gameplay.

## Tech Stack

- React 18, Vite
- Material UI (MUI)
- Tailwind CSS
- Node.js, Express
- MongoDB, Mongoose
- JWT authentication
- Socket.IO

## Monorepo Layout

- client/ → React frontend (Vite)
- server/ → Express API + Socket.IO + MongoDB

## Prerequisites

- Node.js ≥ 18 and npm
- A MongoDB instance (local or Atlas)

## Quick Start

1. Install dependencies
   - In client/
     npm install

   - In server/
     npm install

2. Configure environment variables
   - server/.env
     DB_URI=mongodb://localhost:27017/chess
     JWT_SECRET=replace_with_a_long_random_secret
     SERVER_PORT=3000

   - client/.env
     VITE_SERVER_URI=http://localhost:3000

3. Run the servers
   - Start API (from server/)
     node index.js

     # or (recommended during development)

     npx nodemon index.js

   - Start client (from client/)
     npm run dev
     # Vite will print the local URL (typically http://localhost:5173)

## API Overview (server)

Base URL: `http://localhost:3000`

    - GET /user
        Health endpoint for user router.

    - POST /user/register
        Body: { username, email, password }
        → 201 with { token } on success.

    - POST /user/login
        Body: { email, password }
        → 200 with { token } on success.

    - GET /user/valid  (protected)
        Headers: Authorization: Bearer <JWT>
        → 200 with { _id, username, email } if token is valid.

    - GET /game
        Health endpoint for game router.

    - GET /game/new
        → 200 with { newGameId, joinGameId, roomUrl }

    - POST /game/join
        Body: { joinId }
        → 200 with { roomUrl } if valid; 400 otherwise.

## Client Environment

The client expects `VITE_SERVER_URI` to point at the API (e.g., `http://localhost:3000`). Auth token is stored in a cookie named `TOKEN`. On login/register, the client calls `/user/login` and `/user/register`, then validates with `/user/valid`.

## Latest Changes

- Dockerized the server
- Reset password
- Removed custom logic, added chess.js for chess logic and chessground for UI

## Roadmap / ToDo

- Model Games and store them in db
- Use chess and chessground for game play.
- Add loader for smooth transition
- Add and Style the room Id modal and home page popup
- Use tailwind CSS for styling
- Restrict 2 users per game
- Restrict user for playing opponent's pieces
- Provide stats of games played
- Add button to undo moves
- Show moves played on the right hand side
