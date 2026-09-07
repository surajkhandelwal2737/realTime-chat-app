import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";
import TypingIndicator from "./TypingIndicator.jsx";
import "./MessageList.css";

export default function MessageList({ messages, currentUserId, typingUsers }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  return (
    <div className="message-list">
      {messages.length === 0 && (
        <p className="message-list-empty">
          No messages yet — say something to get things started.
        </p>
      )}

      {messages.map((message) =>
        message.system ? (
          <p key={message.id} className="system-message">
            {message.text}
          </p>
        ) : (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.userId === currentUserId}
          />
        )
      )}

      {typingUsers.size > 0 && (
        <TypingIndicator names={Array.from(typingUsers.values())} />
      )}

      <div ref={bottomRef} />
    </div>
  );
}
