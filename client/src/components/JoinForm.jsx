import { useState } from "react";
import "./JoinForm.css";

export default function JoinForm({ onJoin, isConnecting, errorMessage }) {
  const [username, setUsername] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = username.trim();
    if (!trimmed || isConnecting) return;
    onJoin(trimmed);
  }

  return (
    <div className="join-screen">
      <div className="join-card">
        <p className="join-eyebrow">Signal</p>
        <h1 className="join-title">Pick a name, jump in.</h1>
        <p className="join-subtitle">
          Everyone in the room can see messages the moment you send them.
        </p>

        <form onSubmit={handleSubmit} className="join-form">
          <label htmlFor="username" className="join-label">
            Your name
          </label>
          <input
            id="username"
            className="join-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. Priya"
            maxLength={24}
            autoFocus
            disabled={isConnecting}
          />

          {errorMessage && <p className="join-error">{errorMessage}</p>}

          <button
            type="submit"
            className="join-button"
            disabled={!username.trim() || isConnecting}
          >
            {isConnecting ? "Joining…" : "Join the chat"}
          </button>
        </form>
      </div>
    </div>
  );
}
