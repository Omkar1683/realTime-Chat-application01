import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export default function ChatSidebar({ users, activeChat, onSelect }) {
    const { user } = useAuth();
    const { onlineUsers } = useSocket();

    const filteredUsers = users.filter((u) => u._id !== user?._id);

    return (
        <aside id="sidebar" className="sidebar">
            <div className="sidebar-header">
                <h3>Chats</h3>
                <span className="online-count">{onlineUsers.length} online</span>
            </div>
            <div className="sidebar-users">
                {filteredUsers.length === 0 && (
                    <p className="no-users">No other users yet</p>
                )}
                {filteredUsers.map((u) => {
                    const isOnline = onlineUsers.includes(u._id);
                    const isActive = activeChat?._id === u._id;
                    return (
                        <div
                            key={u._id}
                            className={`user-item ${isActive ? 'active' : ''}`}
                            onClick={() => onSelect(u)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && onSelect(u)}
                        >
                            <div className="avatar">
                                {u.username?.[0]?.toUpperCase() || '?'}
                                {isOnline && <span className="online-dot" />}
                            </div>
                            <div className="user-info">
                                <span className="user-name">{u.username}</span>
                                <span className={`user-status ${isOnline ? 'online' : 'offline'}`}>
                                    {isOnline ? 'Online' : 'Offline'}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}
