import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { motion } from "framer-motion";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Simple validation
  const validate = () => {
    const err = {};
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) err.email = "Invalid email";
    if (!form.password || form.password.length < 6) err.password = "Password must be at least 6 characters";
    if (!isLogin && form.password !== form.confirm) err.confirm = "Passwords do not match";
    return err;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setTouched({ ...touched, [e.target.name]: true });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    setError("");
    if (Object.keys(err).length !== 0) {
      setError(Object.values(err)[0]);
      return;
    }
    try {
      if (isLogin) {
        const res = await api.post("/auth/login", { email: form.email, password: form.password });
        localStorage.setItem("token", res.data.token);
        // Store userId for habit tracking
        if (res.data.userId) {
          localStorage.setItem("userId", res.data.userId);
        } else if (res.data.user && res.data.user._id) {
          localStorage.setItem("userId", res.data.user._id);
        }
        navigate("/home");
      } else {
        const res = await api.post("/auth/signup", { email: form.email, password: form.password });
        localStorage.setItem("token", res.data.token);
        // Store userId for habit tracking
        if (res.data.userId) {
          localStorage.setItem("userId", res.data.userId);
        } else if (res.data.user && res.data.user._id) {
          localStorage.setItem("userId", res.data.user._id);
        }
        navigate("/profile-form");
      }
    } catch (err) {
      setError(err.response?.data?.msg || (isLogin ? "Invalid email or password" : "Signup failed"));
    }
  };

  return (
    <div className="auth-bg">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-card"
      >
        <div className="auth-title">Welcome to HabitWise</div>
        <div className="auth-subtext">Start building your streaks today</div>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-label">Email</div>
          <input
            name="email"
            type="email"
            autoComplete="email"
            className={`auth-input${error && error.toLowerCase().includes("email") ? " auth-input-error" : ""}`}
            value={form.email}
            onChange={handleChange}
            onBlur={() => setTouched({ ...touched, email: true })}
            required
          />
          <div className="auth-label">Password</div>
          <div style={{ position: "relative" }}>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isLogin ? "current-password" : "new-password"}
              className={`auth-input${error && error.toLowerCase().includes("password") ? " auth-input-error" : ""}`}
              value={form.password}
              onChange={handleChange}
              onBlur={() => setTouched({ ...touched, password: true })}
              required
            />
            <button
              type="button"
              className="auth-eye"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label="Show/hide password"
            >
              {showPassword ? (
                <span role="img" aria-label="Hide">🙈</span>
              ) : (
                <span role="img" aria-label="Show">👁️</span>
              )}
            </button>
          </div>
          {!isLogin && (
            <>
              <div className="auth-label">Confirm Password</div>
              <input
                name="confirm"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className={`auth-input${error && error.toLowerCase().includes("confirm") ? " auth-input-error" : ""}`}
                value={form.confirm}
                onChange={handleChange}
                onBlur={() => setTouched({ ...touched, confirm: true })}
                required
              />
            </>
          )}
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" className="auth-btn">
            {isLogin ? "Log In" : "Sign Up"}
          </button>
          <button type="button" className="auth-google-btn" disabled>
            <span className="auth-google-icon">G</span> Continue with Google
          </button>
        </form>
        <div className="auth-switch">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <button className="auth-link" onClick={() => setIsLogin(false)}>
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button className="auth-link" onClick={() => setIsLogin(true)}>
                Log In
              </button>
            </>
          )}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="auth-info"
        >
          <span className="auth-info-bold">Info:</span> You need to log in to track habits, earn XP, and get AI suggestions.
        </motion.div>
      </motion.div>
      <style>{`
        .auth-bg {
          min-height: 100vh;
          background: #F9FAFB;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .auth-card {
          background: #fff;
          border-radius: 1.5rem;
          box-shadow: 0 4px 32px #60A5FA22;
          padding: 2.5rem 2rem 2rem 2rem;
          max-width: 370px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          align-items: stretch;
        }
        .auth-title {
          color: #4ADE80;
          font-size: 1.6rem;
          font-weight: 800;
          text-align: center;
        }
        .auth-subtext {
          color: #1F2937;
          text-align: center;
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }
        .auth-label {
          color: #1F2937;
          font-weight: 500;
          font-size: 1rem;
          margin-bottom: 0.2rem;
        }
        .auth-input {
          width: 100%;
          padding: 0.6rem 1rem;
          border-radius: 0.7rem;
          border: 1.5px solid #e5e7eb;
          font-size: 1rem;
          color: #1F2937;
          background: #F9FAFB;
          outline: none;
          transition: border 0.2s;
        }
        .auth-input:focus {
          border: 1.5px solid #4ADE80;
        }
        .auth-input-error {
          border: 1.5px solid #f87171;
        }
        .auth-error {
          color: #f87171;
          font-size: 0.85rem;
          margin-top: -0.3rem;
          margin-bottom: 0.2rem;
        }
        .auth-btn {
          width: 100%;
          background: #4ADE80;
          color: #fff;
          font-weight: 700;
          font-size: 1.1rem;
          border: none;
          border-radius: 0.7rem;
          padding: 0.7rem 0;
          margin-top: 0.5rem;
          margin-bottom: 0.2rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .auth-btn:hover {
          background: #60A5FA;
        }
        .auth-google-btn {
          width: 100%;
          background: #fff;
          color: #1F2937;
          font-weight: 600;
          border: 1.5px solid #e5e7eb;
          border-radius: 0.7rem;
          padding: 0.7rem 0;
          margin-top: 0.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: not-allowed;
        }
        .auth-google-icon {
          background: #60A5FA;
          color: #fff;
          border-radius: 50%;
          width: 1.3rem;
          height: 1.3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1rem;
        }
        .auth-switch {
          text-align: center;
          font-size: 1rem;
          color: #1F2937;
        }
        .auth-link {
          color: #60A5FA;
          font-weight: 600;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
          font-size: 1rem;
        }
        .auth-info {
          background: #E0F2FE;
          color: #1F2937;
          border-radius: 0.7rem;
          padding: 0.7rem 1rem;
          font-size: 0.98rem;
          margin-top: 0.5rem;
          text-align: center;
        }
        .auth-info-bold {
          font-weight: 700;
        }
        .auth-eye {
          position: absolute;
          right: 0.9rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.1rem;
          color: #60A5FA;
        }
        @media (max-width: 500px) {
          .auth-card {
            padding: 1.2rem 0.5rem 1.2rem 0.5rem;
            max-width: 98vw;
          }
        }
      `}</style>
    </div>
  );
};

export default Auth; 