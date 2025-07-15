import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./ProfileForm.module.css";

const ProfileForm = () => {
  const [form, setForm] = useState({ name: "", age: "", height: "", weight: "", gender: "", profession: "", goal: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/profile", form, { headers: { Authorization: `Bearer ${token}` } });
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.msg || "Profile save failed");
    }
  };

  return (
    <div className={styles.bg}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Complete Your Profile</h2>
        <input className={styles.input} name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input className={styles.input} name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} required />
        <input className={styles.input} name="height" type="number" placeholder="Height (cm)" value={form.height} onChange={handleChange} required />
        <input className={styles.input} name="weight" type="number" placeholder="Weight (kg)" value={form.weight} onChange={handleChange} required />
        <select className={styles.input} name="gender" value={form.gender} onChange={handleChange} required>
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input className={styles.input} name="profession" placeholder="Profession" value={form.profession} onChange={handleChange} required />
        <input className={styles.input} name="goal" placeholder="Your Main Goal" value={form.goal} onChange={handleChange} required />
        {error && <div className={styles.error}>{error}</div>}
        <button className={styles.btn} type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default ProfileForm; 