import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:4000";

// autoConnect is off so App controls exactly when the socket connects
// (after the user submits a username), rather than on module load.
export const socket = io(SERVER_URL, {
  autoConnect: false,
});
