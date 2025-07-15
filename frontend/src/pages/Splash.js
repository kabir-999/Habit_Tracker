import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Splash = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F7F7FF' }}>
      <h1 style={{ color: '#7F5AF0', fontSize: '3rem', marginBottom: '1rem' }}>Habit Tracker</h1>
      <p style={{ color: '#1F2937', fontSize: '1.2rem' }}>Build better habits, one day at a time.</p>
    </div>
  );
};

export default Splash; 