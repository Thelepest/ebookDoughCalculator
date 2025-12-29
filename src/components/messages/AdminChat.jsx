import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { subscribeToAdminMessagesForUser, sendAdminMessage, markAdminMessageRead } from '../../services/firestoreService';
import '../../App.css';
import './AdminChat.css';

const AdminChat = ({ lang }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToAdminMessagesForUser(user.uid, setMessages);
    return () => unsub && unsub();
  }, [user]);

  const handleSend = async () => {
    if (!user || !text.trim()) return;
    await sendAdminMessage(user.uid, { message: text.trim(), fromDisplayName: user.displayName || user.email });
    setText('');
  };

  const handleMarkRead = async (id) => {
    await markAdminMessageRead(id);
  };

  return (
    <div className="page-container">
      <h2 className="section-title">Messages to Admin</h2>
      <div className="content">
        <div className="chat-list">
          {messages.map(m => (
            <div key={m.id} className={`chat-item ${m.read ? 'read' : 'unread'}`}>
              <div className="chat-body">{m.message}</div>
              <div className="chat-meta">{m.fromDisplayName} — {m.createdAt?.toDate ? new Date(m.createdAt.toDate()).toLocaleString() : ''}</div>
              {!m.read && <button className="pages-button" onClick={() => handleMarkRead(m.id)}>Mark read</button>}
            </div>
          ))}
        </div>

        <div className="chat-composer">
          <textarea value={text} onChange={(e)=>setText(e.target.value)} placeholder="Message to admin..." />
          <button className="pages-button" onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
