import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Future Diary API
export async function getFutureDiaryTasks(userId) {
  const res = await fetch(`${baseURL}/future-diary?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch future diary tasks');
  return res.json();
}

export async function addFutureDiaryTask(userId, task) {
  const res = await fetch(`${baseURL}/future-diary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...task, userId }),
  });
  if (!res.ok) throw new Error('Failed to add future diary task');
  return res.json();
}

export async function deleteFutureDiaryTask(id) {
  const res = await fetch(`${baseURL}/future-diary/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete future diary task');
  return res.json();
}

// Notifications API
export async function getNotifications(userId) {
  const res = await fetch(`${baseURL}/future-diary/notifications?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json(); // Now returns all notifications, including read status
}

export async function checkDueDiaryTasks() {
  const res = await fetch(`${baseURL}/future-diary/check-due`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to check due diary tasks');
  return res.json();
}

export async function markNotificationsRead(userId) {
  const res = await fetch(`${baseURL}/future-diary/notifications/read`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  if (!res.ok) throw new Error('Failed to mark notifications as read');
  return res.json();
} 