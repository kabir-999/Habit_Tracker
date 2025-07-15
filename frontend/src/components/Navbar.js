import React from "react";

const Navbar = ({ isLoggedIn, onLogout, onSignupClick }) => (
  <nav style={{
    position: "sticky", top: 0, zIndex: 10, background: "#fff", boxShadow: "0 2px 8px #0001",
    display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2rem"
  }}>
    <div style={{ fontWeight: 800, fontSize: 24, color: "#4ADE80", cursor: 'pointer' }} onClick={() => window.location.href = '/'}>HabitWise</div>
    <div style={{ display: "flex", gap: 24 }}>
      {isLoggedIn ? (
        <button onClick={onLogout} style={{ ...navLink, color: "#F97316", fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button>
      ) : (
        <button onClick={onSignupClick} style={{ ...navLink, color: "#60A5FA", fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>Sign Up</button>
      )}
    </div>
  </nav>
);

const navLink = {
  color: "#1F2937", textDecoration: "none", fontWeight: 500, fontSize: 16, transition: "color 0.2s"
};

export default Navbar; 