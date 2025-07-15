import React, { useState } from 'react';

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Hi! I am your AI Coach. How can I help you with your habits today?' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setInput('');
    // Here you would call the Gemini API and append the AI response
    setTimeout(() => {
      setMessages(msgs => [...msgs, { from: 'ai', text: 'This is a sample AI response. (Integrate Gemini API here)' }]);
    }, 1000);
  };

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #7F5AF033', padding: 24 }}>
      <h2 style={{ color: '#7F5AF0', marginBottom: 16 }}>AI Coach</h2>
      <div style={{ minHeight: 200, maxHeight: 300, overflowY: 'auto', marginBottom: 16, background: '#F7F7FF', borderRadius: 8, padding: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.from === 'user' ? 'right' : 'left', margin: '8px 0' }}>
            <span style={{
              display: 'inline-block',
              background: msg.from === 'user' ? '#7F5AF0' : '#2CB67D',
              color: '#fff',
              borderRadius: 16,
              padding: '8px 16px',
              maxWidth: '80%',
              fontSize: 15
            }}>{msg.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
        />
        <button type="submit" style={{ background: '#FF8906', color: '#fff', border: 'none', borderRadius: 8, padding: '0 18px', fontWeight: 'bold', fontSize: 16 }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default AIChatbot; 