import React, { useState, useRef, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const BOT_AVATAR = '🤖';
const USER_AVATAR = '🧑';

const AiSuggestions = () => {
  const [chats, setChats] = useState([]); // all chat threads
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const threadRef = useRef(null);
  const userId = localStorage.getItem('userId');

  // Fetch all chat threads on mount, then start a new chat
  useEffect(() => {
    const fetchChats = async () => {
      if (!userId) return;
      try {
        const res = await api.get(`/ai/chats?userId=${userId}`);
        setChats(res.data.chats || []);
        // Check last exit time
        const lastExit = localStorage.getItem('aiSuggestionsLastExit');
        const now = Date.now();
        let openNew = false;
        if (!lastExit || now - Number(lastExit) > 6000) {
          openNew = true;
        }
        if (openNew || !res.data.chats || res.data.chats.length === 0) {
          // Start a new chat
          const newRes = await api.post('/ai/chat/new', { userId });
          setCurrentChatId(newRes.data.chatId);
          setMessages([]);
          // Refetch chats to include the new one
          const updated = await api.get(`/ai/chats?userId=${userId}`);
          setChats(updated.data.chats || []);
        } else {
          // Resume last chat
          const lastChat = res.data.chats[res.data.chats.length - 1];
          setCurrentChatId(lastChat.chatId);
        }
      } catch (err) {
        setChats([]);
      }
    };
    fetchChats();
    // On unmount, store exit time
    return () => {
      localStorage.setItem('aiSuggestionsLastExit', Date.now().toString());
    };
  }, [userId]);

  // Fetch messages for selected chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId || !currentChatId) return;
      try {
        const res = await api.get(`/ai/chat?userId=${userId}&chatId=${currentChatId}`);
        setMessages(res.data.messages || []);
      } catch {
        setMessages([]);
      }
    };
    fetchMessages();
  }, [userId, currentChatId]);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    // Scroll chat to top on mount
    if (threadRef.current) {
      threadRef.current.scrollTop = 0;
    }
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !currentChatId) return;
    setMessages([...messages, { from: 'user', text: input, ts: new Date() }]);
    setInput('');
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/ai/chat', { userId, chatId: currentChatId, message: input });
      setMessages(msgs => [...msgs, { from: 'bot', text: res.data.reply, ts: new Date() }]);
      // Refetch chats to update sidebar
      const updated = await api.get(`/ai/chats?userId=${userId}`);
      setChats(updated.data.chats || []);
    } catch {
      setError('Failed to get suggestion');
    }
    setLoading(false);
  };

  // Create a new chat thread
  const handleNewChat = async () => {
    if (!userId) return;
    const res = await api.post('/ai/chat/new', { userId });
    setCurrentChatId(res.data.chatId);
    setMessages([]);
    // Refetch chats
    const updated = await api.get(`/ai/chats?userId=${userId}`);
    setChats(updated.data.chats || []);
  };

  // Delete a chat thread
  const handleDeleteChat = async (chatId) => {
    if (!userId || !chatId) {
      setError('Invalid user or chat.');
      return;
    }
    try {
      await api.delete(`/ai/chat?userId=${userId}&chatId=${chatId}`);
      // If deleting current chat, start a new one
      if (chatId === currentChatId) {
        await handleNewChat();
      } else {
        // Refetch chats
        const updated = await api.get(`/ai/chats?userId=${userId}`);
        setChats(updated.data.chats || []);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Chat thread not found.');
      } else {
        setError('Failed to delete chat. Please try again.');
      }
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw', background: '#0F2C25', display: 'flex', flexDirection: 'column', color: '#E9E9E9', overflow: 'hidden', position: 'fixed', top: 0, left: 0 }}>
      {/* Main content: sidebar + chat */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Sidebar (chat history) */}
        <aside style={{
          width: 180,
          background: '#182f28',
          borderRight: '1.5px solid #5A706C',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px 0',
          minHeight: '100vh',
          boxSizing: 'border-box',
        }}>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 18, color: '#E9E9E9', letterSpacing: 1 }}>💬 Chats</div>
          <button onClick={handleNewChat} style={{ background: '#5A706C', color: '#E9E9E9', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15, marginBottom: 18, cursor: 'pointer' }}>+ New Chat</button>
          <div className="chat-history-scroll" style={{ width: '100%', padding: '0 8px', flex: 1, overflowY: 'auto', position: 'relative' }}>
            {chats.map((chat) => (
              <div key={chat.chatId} style={{ background: chat.chatId === currentChatId ? '#A6AB9F' : '#5A706C', borderRadius: 10, padding: '12px 10px', marginBottom: 10, cursor: 'pointer', color: chat.chatId === currentChatId ? '#0F2C25' : '#E9E9E9', position: 'relative', minHeight: 48, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                onClick={() => setCurrentChatId(chat.chatId)}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{chat.title || 'New Chat'}</div>
                <div style={{ fontSize: 12, color: chat.chatId === currentChatId ? '#0F2C25' : '#A6AB9F', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {chat.lastMessage ? (chat.lastMessage.text.length > 30 ? chat.lastMessage.text.slice(0, 30) + '...' : chat.lastMessage.text) : 'No messages yet.'}
                </div>
                <button onClick={e => { e.stopPropagation(); handleDeleteChat(chat.chatId); }} style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', color: chat.chatId === currentChatId ? '#0F2C25' : '#E9E9E9', fontWeight: 900, fontSize: 16, cursor: 'pointer' }} title="Delete chat">×</button>
              </div>
            ))}
          </div>
        </aside>
        {/* Main chat area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', position: 'relative', overflow: 'hidden' }}>
          {/* Chat thread */}
          <div ref={threadRef} style={{ flex: 1, overflowY: 'auto', padding: '24px 0 90px 0', margin: '0 auto', maxWidth: 700, width: '100%', display: 'flex', flexDirection: 'column', gap: 18, boxSizing: 'border-box' }}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex',
                  flexDirection: msg.from === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  gap: 16,
                  width: '100%',
                }}
              >
                <div style={{ fontSize: 28, marginTop: 2 }}>{msg.from === 'user' ? USER_AVATAR : BOT_AVATAR}</div>
                <div style={{
                  background: msg.from === 'user' ? '#5A706C' : '#E9E9E9',
                  color: msg.from === 'user' ? '#E9E9E9' : '#0F2C25',
                  borderRadius: 18,
                  padding: '18px 22px',
                  maxWidth: 520,
                  fontSize: 17,
                  boxShadow: '0 2px 8px #5A706C33',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-line',
                  minWidth: 0,
                  flex: 1,
                  textAlign: msg.from === 'user' ? 'right' : 'left', // bot always left
                  marginLeft: msg.from === 'user' ? 0 : 0,
                  marginRight: msg.from === 'user' ? 0 : 0,
                }}>
                  {msg.from === 'bot' ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
                  <div style={{ fontSize: 12, color: '#A6AB9F', marginTop: 8, textAlign: msg.from === 'user' ? 'right' : 'left' }}>
                    {msg.ts && new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#A6AB9F', fontSize: 17, margin: '8px 0' }}>
                <span>Bot is typing</span>
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }}>...</motion.span>
              </motion.div>
            )}
            {error && <div style={{ color: '#D23939', fontWeight: 600 }}>{error}</div>}
          </div>
          {/* Input area */}
          <form onSubmit={sendMessage} style={{ position: 'fixed', bottom: 0, left: 180, right: 0, background: '#182f28', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px 0', boxShadow: '0 -2px 16px #5A706C', zIndex: 10 }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything..."
              style={{
                background: '#0F2C25',
                color: '#E9E9E9',
                border: '1.5px solid #5A706C',
                borderRadius: 10,
                fontSize: 17,
                padding: '10px 14px',
                flex: 1,
                minHeight: 36,
                maxHeight: 90,
                resize: 'vertical',
                marginRight: 12,
                outline: 'none',
                boxShadow: '0 2px 8px #5A706C33',
                overflow: 'auto',
                maxWidth: 600,
              }}
              rows={1}
              onInput={e => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                background: '#5A706C',
                color: '#E9E9E9',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 18,
                padding: '10px 24px',
                border: 'none',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                minHeight: 36,
              }}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AiSuggestions; 