import React from "react";
import './FeatureCard.css';

const FeatureCard = ({ icon, title, description, accent, onClick }) => (
  <div
    className="feature-card feature-card-expandable"
    style={{ borderTop: `4px solid ${accent}` }}
    onClick={onClick}
  >
    <div className="feature-card-inner">
      <div className="feature-desc">{description}</div>
      <div className="feature-main">
        <div className="icon" style={{ color: accent }}>{icon}</div>
        <div className="title">{title}</div>
      </div>
    </div>
  </div>
);

export default FeatureCard;