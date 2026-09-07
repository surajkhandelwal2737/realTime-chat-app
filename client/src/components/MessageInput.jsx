import { useEffect, useRef, useState } from "react";
import "./MessageInput.css";

const TYPING_STOP_DELAY_MS = 1500;

export default function MessageInput({ onSend, onTypingStart, onTypingStop }) {
  const [text, setText] = useState("");
  const isTypingRef = useRef(false);
  const stopTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(stopTimeoutRef.current);
    };
  }, []);

  function handleChange(event) {
    setText(event.target.value);

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      onTypingStart();
    }

    clearTimeout(stopTimeoutRef.current);
    stopTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      onTypingStop();
    }, TYPING_STOP_DELAY_MS);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    onSend(trimmed);
    setText("");

    clearTimeout(stopTimeoutRef.current);
    isTypingRef.current = false;
    onTypingStop();
  }

  return (
    <form className="message-input-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="Write a message…"
        className="message-input-field"
        maxLength={1000}
      />
      <button type="submit" className="message-send-button" disabled={!text.trim()}>
        Send
      </button>
    </form>
  );
}
