import "./TypingIndicator.css";

export default function TypingIndicator({ names }) {
  const label =
    names.length === 1
      ? `${names[0]} is typing`
      : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]} are typing`;

  return (
    <div className="typing-indicator">
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-label">{label}</span>
    </div>
  );
}
