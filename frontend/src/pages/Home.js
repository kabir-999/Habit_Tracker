import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Home.module.css';
import Footer from '../components/Footer';
const features = [
  {
    icon: '📈',
    title: 'Habit Tracking',
    description: 'Easily create, track, and manage your daily habits with intuitive tools.'
  },
  {
    icon: '🏆',
    title: 'Streaks & Rewards',
    description: 'Stay motivated with streaks, achievements, and fun rewards as you progress.'
  },
  {
    icon: '🤖',
    title: 'AI Suggestions',
    description: 'Get personalized habit suggestions powered by AI to help you grow.'
  },
  {
    icon: '📊',
    title: 'Analytics & Progress',
    description: 'Visualize your progress and gain insights with beautiful analytics.'
  }
];

const featureRoutes = [
  '/habit-tracking',
  '/gamification',
  '/ai-suggestions',
  '/analytics'
];

const Home = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.homeContainer}>
      <section className={styles.hero}>
        {/* Hero content only, no image here */}
        <h1 className={styles.title}>HabitWise</h1>
        <p className={styles.tagline}>Build better habits. Achieve your goals. Transform your life.</p>
        {!isLoggedIn && (
          <div className={styles.heroButtons}>
            <button className={styles.getStarted} onClick={() => navigate('/login')}>Get Started</button>
          </div>
        )}
      </section>
      {/* Right-aligned image, outside hero */}
      <section className={styles.featuresSection}>
        <h2 className={styles.featuresHeader}>Features</h2>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 32, width: '100%', maxWidth: 1100, margin: '0 auto' }}>
          {/* First Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32, flex: 1 }}>
            {/* Habit Tracking */}
            <div
              className={styles.featureCard}
              onClick={() => navigate(featureRoutes[0])}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.icon}>
                <img src={process.env.PUBLIC_URL + '/HTF.png'} alt="Habit Tracker" style={{ width: 44, height: 44, objectFit: 'contain', borderRadius: 12 }} />
              </div>
              <h3 className={styles.featureTitle}>{features[0].title}</h3>
              <p className={styles.featureDesc}>{features[0].description}</p>
            </div>
            {/* AI Suggestions */}
            <div
              className={styles.featureCard}
              onClick={() => navigate(featureRoutes[2])}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.icon}>{features[2].icon}</div>
              <h3 className={styles.featureTitle}>{features[2].title}</h3>
              <p className={styles.featureDesc}>{features[2].description}</p>
            </div>
          </div>
          {/* Center Column (Image) */}
          <div className={styles.centerImageWrapper} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 200,width: '200%' }}>
            <img
              src={process.env.PUBLIC_URL + '/H_T_HP.webp'}
              alt="HabitWise Center"
              className={styles.centerImage}
            />
          </div>
          {/* Last Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32, flex: 1 }}>
            {/* Streaks & Rewards */}
            <div
              className={styles.featureCard}
              onClick={() => navigate(featureRoutes[1])}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.icon}>{features[1].icon}</div>
              <h3 className={styles.featureTitle}>{features[1].title}</h3>
              <p className={styles.featureDesc}>{features[1].description}</p>
            </div>
            {/* Analytics & Progress */}
            <div
              className={styles.featureCard}
              onClick={() => navigate(featureRoutes[3])}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.icon}>{features[3].icon}</div>
              <h3 className={styles.featureTitle}>{features[3].title}</h3>
              <p className={styles.featureDesc}>{features[3].description}</p>
            </div>
          </div>
        </div>
      </section>
      {/* Modern CTA Section */}
      <section style={{
        margin: '48px auto 0 auto',
        maxWidth: 800,
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 4px 32px #60A5FA22',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24
      }}>
        <div style={{
          background: '#D1FAE5',
          color: '#22C55E',
          fontWeight: 700,
          borderRadius: 999,
          padding: '0.4rem 1.2rem',
          fontSize: 18,
          marginBottom: 18,
          display: 'inline-block'
        }}>
          <span role="img" aria-label="sparkles">✨</span> Ready to transform your life?
        </div>
        <div style={{
          fontWeight: 900,
          fontSize: 48,
          color: '#1E293B',
          lineHeight: 1.1,
          marginBottom: 12
        }}>
          Ready to build your <span style={{ color: '#4ADE80' }}>next big habit?</span>
        </div>
        <div style={{ color: '#64748B', fontSize: 22, marginBottom: 32 }}>
          Join thousands of users who have already transformed their lives with HabitWise. Start your journey today and see the difference in just 7 days.
        </div>
        <button
          style={{
            background: '#4ADE80',
            color: '#fff',
            fontWeight: 800,
            fontSize: 24,
            border: 'none',
            borderRadius: 16,
            padding: '1rem 2.5rem',
            marginBottom: 18,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #4ade8033',
            transition: 'background 0.2s'
          }}
          onClick={() => navigate('/login')}
        >
          Start Tracking Now <span style={{ fontSize: 22, marginLeft: 8 }}>→</span>
        </button>
        <div style={{ color: '#94A3B8', fontSize: 18 }}>
          ✓ Free to start &nbsp; • &nbsp; ✓ No credit card required
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home; 