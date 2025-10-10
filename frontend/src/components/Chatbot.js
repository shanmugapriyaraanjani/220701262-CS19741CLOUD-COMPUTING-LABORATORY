import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function Chatbot({ open: openProp, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(openProp !== undefined ? openProp : false);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (typeof openProp === 'boolean') setOpen(openProp);
  }, [openProp]);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setLoading(true);
    setInput('');
    try {
      const res = await axios.post('/api/chat', { message: input });
      setMessages(msgs => [...msgs, { from: 'bot', text: res.data.reply }]);
    } catch (e) {
      setMessages(msgs => [...msgs, { from: 'bot', text: 'Sorry, there was an error.' }]);
    }
    setLoading(false);
  };

  if (!open) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed', bottom: 30, right: 30, zIndex: 1000,
      width: 340, background: 'white', borderRadius: 12, boxShadow: '0 2px 16px #888', display: 'flex', flexDirection: 'column', overflow: 'hidden'
    }}>
      <div style={{ background: '#481f54ff', color: 'white', padding: '0.75rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        GenAI Chatbot
        <button onClick={onClose ? onClose : () => setOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: 20, cursor: 'pointer' }}>&times;</button>
      </div>
      <div style={{ flex: 1, padding: 12, height: 320, overflowY: 'auto', background: '#f8f8fa' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.from === 'user' ? 'right' : 'left', margin: '8px 0' }}>
            <span style={{
              display: 'inline-block',
              background: msg.from === 'user' ? '#e9e9f7' : '#e0d7f7',
              color: '#23153c',
              borderRadius: 8,
              padding: '6px 12px',
              maxWidth: '80%',
              wordBreak: 'break-word'
            }}>{msg.text}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div style={{ display: 'flex', borderTop: '1px solid #eee', padding: 8, background: '#fff' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
          style={{ flex: 1, border: '1px solid #ccc', borderRadius: 6, padding: 8, marginRight: 8 }}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{ background: '#4c1e56ff', color: 'white', border: 'none', borderRadius: 6, padding: '0 16px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
