import UserList from "./UserList.jsx";
import MessageList from "./MessageList.jsx";
import MessageInput from "./MessageInput.jsx";
import { socket } from "../socket.js";
import "./ChatRoom.css";

export default function ChatRoom({
  currentUser,
  messages,
  onlineUsers,
  typingUsers,
  onLeave,
}) {
  function handleSend(text) {
    socket.emit("message:send", text);
  }

  function handleTypingStart() {
    socket.emit("typing:start");
  }

  function handleTypingStop() {
    socket.emit("typing:stop");
  }

  return (
    <div className="chat-room">
      <aside className="chat-sidebar">
        <div className="chat-sidebar-header">
          <span className="chat-wordmark">Signal</span>
        </div>
        <UserList users={onlineUsers} currentUserId={currentUser.id} />
        <button className="leave-button" onClick={onLeave} type="button">
          Leave chat
        </button>
      </aside>

      <main className="chat-main">
        <header className="chat-header">
          <h1>Main room</h1>
          <p>{onlineUsers.length} online</p>
        </header>

        <MessageList
          messages={messages}
          currentUserId={currentUser.id}
          typingUsers={typingUsers}
        />

        <MessageInput
          onSend={handleSend}
          onTypingStart={handleTypingStart}
          onTypingStop={handleTypingStop}
        />
      </main>
    </div>
  );
}
