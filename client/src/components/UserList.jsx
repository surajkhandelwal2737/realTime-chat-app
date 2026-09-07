import "./UserList.css";

export default function UserList({ users, currentUserId }) {
  return (
    <div className="user-list">
      <p className="user-list-label">Online — {users.length}</p>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="user-list-item">
            <span
              className="user-avatar"
              style={{ backgroundColor: user.color }}
            >
              {user.username.charAt(0).toUpperCase()}
            </span>
            <span className="user-name">
              {user.username}
              {user.id === currentUserId ? " (you)" : ""}
            </span>
            <span className="user-online-dot" aria-hidden="true" />
          </li>
        ))}
      </ul>
    </div>
  );
}
