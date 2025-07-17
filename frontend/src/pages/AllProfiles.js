import React, { useEffect, useState } from 'react';
import api from '../api';

const AllProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await api.get('/api/profile/all');
        setProfiles(res.data.profiles);
      } catch (err) {
        setError('Failed to load profiles.');
      }
    };
    fetchProfiles();
  }, []);

  if (error) return <div style={{ color: '#D23939', textAlign: 'center', marginTop: 40 }}>{error}</div>;
  if (!profiles.length) return <div style={{ color: '#0F2C25', textAlign: 'center', marginTop: 40 }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#E9E9E9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 120 }}>
      <div style={{ width: '100%', maxWidth: 600, background: '#fff', borderRadius: 18, boxShadow: '0 4px 32px #5A706C22', padding: '2.5rem 2rem 2rem 2rem', marginBottom: 32 }}>
        <h2 style={{ color: '#0F2C25', fontWeight: 900, fontSize: 28, textAlign: 'center', marginBottom: 32 }}>All Profiles</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {profiles.map(profile => (
            <li key={profile._id} style={{ marginBottom: 18, background: '#F9FAFB', borderRadius: 10, padding: '12px 18px', fontSize: 18, color: '#0F2C25', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span><b>Name:</b> {profile.name}</span>
              <span><b>Age:</b> {profile.age}</span>
              <span><b>Height:</b> {profile.height}</span>
              <span><b>Weight:</b> {profile.weight}</span>
              <span><b>Gender:</b> {profile.gender}</span>
              <span><b>Profession:</b> {profile.profession}</span>
              <span><b>Goal:</b> {profile.goal}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AllProfiles; 