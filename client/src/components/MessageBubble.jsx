import "./MessageBubble.css";

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MessageBubble({ message, isOwn }) {
  return (
    <div className={`message-row ${isOwn ? "message-row-own" : ""}`}>
      {!isOwn && (
        <span
          className="message-avatar"
          style={{ backgroundColor: message.color }}
        >
          {message.username.charAt(0).toUpperCase()}
        </span>
      )}

      <div className="message-content">
        {!isOwn && <span className="message-author">{message.username}</span>}
        <div className={`message-bubble ${isOwn ? "message-bubble-own" : ""}`}>
          {message.text}
        </div>
        <span className="message-time">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
}
