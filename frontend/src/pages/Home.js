import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Home.module.css';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';
import FancyJoinButton from '../components/FancyJoinButton';
import LoggedInMessage from '../components/LoggedInMessage';

// SVG icon components for features
const HabitIcon = (
  <img src={process.env.PUBLIC_URL + '/HTF.png'} alt="Habit Tracking" style={{ width: 44, height: 44, objectFit: 'contain', borderRadius: 12, background: '#fff', boxShadow: '0 1px 6px #0002' }} />
);
const StreakIcon = (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6C19 6 19 13 13 17C10 19.5 11 26 19 32C27 26 28 19.5 25 17C19 13 19 6 19 6Z" fill="#FACC15" stroke="#F59E42" strokeWidth="2"/>
    <circle cx="19" cy="23" r="4" fill="#fff"/>
    <circle cx="19" cy="23" r="2" fill="#FACC15"/>
  </svg>
);
const AiIcon = (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="19" cy="19" r="14" fill="#60A5FA"/>
    <rect x="11" y="15" width="16" height="8" rx="4" fill="#fff"/>
    <circle cx="15" cy="19" r="2" fill="#60A5FA"/>
    <circle cx="23" cy="19" r="2" fill="#60A5FA"/>
    <rect x="17" y="23" width="4" height="2" rx="1" fill="#60A5FA"/>
  </svg>
);
const FutureDiaryIcon = (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="8" width="26" height="22" rx="4" fill="#A78BFA"/>
    <rect x="10" y="12" width="18" height="2" rx="1" fill="#fff"/>
    <rect x="10" y="17" width="12" height="2" rx="1" fill="#fff"/>
    <rect x="10" y="22" width="8" height="2" rx="1" fill="#fff"/>
    <circle cx="30" cy="12" r="3" fill="#F87171"/>
  </svg>
);

const features = [
  {
    icon: HabitIcon,
    title: 'Habit Tracking',
    description: 'Easily create, track, and manage your daily habits with intuitive tools.',
    accent: '#4ADE80'
  },
  {
    icon: StreakIcon,
    title: 'Streaks & Rewards',
    description: 'Stay motivated with streaks, achievements, and fun rewards as you progress.',
    accent: '#FACC15'
  },
  {
    icon: AiIcon,
    title: 'AI Suggestions',
    description: 'Get personalized habit suggestions powered by AI to help you grow.',
    accent: '#60A5FA'
  },
  {
    icon: FutureDiaryIcon,
    title: 'Future Diary',
    description: 'Write your future tasks, track them, and get notified when the date arrives!',
    accent: '#A78BFA'
  }
];

const featureRoutes = [
  '/habit-tracking',
  '/gamification',
  '/ai-suggestions',
  '/future-diary'
];

const Home = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  // Helper to handle feature click
  const handleFeatureClick = (route) => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      navigate(route);
    }
  };

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
  <div style={{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: 48,
    width: '100%',
    maxWidth: 1100,
    margin: '0 auto',
    flexWrap: 'wrap',
  }}>
    {/* Left column: 2 features */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, flex: 1, minWidth: 200, alignItems: 'center' }}>
      <FeatureCard
        icon={features[0].icon}
        title={features[0].title}
        description={features[0].description}
        accent={features[0].accent}
        onClick={() => handleFeatureClick(featureRoutes[0])}
      />
      <FeatureCard
        icon={features[1].icon}
        title={features[1].title}
        description={features[1].description}
        accent={features[1].accent}
        onClick={() => handleFeatureClick(featureRoutes[1])}
      />
    </div>
    {/* Center column: image */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 220, maxWidth: 260 }}>
      <img
        src={process.env.PUBLIC_URL + '/H_T_HP.webp'}
        alt="HabitWise Center"
        style={{ width: 220, height: 220, objectFit: 'contain', borderRadius: 24, boxShadow: '0 6px 32px #60a5fa33', background: '#fff' }}
      />
    </div>
    {/* Right column: 2 features */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, flex: 1, minWidth: 200, alignItems: 'center' }}>
      <FeatureCard
        icon={features[2].icon}
        title={features[2].title}
        description={features[2].description}
        accent={features[2].accent}
        onClick={() => handleFeatureClick(featureRoutes[2])}
      />
      <FeatureCard
        icon={features[3].icon}
        title={features[3].title}
        description={features[3].description}
        accent={features[3].accent}
        onClick={() => handleFeatureClick(featureRoutes[3])}
      />
    </div>
  </div>
</section>
<div style={{ display: 'flex', justifyContent: 'center', marginTop: 50, padding: 40 }}>
  {isLoggedIn ? (
    <LoggedInMessage />
  ) : (
    <FancyJoinButton onClick={() => navigate('/login')} />
  )}
</div>
<Footer />
</div>
  );
}

export default Home;