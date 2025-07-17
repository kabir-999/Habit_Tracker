import React, { useState, useEffect } from 'react';
import { getFutureDiaryTasks, addFutureDiaryTask, deleteFutureDiaryTask } from '../api';

const userId = localStorage.getItem('userId'); // Use real userId from localStorage

const FutureDiary = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', date: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getFutureDiaryTasks(userId)
      .then(setTasks)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date) return;
    try {
      const newTask = await addFutureDiaryTask(userId, {
        title: form.title,
        description: form.description,
        dueDate: form.date,
      });
      setTasks([...tasks, newTask]);
      setForm({ title: '', description: '', date: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFutureDiaryTask(id);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #0001' }}>
      <h2>Future Diary</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Task Title"
          required
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description (optional)"
          rows={3}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
          style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: 10, borderRadius: 6, background: '#A78BFA', color: '#fff', border: 'none', fontWeight: 'bold' }}>
          Add Task
        </button>
      </form>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      <h3>Upcoming Tasks</h3>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.length === 0 && <li>No future tasks yet.</li>}
          {tasks.map(task => (
            <li key={task._id} style={{ marginBottom: 18, padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
              <div style={{ fontWeight: 'bold' }}>{task.title}</div>
              <div style={{ color: '#666', fontSize: 14 }}>{task.description}</div>
              <div style={{ color: '#A78BFA', fontSize: 13 }}>Due: {task.dueDate ? task.dueDate.slice(0,10) : ''}</div>
              <button onClick={() => handleDelete(task._id)} style={{ marginTop: 8, background: '#F87171', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FutureDiary; 