import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Chatbot.module.css';
import api from '../api';

const AIChatbot = ({ userId }) => {
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Hi! I am your AI Coach. How can I help you with your habits today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const threadRef = useRef(null);

  // Helper to fetch user profile
  const fetchUserProfile = async () => {
    try {
      const res = await api.get('/profile');
      return res.data.profile;
    } catch {
      return null;
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setLoading(true);
    setInput('');
    try {
      // Fetch user profile
      const profile = await fetchUserProfile();
      if (!profile) {
        setMessages(msgs => [...msgs, { from: 'ai', text: 'Sorry, could not load your profile.' }]);
        setLoading(false);
        return;
      }
      // Call Vercel AI endpoint
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, profile })
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, { from: 'ai', text: data.reply }]);
    } catch {
      setMessages(msgs => [...msgs, { from: 'ai', text: 'Sorry, something went wrong.' }]);
    }
    setLoading(false);
    setTimeout(() => {
      if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }, 100);
  };

  return (
    <div className={styles.chatbotContainer + (collapsed ? ' ' + styles.collapsed : '')}>
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            className={styles.body}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.thread} ref={threadRef}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={msg.from === 'user' ? styles.userMsg : styles.botMsg}
                  initial={{ opacity: 0, x: msg.from === 'user' ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  {msg.text}
                </motion.div>
              ))}
              {loading && (
                <motion.div className={styles.botMsg} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <span className={styles.typing}>
                    <span>.</span><span>.</span><span>.</span>
                  </span>
                </motion.div>
              )}
            </div>
            <form onSubmit={sendMessage} className={styles.inputRow} autoComplete="off">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message..."
                className={styles.input}
                disabled={loading}
              />
              <button type="submit" className={styles.sendBtn} disabled={loading || !input.trim()}>
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChatbot; 