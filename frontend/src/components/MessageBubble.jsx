import { useAuth } from '../context/AuthContext';

export default function MessageBubble({ message }) {
    const { user } = useAuth();
    const isSender = message.senderId === user?._id || message.sender?._id === user?._id;

    const time = new Date(message.createdAt || Date.now()).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className={`message-bubble ${isSender ? 'sent' : 'received'}`}>
            <div className="bubble-content">
                <span className="message-text">{message.message || message.text}</span>
                <span className="message-time">{time}</span>
            </div>
        </div>
    );
}
