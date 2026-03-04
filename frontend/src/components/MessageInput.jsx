import { useState } from 'react';

export default function MessageInput({ onSend }) {
    const [text, setText] = useState('');

    const handleSend = () => {
        const trimmed = text.trim();
        if (!trimmed) return;
        onSend(trimmed);
        setText('');
    };

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="message-input-bar">
            <input
                id="message-input"
                type="text"
                placeholder="Type a message…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKey}
                autoComplete="off"
            />
            <button id="send-btn" className="btn-send" onClick={handleSend}>
                ➤
            </button>
        </div>
    );
}
