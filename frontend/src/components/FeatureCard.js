import React from "react";
import { motion } from "framer-motion";

const FeatureCard = ({ icon, title, text, accent }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.04, boxShadow: "0 8px 32px #60A5FA22" }}
    style={{
      background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px #0001",
      padding: "2rem 1.5rem", minWidth: 220, flex: "1 1 220px", textAlign: "center",
      borderTop: `4px solid ${accent}`
    }}
  >
    <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
    <h3 style={{ color: accent, fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{title}</h3>
    <p style={{ color: "#374151", fontSize: 15 }}>{text}</p>
  </motion.div>
);

export default FeatureCard; 