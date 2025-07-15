import React, { useEffect, useState } from 'react';
import api from '../api';
import { Bar, Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import styles from './ProfileForm.module.css';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Analytics = () => {
  const [logs, setLogs] = useState([]);
  const [xpHistory, setXpHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [logsRes, xpRes] = await Promise.all([
        api.get('/habit-logs'),
        api.get('/xp-history')
      ]);
      setLogs(logsRes.data);
      setXpHistory(xpRes.data);
    } catch {
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Aggregate data for charts
  const habitCounts = {};
  logs.forEach(l => {
    if (!habitCounts[l.habitId]) habitCounts[l.habitId] = 0;
    if (l.completed) habitCounts[l.habitId]++;
  });
  const barData = {
    labels: Object.keys(habitCounts),
    datasets: [{
      label: 'Completions',
      data: Object.values(habitCounts),
      backgroundColor: '#4ADE80',
    }]
  };
  const completed = logs.filter(l => l.completed).length;
  const missed = logs.length - completed;
  const pieData = {
    labels: ['Completed', 'Missed'],
    datasets: [{
      data: [completed, missed],
      backgroundColor: ['#60A5FA', '#F87171'],
    }]
  };

  if (loading) return <div className={styles.bg}><div className={styles.card}>Loading...</div></div>;
  if (error) return <div className={styles.bg}><div className={styles.card}>{error}</div></div>;

  return (
    <div className={styles.bg}>
      <div className={styles.card} style={{maxWidth: 700}}>
        <h2 className={styles.title}>📊 Analytics</h2>
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.7}} style={{marginBottom:32}}>
          <Bar data={barData} options={{responsive:true,plugins:{legend:{display:false}}}} />
        </motion.div>
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:1}} style={{marginBottom:32}}>
          <Pie data={pieData} options={{responsive:true,plugins:{legend:{position:'bottom'}}}} />
        </motion.div>
        <div style={{fontSize:14,color:'#1F2937',textAlign:'center'}}>Top habit: {barData.labels[0] || 'N/A'} | Completion: {completed} | Missed: {missed}</div>
      </div>
    </div>
  );
};

export default Analytics; 