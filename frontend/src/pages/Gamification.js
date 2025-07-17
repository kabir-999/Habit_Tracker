import React, { useEffect, useState } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import styles from './ProfileForm.module.css';

const Gamification = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
    // Remove xp-awarded event listener since SpinWheel is deleted
    // const handleXpAwarded = () => {
    //   fetchData();
    // };
    // window.addEventListener('xp-awarded', handleXpAwarded);
    // return () => {
    //   window.removeEventListener('xp-awarded', handleXpAwarded);
    // };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/gamification');
      setData(res.data);
    } catch {
      setError('Failed to load gamification data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A6AB9F' }}>Loading...</div>;
  if (error) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D23939', fontWeight: 700 }}>{error}</div>;
  if (!data) return null;

  // Helper: fallback for missing data
  const safe = (val, fallback = 0) => (val === undefined || val === null ? fallback : val);

  // Placeholder/fallbacks
  const xp = safe(data?.xp);
  const level = safe(data?.level, 1);
  const streak = safe(data?.streak);
  const longestStreak = safe(data?.longestStreak); // Not in backend, so will be 0
  const habitsCompleted = safe(data?.habitsCompleted);
  const daysActive = safe(data?.daysActive);
  const badges = Array.isArray(data?.badges) ? data.badges : [];

  // Badge tiers and requirements
  const badgeTiers = [
    { name: 'Bronze', level: 10, emoji: '🥉', description: 'Reached Level 10' },
    { name: 'Silver', level: 30, emoji: '🥈', description: 'Reached Level 30' },
    { name: 'Gold', level: 50, emoji: '🥇', description: 'Reached Level 50' },
    { name: 'Platinum', level: 75, emoji: '🏆', description: 'Reached Level 75' },
    { name: 'Diamond', level: 100, emoji: '💎', description: 'Reached Level 100' }
  ];
  const userBadgeNames = badges.map(b => b.name);
  const nextBadge = badgeTiers.find(t => level < t.level);
  const lastBadge = badges && badges.length > 0 ? badges[badges.length - 1] : null;

  // Motivational message
  let motivationalMsg = '';
  if (nextBadge) {
    motivationalMsg = `Level up to ${nextBadge.level} to earn the ${nextBadge.name} badge!`;
  } else {
    motivationalMsg = "You're a true Habit Master! Keep going!";
  }

  // Recent achievement
  let recentAchievement = '';
  if (lastBadge) {
    recentAchievement = `Unlocked: ${lastBadge.emoji} ${lastBadge.name}`;
  } else {
    recentAchievement = 'Start logging habits to earn your first badge!';
  }

  // Rewards timeline: show only habit streaks of 7+ days
  const rewardsTimeline = (Array.isArray(data?.habitStreaks) ? data.habitStreaks : [])
    .filter(h => h.longestStreak >= 7)
    .map(h => `🔥 ${h.longestStreak}-day streak on ${h.title}`);

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#E9E9E9', padding: '96px 0 48px 0' }}>
      {/* 💥 XP Progress Bar */}
      <section style={{
        margin: '48px auto 32px auto',
        maxWidth: 700,
        background: '#E9E9E9',
        borderRadius: 24,
        boxShadow: '0 4px 24px #5A706C',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        width: '90%',
        border: '2px solid #5A706C'
      }}>
        <div style={{ fontWeight: 700, fontSize: 22, color: '#0F2C25', marginBottom: 8 }}>XP Progress</div>
        <div style={{ textAlign: 'center', marginBottom: 8, fontSize: 17, color: '#A6AB9F' }}>Level {level}</div>
        <motion.div style={{ height: 18, borderRadius: 9, background: '#E9E9E9', overflow: 'hidden', margin: '8px 0', boxShadow: '0 2px 8px #5A706C' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: ((xp / (level * 300)) * 100) + '%' }}
            style={{ height: 18, background: '#D23939', borderRadius: 9 }}
            transition={{ duration: 0.8 }}
          />
        </motion.div>
        <div style={{ fontSize: 15, color: '#A6AB9F', marginTop: 4 }}>XP: {xp} / {level * 300}</div>
      </section>

      {/* 🧩 Badge Showcase */}
      <section style={{
        margin: '0 auto 32px auto',
        maxWidth: 900,
        background: '#E9E9E9',
        borderRadius: 24,
        boxShadow: '0 4px 24px #5A706C',
        padding: '2.5rem 2rem',
        width: '90%',
        border: '2px solid #5A706C'
      }}>
        <div style={{ fontWeight: 700, fontSize: 22, color: '#0F2C25', marginBottom: 12 }}>Badges</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, justifyContent: 'center' }}>
          {badgeTiers.map((t, i) => {
            const earned = userBadgeNames.includes(t.name);
            const isNext = nextBadge && t.name === nextBadge.name;
            return (
              <div key={t.name}
                style={{
                  opacity: earned ? 1 : 0.4,
                  background: isNext ? '#0F2C25' : '#E9E9E9',
                  border: isNext ? '2px solid #D23939' : '2px solid #5A706C',
                  borderRadius: 16,
                  padding: 12,
                  minWidth: 80,
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  boxShadow: earned ? '0 2px 8px #5A706C' : 'none',
                  position: 'relative',
                }}
              >
                <span style={{ fontSize: 36, color: '#D23939' }}>{t.emoji}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#0F2C25', marginTop: 4 }}>{t.name}</span>
                <span style={{ fontSize: 12, color: '#A6AB9F', marginTop: 2 }}>{t.description}</span>
                {!earned && (
                  <span style={{ fontSize: 11, color: '#D23939', marginTop: 4 }}>Locked: Reach Level {t.level}</span>
                )}
                {isNext && <span style={{ position: 'absolute', top: 4, right: 8, fontSize: 13, color: '#D23939', fontWeight: 700 }}>Next</span>}
              </div>
            );
          })}
        </div>
      </section>

      {/* 🎮 Level Card */}
      <section style={{
        margin: '0 auto 32px auto',
        maxWidth: 900,
        background: '#0F2C25',
        borderRadius: 24,
        boxShadow: '0 4px 24px #5A706C',
        padding: '2.5rem 2rem',
        width: '90%',
        display: 'flex', gap: 32, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap',
        border: '2px solid #5A706C'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 700, color: '#A6AB9F', fontSize: 16 }}>Longest Streak</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#E9E9E9' }}>{longestStreak}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 700, color: '#A6AB9F', fontSize: 16 }}>Level</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#E9E9E9', textShadow: '0 1px 4px #5A706C' }}>{level}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 700, color: '#A6AB9F', fontSize: 16 }}>Habits Completed</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#E9E9E9' }}>{habitsCompleted}</div>
        </div>
      </section>

      {/* 🏅 Rewards Timeline */}
      <section style={{
        margin: '0 auto 32px auto',
        maxWidth: 900,
        background: '#E9E9E9',
        borderRadius: 24,
        boxShadow: '0 4px 24px #5A706C',
        padding: '2.5rem 2rem',
        width: '90%',
        border: '2px solid #5A706C'
      }}>
        <div style={{ fontWeight: 700, fontSize: 22, color: '#0F2C25', marginBottom: 12 }}>Rewards Timeline</div>
        {rewardsTimeline.length === 0 ? (
          <div style={{ color: '#A6AB9F', fontSize: 15, textAlign: 'center' }}>No milestones yet. Start building your streaks and leveling up!</div>
        ) : (
          <ul style={{ fontSize: 15, color: '#0F2C25', paddingLeft: 18 }}>
            {rewardsTimeline.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
        <div style={{ fontSize: 13, color: '#D23939', marginTop: 10, textAlign: 'center', cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => window.location.href = '/habit-tracking'}>
          Go to Habit Tracking to build your next streak →
        </div>
      </section>

      {/* Recent Achievement */}
      <section style={{
        margin: '0 auto 24px auto',
        maxWidth: 700,
        background: '#E9E9E9',
        borderRadius: 16,
        padding: 18,
        textAlign: 'center',
        boxShadow: '0 2px 8px #5A706C',
        border: '2px solid #5A706C'
      }}>
        <div style={{ fontWeight: 700, color: '#0F2C25', fontSize: 15 }}>Recent Achievement</div>
        <div style={{ fontSize: 16, marginTop: 4, color: '#A6AB9F' }}>{recentAchievement}</div>
      </section>

      {/* Motivation */}
      <section style={{
        margin: '0 auto 16px auto',
        maxWidth: 700,
        background: '#0F2C25',
        borderRadius: 16,
        padding: 18,
        textAlign: 'center',
        boxShadow: '0 2px 8px #5A706C',
        border: '2px solid #5A706C'
      }}>
        <div style={{ fontWeight: 700, color: '#E9E9E9', fontSize: 15 }}>Motivation</div>
        <div style={{ fontSize: 16, marginTop: 4, color: '#A6AB9F' }}>{motivationalMsg}</div>
      </section>

      {/* Call to Action */}
      <div style={{ fontSize: 13, color: '#A6AB9F', margin: '24px auto 0 auto', textAlign: 'center', maxWidth: 700 }}>
        Log your habits daily to earn XP, level up, and unlock new badges!
      </div>
    </div>
  );
};

export default Gamification; 