import { useEffect, useRef, useState, useCallback } from "react";
import { socket } from "./socket.js";
import JoinForm from "./components/JoinForm.jsx";
import ChatRoom from "./components/ChatRoom.jsx";
import "./App.css";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [connectionState, setConnectionState] = useState("idle"); // idle | connecting | error
  const [errorMessage, setErrorMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Map());

  const pendingUsernameRef = useRef("");

  useEffect(() => {
    function handleConnect() {
      socket.emit("user:join", pendingUsernameRef.current, (response) => {
        if (!response?.ok) {
          setErrorMessage(response?.error || "Could not join chat");
          setConnectionState("error");
          socket.disconnect();
          return;
        }
        setCurrentUser(response.user);
        setMessages(response.history || []);
        setOnlineUsers(response.users || []);
        setConnectionState("connected");
      });
    }

    function handleConnectError() {
      setErrorMessage("Could not reach the chat server. Is it running?");
      setConnectionState("error");
    }

    function handleNewMessage(message) {
      setMessages((prev) => [...prev, message]);
    }

    function handleSystemMessage(message) {
      setMessages((prev) => [...prev, { ...message, system: true }]);
    }

    function handleUsersUpdate(users) {
      setOnlineUsers(users);
    }

    function handleTypingUpdate({ userId, username, isTyping }) {
      setTypingUsers((prev) => {
        const next = new Map(prev);
        if (isTyping) {
          next.set(userId, username);
        } else {
          next.delete(userId);
        }
        return next;
      });
    }

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("message:new", handleNewMessage);
    socket.on("system:message", handleSystemMessage);
    socket.on("users:update", handleUsersUpdate);
    socket.on("typing:update", handleTypingUpdate);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("message:new", handleNewMessage);
      socket.off("system:message", handleSystemMessage);
      socket.off("users:update", handleUsersUpdate);
      socket.off("typing:update", handleTypingUpdate);
    };
  }, []);

  const handleJoin = useCallback((username) => {
    pendingUsernameRef.current = username;
    setErrorMessage("");
    setConnectionState("connecting");
    socket.connect();
  }, []);

  const handleLeave = useCallback(() => {
    socket.disconnect();
    setCurrentUser(null);
    setMessages([]);
    setOnlineUsers([]);
    setTypingUsers(new Map());
    setConnectionState("idle");
  }, []);

  if (connectionState !== "connected" || !currentUser) {
    return (
      <JoinForm
        onJoin={handleJoin}
        isConnecting={connectionState === "connecting"}
        errorMessage={errorMessage}
      />
    );
  }

  return (
    <ChatRoom
      currentUser={currentUser}
      messages={messages}
      onlineUsers={onlineUsers}
      typingUsers={typingUsers}
      onLeave={handleLeave}
    />
  );
}
