import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import styles from './ProfileForm.module.css';

const AiSuggestions = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const res = await api.get('/suggestions');
      setMessages(res.data.map(s => ({ from: 'bot', text: s.message })));
    } catch {
      setError('Failed to load suggestions');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setInput('');
    setLoading(true);
    // Placeholder for Gemini API call, but store in DB
    try {
      const res = await api.post('/suggestions', { message: 'Here is a smart suggestion based on your habits! (Integrate Gemini API here)' });
      setTimeout(() => {
        setMessages(msgs => [...msgs, { from: 'bot', text: res.data.message }]);
        setLoading(false);
      }, 1200);
    } catch {
      setError('Failed to get suggestion');
      setLoading(false);
    }
  };

  return (
    <div className={styles.bg}>
      <div className={styles.card} style={{maxWidth: 500}}>
        <h2 className={styles.title}>🤖 AI Suggestions</h2>
        <div style={{minHeight:120,marginBottom:16}}>
          {messages.map((msg,i)=>(
            <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} style={{textAlign:msg.from==='user'?'right':'left',margin:'8px 0'}}>
              <span style={{display:'inline-block',background:msg.from==='user'?'#60A5FA':'#4ADE80',color:'#fff',borderRadius:16,padding:'8px 16px',maxWidth:'80%',fontSize:15}}>{msg.text}</span>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{color:'#4ADE80',fontSize:15,margin:'8px 0'}}>
              <span>Bot is typing</span>
              <motion.span animate={{opacity:[0,1,0]}} transition={{repeat:Infinity,duration:1}}>...</motion.span>
            </motion.div>
          )}
          {error && <div className={styles.error}>{error}</div>}
        </div>
        <form onSubmit={sendMessage} style={{display:'flex',gap:8}}>
          <input className={styles.input} value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask for a suggestion..." />
          <button className={styles.btn} type="submit" disabled={loading}>Send</button>
        </form>
      </div>
    </div>
  );
};

export default AiSuggestions; 