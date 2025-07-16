import React, { useState, useEffect } from 'react';
import api from '../api';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './ProfileForm.module.css';
import { FaPlus, FaTrash } from 'react-icons/fa';

const HabitTracking = () => {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [error, setError] = useState('');
  const [emojiLogs, setEmojiLogs] = useState({}); // { habitId: { 'YYYY-MM-DD': { emoji, _id } } }
  const userId = localStorage.getItem('userId') || '';

  useEffect(() => {
    fetchHabits();
    fetchEmojiLogs();
  }, []);

  const fetchHabits = async () => {
    try {
      const res = await api.get(`/habits?userId=${userId}`);
      setHabits(res.data);
    } catch (err) {
      setError('Failed to load habits');
    }
  };

  const fetchEmojiLogs = async () => {
    try {
      const res = await api.get(`/habit-emoji-logs?userId=${userId}`);
      // Convert to { habitId: { date: { emoji, _id } } }
      const logs = {};
      res.data.forEach(log => {
        if (!logs[log.habitId]) logs[log.habitId] = {};
        logs[log.habitId][log.date] = { emoji: log.emoji, _id: log._id };
      });
      setEmojiLogs(logs);
    } catch (err) {
      setError('Failed to load emoji logs');
    }
  };

  const addHabit = async (e) => {
    e.preventDefault();
    setError("");
    if (!userId || userId.length !== 24) {
      setError("User ID is missing or invalid. Please log in again.");
      return;
    }
    if (!newHabit.trim()) {
      setError("Please enter a habit name.");
      return;
    }
    try {
      const payload = {
        userId: userId,
        title: newHabit,
        frequency: 'Daily',
        startDate: new Date().toISOString()
      };
      const res = await api.post('/habits', payload);
      setHabits([...habits, res.data]);
      setNewHabit('');
    } catch (err) {
      setError('Failed to add habit: ' + (err.response?.data?.msg || 'Unknown error'));
    }
  };

  const deleteHabit = async (id) => {
    try {
      await api.delete(`/habits/${id}?userId=${userId}`);
      // Optimistically update UI
      setHabits(prev => prev.filter(habit => habit._id !== id));
      setEmojiLogs(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch {
      setError('Failed to delete habit');
    }
  };

  const toggleHabitCompleted = async (habitId, completed) => {
    try {
      const res = await api.patch(`/habits/${habitId}/completed`, { userId, completed });
      setHabits(prev => prev.map(h => h._id === habitId ? { ...h, completed: res.data.completed } : h));
    } catch (err) {
      setError('Failed to update habit completion');
    }
  };

  // Handle emoji marking for a habit on a date
  const handleEmojiDay = async (habitId, date) => {
    const dayKey = date.toISOString().slice(0, 10);
    // Prevent adding emoji on future dates
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight
    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);
    if (selected > today) {
      setError('Cannot add emoji on future dates.');
      return;
    }
    let emoji = prompt('Enter an emoji to mark this day (leave blank for 🔥, or type - to remove):');
    if (emoji === '-') {
      // Remove emoji: find log _id and delete from backend
      const logId = emojiLogs[habitId]?.[dayKey]?._id;
      if (logId) {
        await api.delete(`/habit-emoji-logs/${logId}`);
      }
      setEmojiLogs(prev => {
        const habitLog = { ...(prev[habitId] || {}) };
        delete habitLog[dayKey];
        return { ...prev, [habitId]: habitLog };
      });
      return;
    }
    if (!emoji || !emoji.trim()) {
      emoji = '🔥';
    }
    // Save to backend
    try {
      const res = await api.post('/habit-emoji-logs', {
        habitId,
        date: dayKey,
        emoji
      });
      setEmojiLogs(prev => {
        const habitLog = { ...(prev[habitId] || {}) };
        habitLog[dayKey] = { emoji: res.data.emoji, _id: res.data._id };
        return { ...prev, [habitId]: habitLog };
      });
    } catch (err) {
      setError('Failed to save emoji');
    }
  };

  return (
    <div className={styles.bg}>
      <div className={styles.habitTop}>
        <h1 style={{ fontWeight: 900, fontSize: 32, color: '#22C55E', marginBottom: 16 }}>
          <span style={{ fontSize: 32, marginRight: 10 }}>🟩</span> Habit Tracking
        </h1>
        <form onSubmit={addHabit} style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 24, width: '100%' }}>
          <input className={styles.input} value={newHabit} onChange={e => setNewHabit(e.target.value)} placeholder="New Habit" />
          <button className={styles.btn} type="submit" style={{ minWidth: 100, fontSize: 18 }}><FaPlus /> Add</button>
        </form>
        {error && <div className={styles.error}>{error}</div>}
      </div>
      <div className={styles.habitList}>
        {habits.map(habit => (
          <div key={habit._id} className={styles.habitCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, width: '100%' }}>
              <div style={{ fontWeight: 700, fontSize: 20 }}>{habit.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={!!habit.completed} onChange={e => toggleHabitCompleted(habit._id, e.target.checked)} title="Mark as completed" />
                <button onClick={() => deleteHabit(habit._id)} style={{ background: 'none', border: 'none', color: '#F87171', fontSize: 22, cursor: 'pointer' }} title="Delete"><FaTrash /></button>
              </div>
            </div>
            <div style={{ color: '#22C55E', fontWeight: 600, marginBottom: 8 }}>Start: {habit.startDate ? new Date(habit.startDate).toLocaleDateString() : ''}</div>
            <div style={{ position: 'relative' }}>
              <Calendar
                value={null}
                tileContent={({ date }) => {
                  const dayKey = date.toISOString().slice(0, 10);
                  const emoji = emojiLogs[habit._id]?.[dayKey]?.emoji;
                  return emoji ? <span style={{ fontSize: 22 }}>{emoji}</span> : null;
                }}
                onClickDay={date => !habit.completed && handleEmojiDay(habit._id, date)}
                className={styles.calendar}
              />
              {habit.completed && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(46, 204, 113, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                  zIndex: 2,
                  animation: 'fadeIn 0.5s',
                }}>
                  <span className="calendarCompletedText">COMPLETED</span>
                </div>
              )}
            </div>
            <span style={{ fontSize: 12, color: '#6b7280', marginTop: 4, display: 'block' }}>Click a date to mark with an emoji</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitTracking; 