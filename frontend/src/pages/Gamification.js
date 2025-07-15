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

  if (loading) return <div className={styles.bg}><div className={styles.card}>Loading...</div></div>;
  if (error) return <div className={styles.bg}><div className={styles.card}>{error}</div></div>;
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
    <div className={styles.bg} style={{ minHeight: '100vh', padding: 0 }}>
      <div className={styles.card} style={{ maxWidth: 600, margin: '32px auto', boxShadow: '0 4px 24px #22c55e11', borderRadius: 24, padding: 32 }}>
        {/* 💥 XP Progress Bar */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontWeight: 700, fontSize: 20, color: '#22C55E', marginBottom: 8 }}>XP Progress</div>
          <div style={{ textAlign: 'center', marginBottom: 8, fontSize: 16 }}>Level {level}</div>
          <motion.div style={{ height: 18, borderRadius: 9, background: '#e5e7eb', overflow: 'hidden', margin: '8px 0', boxShadow: '0 2px 8px #60a5fa22' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: ((xp / (level * 300)) * 100) + '%' }}
              style={{ height: 18, background: 'linear-gradient(90deg,#22C55E,#60A5FA)', borderRadius: 9 }}
              transition={{ duration: 0.8 }}
            />
          </motion.div>
          <div style={{ fontSize: 15, color: '#374151', marginTop: 4 }}>XP: {xp} / {level * 300}</div>
        </div>

        {/* 🧩 Badge Showcase */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontWeight: 700, fontSize: 20, color: '#1F2937', marginBottom: 12 }}>Badges</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, justifyContent: 'center' }}>
            {badgeTiers.map((t, i) => {
              const earned = userBadgeNames.includes(t.name);
              const isNext = nextBadge && t.name === nextBadge.name;
              return (
                <div key={t.name}
                  style={{
                    opacity: earned ? 1 : 0.4,
                    background: isNext ? '#FEF9C3' : '#F3F4F6',
                    border: isNext ? '2px solid #F59E42' : '2px solid #F3F4F6',
                    borderRadius: 16,
                    padding: 12,
                    minWidth: 80,
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    boxShadow: earned ? '0 2px 8px #22c55e33' : 'none',
                    position: 'relative',
                  }}
                >
                  <span style={{ fontSize: 36 }}>{t.emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#1F2937', marginTop: 4 }}>{t.name}</span>
                  <span style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{t.description}</span>
                  {!earned && (
                    <span style={{ fontSize: 11, color: '#F59E42', marginTop: 4 }}>Locked: Reach Level {t.level}</span>
                  )}
                  {isNext && <span style={{ position: 'absolute', top: 4, right: 8, fontSize: 13, color: '#F59E42', fontWeight: 700 }}>Next</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* 🔥 Streak Counter */}

        {/* 🎮 Level Card */}
        <div style={{ marginBottom: 32, background: '#F3F4F6', borderRadius: 16, padding: 18, display: 'flex', gap: 32, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, color: '#60A5FA', fontSize: 16 }}>Longest Streak</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#60A5FA' }}>{longestStreak}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, color: '#22C55E', fontSize: 16 }}>Level</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{level}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, color: '#F59E42', fontSize: 16 }}>Habits Completed</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{habitsCompleted}</div>
          </div>
        </div>

        {/* 🏅 Rewards Timeline */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontWeight: 700, fontSize: 20, color: '#1F2937', marginBottom: 12 }}>Rewards Timeline</div>
          {rewardsTimeline.length === 0 ? (
            <div style={{ color: '#6b7280', fontSize: 15, textAlign: 'center' }}>No milestones yet. Start building your streaks and leveling up!</div>
          ) : (
            <ul style={{ fontSize: 15, color: '#374151', paddingLeft: 18 }}>
              {rewardsTimeline.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
          <div style={{ fontSize: 13, color: '#60A5FA', marginTop: 10, textAlign: 'center', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => window.location.href = '/habit-tracking'}>
            Go to Habit Tracking to build your next streak →
          </div>
        </div>

        {/* Recent Achievement */}
        <div style={{ marginBottom: 24, background: '#ECFEF4', borderRadius: 12, padding: 14, textAlign: 'center', boxShadow: '0 2px 8px #22c55e22' }}>
          <div style={{ fontWeight: 700, color: '#22C55E', fontSize: 15 }}>Recent Achievement</div>
          <div style={{ fontSize: 16, marginTop: 4 }}>{recentAchievement}</div>
        </div>

        {/* Motivation */}
        <div style={{ marginBottom: 16, background: '#FEF9C3', borderRadius: 12, padding: 14, textAlign: 'center', boxShadow: '0 2px 8px #f59e4222' }}>
          <div style={{ fontWeight: 700, color: '#F59E42', fontSize: 15 }}>Motivation</div>
          <div style={{ fontSize: 16, marginTop: 4 }}>{motivationalMsg}</div>
        </div>

        {/* Call to Action */}
        <div style={{ fontSize: 13, color: '#6b7280', marginTop: 12, textAlign: 'center' }}>
          Log your habits daily to earn XP, level up, and unlock new badges!
        </div>
      </div>
    </div>
  );
};

export default Gamification; 