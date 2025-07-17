import React, { useEffect, useState } from 'react';
import './LoggedInMessage.css';

const messages = [
  // Playful & Fun
  "Thanks for hopping on the habit train—next stop: greatness! 🚂",
  "Your future self is already high-fiving you! 🙌",
  "Cheers for showing up today. That’s already one habit nailed! 🏆",
  // Motivational
  "Every great change starts with one small step. Thanks for taking that step with us! 🌱",
  "Thank you for being the kind of person who wants to improve. The world needs more of you! 💚",
  "You’re not just tracking habits—you’re rewriting your story. And we’re honored to help. ✨",
  // Warm & Grateful
  "Thank you for choosing to grow with us—one habit at a time! 💪",
  "We’re glad you’re here. Let’s make every day count! 🌟",
  "Your journey to better habits starts now. Thanks for trusting us! 🚀"
];

const getRandomMessage = () => messages[Math.floor(Math.random() * messages.length)];

const LoggedInMessage = () => {
  const [message, setMessage] = useState(getRandomMessage());
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(false);
      setTimeout(() => {
        setMessage(getRandomMessage());
        setAnimate(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`logged-in-message${animate ? ' fade-in' : ' fade-out'}`}>
      {message}
    </div>
  );
};

export default LoggedInMessage;
