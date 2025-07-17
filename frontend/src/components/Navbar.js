import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileForm from "../pages/ProfileForm";
import { getNotifications, checkDueDiaryTasks, markNotificationsRead } from '../api';

const Navbar = ({ isLoggedIn, onLogout, onSignupClick }) => {
  const navigate = useNavigate();
  // Removed notification state and logic

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, width: "100%", zIndex: 100, background: "#0F2C25", boxShadow: "0 2px 8px #5A706C", boxSizing: "border-box",
      display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2rem"
    }}>
      <div style={{ fontWeight: 800, fontSize: 24, color: "#E9E9E9", cursor: 'pointer', background: 'none', borderRadius: 12, padding: '0.2em 0.7em' }} onClick={() => window.location.href = '/'}>HabitWise</div>
      <div style={{ display: "flex", gap: 24, alignItems: 'center' }}>
        {isLoggedIn ? (
          <button
            onClick={() => navigate('/personal-details')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 28, color: '#E9E9E9', padding: 0 }}
            title="View Profile"
          >
            <span role="img" aria-label="User">👤</span>
          </button>
        ) : (
          <button onClick={onSignupClick} style={{ color: "#D23939", fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>Sign Up</button>
        )}
      </div>
    </nav>
  );
};

const navLink = {
  color: "#A6AB9F", textDecoration: "none", fontWeight: 500, fontSize: 16, transition: "color 0.2s"
};

export default Navbar; 