# Signal — Real-Time Chat

A real-time chat app: **React + Vite (JSX)** on the frontend, **Node + Express + Socket.IO** on the backend. Single room, in-memory only (messages and users reset when the server restarts) — no database or auth, so it's easy to run and extend.

## Features

- Live messaging over WebSockets (Socket.IO)
- Online user list with presence
- "X is typing…" indicator
- Join with just a username (no signup)
- System messages for join/leave
- Last 50 messages replayed to anyone who joins mid-conversation
- ESLint configured (flat config, ESLint 9) for the client

## Project structure

```
realtime-chat-app/
├── server/               # Express + Socket.IO backend
│   ├── index.js
│   └── package.json
└── client/               # React + Vite frontend
    ├── index.html
    ├── vite.config.js
    ├── eslint.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── socket.js
        └── components/
            ├── JoinForm.jsx
            ├── ChatRoom.jsx
            ├── UserList.jsx
            ├── MessageList.jsx
            ├── MessageBubble.jsx
            ├── MessageInput.jsx
            └── TypingIndicator.jsx
```

## Running it

You need two terminals — one for the server, one for the client.

**1. Start the backend**

```bash
cd server
npm install
npm run dev
```

This starts the Socket.IO server on `http://localhost:4000`.

**2. Start the frontend**

```bash
cd client
npm install
npm run dev
```

This starts Vite on `http://localhost:5173`. Open it in two different browser tabs (or windows) and pick two different usernames to see messages arrive in real time.

## Configuration

The client looks for the server at `http://localhost:4000` by default. To point it elsewhere (e.g. a deployed backend), copy `.env.example` to `.env` in `client/` and set:

```
VITE_SERVER_URL=https://your-server-url
```

If you deploy the server somewhere other than `localhost:5173`'s origin, update `CLIENT_ORIGIN` in `server/index.js` (or set it as an env var) so CORS allows your client's domain.

## Linting

```bash
cd client
npm run lint
```

## Extending it

- **Multiple rooms**: add a `room` field to `user:join` and use `socket.join(room)` / `io.to(room).emit(...)` on the server instead of the global `io.emit(...)`.
- **Persistence**: swap `messageHistory` (an in-memory array) for a database call.
- **Auth**: replace the plain-username join with a real login and pass a verified token to the socket handshake.
