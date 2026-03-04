import { useState, useEffect } from 'react';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function Chat() {
    const [users, setUsers] = useState([]);
    const [activeChat, setActiveChat] = useState(null);

    useEffect(() => {
        api.get('/api/users')
            .then(({ data }) => setUsers(data))
            .catch(console.error);
    }, []);

    return (
        <div className="chat-layout">
            <Navbar />
            <div className="chat-body">
                <ChatSidebar users={users} activeChat={activeChat} onSelect={setActiveChat} />
                <ChatWindow activeChat={activeChat} />
            </div>
        </div>
    );
}
