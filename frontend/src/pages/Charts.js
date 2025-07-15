import React from 'react';

const Charts = () => (
  <div style={{ maxWidth: 600, margin: '2rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #7F5AF033', padding: 24 }}>
    <h2 style={{ color: '#7F5AF0', marginBottom: 16 }}>Charts & Analytics</h2>
    <div style={{ marginBottom: 24 }}>
      <div style={{ color: '#374151', marginBottom: 8 }}>Daily Completion</div>
      <div style={{ background: '#F7F7FF', borderRadius: 8, height: 24, width: '100%', overflow: 'hidden' }}>
        <div style={{ background: '#2CB67D', width: '70%', height: '100%', borderRadius: 8 }}></div>
      </div>
      <div style={{ color: '#374151', fontSize: 14, marginTop: 4 }}>70% completed today</div>
    </div>
    <div style={{ background: '#F7F7FF', borderRadius: 8, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7F5AF0', fontWeight: 'bold', fontSize: 18 }}>
      [Charts will appear here]
    </div>
  </div>
);

export default Charts; 