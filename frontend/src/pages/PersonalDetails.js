import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const fieldLabels = {
  name: 'Name',
  age: 'Age',
  height: 'Height (cm)',
  weight: 'Weight (kg)',
  gender: 'Gender',
  profession: 'Profession',
  goal: 'Main Goal',
};

const PersonalDetails = ({ onLogout }) => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        setProfile(res.data.profile);
        setEditForm(res.data.profile);
      } catch (err) {
        setError('Failed to load profile.');
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditForm(profile);
    setEditMode(false);
  };
  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
    try {
      const res = await api.put('/profile', editForm);
      setProfile(res.data.profile);
      setEditMode(false);
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  if (error) return <div style={{ color: '#D23939', textAlign: 'center', marginTop: 40 }}>{error}</div>;
  if (!profile) return <div style={{ color: '#0F2C25', textAlign: 'center', marginTop: 40 }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#E9E9E9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 120 }}>
      <div style={{ width: '100%', maxWidth: 500, background: '#fff', borderRadius: 18, boxShadow: '0 4px 32px #5A706C22', padding: '2.5rem 2rem 2rem 2rem', marginBottom: 32 }}>
        <h2 style={{ color: '#0F2C25', fontWeight: 900, fontSize: 28, textAlign: 'center', marginBottom: 32 }}>Personal Details</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {Object.keys(fieldLabels).map(key => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 18, color: '#0F2C25', background: '#F9FAFB', borderRadius: 10, padding: '12px 18px', marginBottom: 4 }}>
              <span style={{ fontWeight: 700 }}>{fieldLabels[key]}</span>
              {editMode ? (
                <input
                  name={key}
                  value={editForm[key] || ''}
                  onChange={handleChange}
                  style={{ color: '#5A706C', fontWeight: 500, fontSize: 18, border: '1px solid #e5e7eb', borderRadius: 6, padding: '6px 10px', width: 180 }}
                />
              ) : (
                <span style={{ color: '#5A706C', fontWeight: 500 }}>{profile[key] || '-'}</span>
              )}
            </div>
          ))}
        </div>
        {editMode ? (
          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            <button onClick={handleSave} style={{ flex: 1, background: '#4ADE80', color: '#fff', fontWeight: 800, fontSize: '1.1rem', border: 'none', borderRadius: '1rem', padding: '0.8rem 0', cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 2px 8px #5A706C' }}>Save</button>
            <button onClick={handleCancel} style={{ flex: 1, background: '#D23939', color: '#fff', fontWeight: 800, fontSize: '1.1rem', border: 'none', borderRadius: '1rem', padding: '0.8rem 0', cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 2px 8px #5A706C' }}>Cancel</button>
          </div>
        ) : (
          <button onClick={handleEdit} style={{ width: '100%', background: '#4ADE80', color: '#fff', fontWeight: 800, fontSize: '1.1rem', border: 'none', borderRadius: '1rem', padding: '0.8rem 0', marginTop: '2rem', cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 2px 8px #5A706C' }}>Edit</button>
        )}
        <button onClick={handleLogout} style={{ width: '100%', background: '#D23939', color: '#E9E9E9', fontWeight: 800, fontSize: '1.1rem', border: 'none', borderRadius: '1rem', padding: '0.8rem 0', marginTop: '1rem', cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 2px 8px #5A706C' }}>Logout</button>
      </div>
    </div>
  );
};

export default PersonalDetails; 