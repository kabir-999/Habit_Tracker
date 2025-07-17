import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfileForm from "./pages/ProfileForm";
import HabitTracking from "./pages/HabitTracking";
import Gamification from "./pages/Gamification";
import Analytics from "./pages/Analytics";
import AiSuggestions from "./pages/AiSuggestions";
import PersonalDetails from "./pages/PersonalDetails";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import FutureDiary from './pages/FutureDiary';
import AIChatbot from './pages/AIChatbot';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ProfilePage() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <div style={{ minHeight: '100vh', background: '#E9E9E9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 120 }}>
      <div style={{ width: '100%', maxWidth: 500 }}>
        <ProfileForm />
        <button onClick={handleLogout} style={{ width: '100%', background: '#D23939', color: '#E9E9E9', fontWeight: 800, fontSize: '1.2rem', border: 'none', borderRadius: '1rem', padding: '0.9rem 0', marginTop: '1.5rem', cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 2px 8px #5A706C' }}>Logout</button>
      </div>
    </div>
  );
}

function AppRoutes({ isLoggedIn, setIsLoggedIn, handleLogout, handleSignupClick }) {
  const location = useLocation();
  const hideNavbar = location.pathname === '/ai-chatbot';
  return (
    <>
      {!hideNavbar && <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} onSignupClick={handleSignupClick} />}
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={
          isLoggedIn ? <Navigate to="/home" /> : <Login onLogin={() => setIsLoggedIn(true)} />
        } />
        <Route path="/signup" element={
          isLoggedIn ? <Navigate to="/profile-form" /> : <Signup onSignup={() => setIsLoggedIn(true)} />
        } />
        <Route path="/profile-form" element={
          isLoggedIn ? <ProfileForm /> : <Navigate to="/login" />
        } />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/home" element={
          isLoggedIn ? <Home isLoggedIn={isLoggedIn} /> : <Navigate to="/login" />
        } />
        <Route path="/habit-tracking" element={<ProtectedRoute isLoggedIn={isLoggedIn}><HabitTracking /></ProtectedRoute>} />
        <Route path="/gamification" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Gamification /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Analytics /></ProtectedRoute>} />
        <Route path="/ai-suggestions" element={<ProtectedRoute isLoggedIn={isLoggedIn}><AiSuggestions /></ProtectedRoute>} />
        <Route path="/personal-details" element={<ProtectedRoute isLoggedIn={isLoggedIn}><PersonalDetails onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/future-diary" element={<FutureDiary />} />
        <Route path="/ai-chatbot" element={<AIChatbot userId={localStorage.getItem('userId')} />} />
      </Routes>
    </>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const handleSignupClick = () => {
    window.location.href = "/login";
  };

  return (
    <Router>
      <ScrollToTop />
      <AppRoutes
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        handleLogout={handleLogout}
        handleSignupClick={handleSignupClick}
      />
    </Router>
  );
}

export default App;
