import React from "react";
import { motion } from "framer-motion";

const PreviewSection = () => (
  <section style={{ margin: "64px auto", textAlign: "center" }}>
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      style={{
        display: "inline-block", background: "#F9FAFB", borderRadius: 16,
        boxShadow: "0 2px 16px #60A5FA22", padding: 32
      }}
    >
      {/* Replace with animated GIF or dashboard mockup */}
      <div style={{ fontSize: 24, color: "#60A5FA", marginBottom: 12 }}>👀</div>
      <div style={{ color: "#1F2937", fontWeight: 600, fontSize: 18 }}>See your progress in real time!</div>
      <div style={{ color: "#374151", fontSize: 15, marginTop: 8 }}>Animated preview coming soon.</div>
    </motion.div>
  </section>
);

export default PreviewSection; 