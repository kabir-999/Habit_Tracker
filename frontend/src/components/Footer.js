import React from "react";

const Footer = () => (
  <footer style={{
    width: "100%",
    background: "#0F2C25",
    color: "#E9E9E9",
    textAlign: "center",
    padding: "2rem 0 2.5rem 0",
    marginTop: 64,
    borderTop: "1px solid #5A706C",
    boxShadow: "0 -2px 16px #5A706C"
  }}>
    <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 4 }}>HabitWise</div>
    <div style={{ fontSize: 16, margin: "6px 0" }}>© {new Date().getFullYear()} HabitWise. All rights reserved.</div>
    <div style={{ fontSize: 16 }}>
      <a href="#privacy" style={footerLink}>Privacy</a> · <a href="#terms" style={footerLink}>Terms</a>
    </div>
  </footer>
);

const footerLink = { color: "#A6AB9F", textDecoration: "none", margin: "0 8px", fontWeight: 600 };

export default Footer; 