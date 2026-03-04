import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import api from '../services/api';

export default function ChatWindow({ activeChat }) {
    const { user } = useAuth();
    const { socket } = useSocket();
    const [messages, setMessages] = useState([]);
    const bottomRef = useRef(null);

    // Load messages when active chat changes
    useEffect(() => {
        if (!activeChat) return;
        api.get(`/api/messages/${activeChat._id}`)
            .then(({ data }) => setMessages(data))
            .catch(console.error);
    }, [activeChat]);

    // Listen for incoming socket messages
    useEffect(() => {
        if (!socket) return;
        const handler = (msg) => {
            if (
                (msg.senderId === activeChat?._id) ||
                (msg.receiverId === activeChat?._id)
            ) {
                setMessages((prev) => [...prev, msg]);
            }
        };
        socket.on('newMessage', handler);
        return () => socket.off('newMessage', handler);
    }, [socket, activeChat]);

    // Auto-scroll to latest
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (text) => {
        if (!activeChat) return;
        try {
            const { data } = await api.post(`/api/messages/send/${activeChat._id}`, {
                text,
            });
            setMessages((prev) => [...prev, data]);
        } catch (err) {
            console.error('Send failed:', err);
        }
    };

    if (!activeChat) {
        return (
            <div className="chat-window empty">
                <div className="empty-state">
                    <span className="empty-icon">💬</span>
                    <p>Select a user to start chatting</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-window">
            <div className="chat-window-header">
                <div className="avatar">{activeChat.username?.[0]?.toUpperCase()}</div>
                <div>
                    <span className="chat-user-name">{activeChat.username}</span>
                    <span className="chat-user-email">{activeChat.email}</span>
                </div>
            </div>
            <div className="messages-list">
                {messages.map((msg, i) => (
                    <MessageBubble key={msg._id || i} message={msg} />
                ))}
                <div ref={bottomRef} />
            </div>
            <MessageInput onSend={handleSend} />
        </div>
    );
}
