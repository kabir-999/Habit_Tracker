import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfileForm from "./pages/ProfileForm";
import HabitTracking from "./pages/HabitTracking";
import Gamification from "./pages/Gamification";
import Analytics from "./pages/Analytics";
import AiSuggestions from "./pages/AiSuggestions";
import Navbar from "./components/Navbar";

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
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} onSignupClick={handleSignupClick} />
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
        <Route path="/home" element={
          isLoggedIn ? <Home isLoggedIn={isLoggedIn} /> : <Navigate to="/login" />
        } />
        <Route path="/habit-tracking" element={
          isLoggedIn ? <HabitTracking /> : <Navigate to="/login" />
        } />
        <Route path="/gamification" element={
          isLoggedIn ? <Gamification /> : <Navigate to="/login" />
        } />
        <Route path="/analytics" element={
          isLoggedIn ? <Analytics /> : <Navigate to="/login" />
        } />
        <Route path="/ai-suggestions" element={
          isLoggedIn ? <AiSuggestions /> : <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
}

export default App;
