import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './ProfileForm.module.css';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup = ({ onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const res = await axios.post('/api/auth/signup', { email, password });
      localStorage.setItem('token', res.data.token);
      // Store userId for habit tracking
      if (res.data.userId) {
        localStorage.setItem('userId', res.data.userId);
      } else if (res.data.user && res.data.user._id) {
        localStorage.setItem('userId', res.data.user._id);
      }
      if (onSignup) onSignup();
      navigate('/profile-form');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed.');
    }
  };

  return (
    <div className={styles.bg} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(120deg, #f0fdfa 0%, #e0e7ff 100%)' }}>
      <form className={styles.card} style={{ boxShadow: '0 8px 32px #60A5FA33', borderRadius: 24, padding: '2.5rem 2rem 2rem 2rem', maxWidth: 400, width: '100%' }} onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 40, color: '#4ADE80', marginBottom: 8 }}>🟩</span>
          <h2 className={styles.title} style={{ fontSize: 28, fontWeight: 900, color: '#22C55E', marginBottom: 0 }}>Sign Up</h2>
        </div>
        <div style={{ position: 'relative', marginBottom: 18, width: '100%', maxWidth: '100%' }}>
          <FaEnvelope style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#60A5FA', fontSize: 18 }} />
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ paddingLeft: 40, boxSizing: 'border-box', maxWidth: '100%' }}
          />
        </div>
        <div style={{ position: 'relative', marginBottom: 18, width: '100%', maxWidth: '100%' }}>
          <FaLock style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#60A5FA', fontSize: 18 }} />
          <input
            className={styles.input}
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ paddingLeft: 40, paddingRight: 40, boxSizing: 'border-box', maxWidth: '100%' }}
          />
          <span onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#60A5FA', fontSize: 18 }}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div style={{ position: 'relative', marginBottom: 18, width: '100%', maxWidth: '100%' }}>
          <FaLock style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#60A5FA', fontSize: 18 }} />
          <input
            className={styles.input}
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ paddingLeft: 40, paddingRight: 40, boxSizing: 'border-box', maxWidth: '100%' }}
          />
          <span onClick={() => setShowConfirm(v => !v)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#60A5FA', fontSize: 18 }}>
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <button className={styles.btn} type="submit" style={{ fontSize: 18, borderRadius: 12, marginTop: 8, marginBottom: 8 }}>Sign Up</button>
        <div style={{textAlign: 'center', marginTop: '0.5rem', fontSize: 15, color: '#64748B'}}>
          Already have an account? <Link to="/login" style={{ color: '#60A5FA', fontWeight: 600, textDecoration: 'underline' }}>Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Signup; 