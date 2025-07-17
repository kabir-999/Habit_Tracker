

const CHALLENGES = [
  {
    text: 'Drink 2L Water',
    icon: '💧',
    tip: 'Keep a bottle nearby and sip throughout the day!'
  },
  {
    text: 'Meditate 5 mins',
    icon: '🧘‍♂️',
    tip: 'Find a quiet spot and focus on your breath.'
  },
  {
    text: 'Take a 10-min Walk',
    icon: '🚶‍♀️',
    tip: 'Get up and move, even indoors!'
  },
  {
    text: 'Eat a Fruit',
    icon: '🍎',
    tip: 'Add color and vitamins to your day.'
  },
  {
    text: 'Stretch Your Body',
    icon: '🤸‍♂️',
    tip: 'Loosen up with a quick stretch break.'
  },
  {
    text: 'Digital Detox 30min',
    icon: '📵',
    tip: 'Step away from screens for a while.'
  },
  {
    text: 'Write a Gratitude Note',
    icon: '✍️',
    tip: 'Jot down something you’re thankful for.'
  },
  {
    text: 'Smile at Yourself',
    icon: '😊',
    tip: 'Look in the mirror and give yourself a big smile!'
  }
];

const SLICE_COLORS = [
  '#0F2C25', '#5A706C', '#A6AB9F', '#D23939', '#E9E9E9', '#5A706C', '#A6AB9F', '#0F2C25'
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Add a prop for onXpAwarded callback
export default function SpinWheel({ onXpAwarded }) {
  const [spinTaskLog, setSpinTaskLog] = useState([]); // Backend log
  const [loadingLog, setLoadingLog] = useState(false);
  const [submittingIdx, setSubmittingIdx] = useState(null);

  // Get userId from localStorage (or context/auth)
  const userId = localStorage.getItem('userId'); // Adjust if you use a different method

  // Fetch spin task log
  const fetchSpinTaskLog = async () => {
    if (!userId) return;
    setLoadingLog(true);
    try {
      const res = await fetch(`/api/spin-task/${userId}`);
      const data = await res.json();
      setSpinTaskLog(data);
    } catch (err) {
      setSpinTaskLog([]);
    } finally {
      setLoadingLog(false);
    }
  };

  useEffect(() => {
    fetchSpinTaskLog();
    // eslint-disable-next-line
  }, [userId]);
  // xpMsgs and doneErrors can be removed if not used elsewhere

  const [spinning, setSpinning] = useState(false);
  const [selected, setSelected] = useState(null);
  const [angle, setAngle] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const audioRef = useRef(null);

  const numSlices = CHALLENGES.length;
  const sliceAngle = 360 / numSlices;

  const spin = async () => {
    if (spinning) return;
    setShowConfetti(false);
    const selectedIdx = getRandomInt(numSlices);
    setSelected(selectedIdx);
    const spins = 4 + getRandomInt(2); // 4-5 full spins
    const finalAngle = 360 * spins + (360 - selectedIdx * sliceAngle - sliceAngle/2);
    setAngle(finalAngle);
    setSpinning(true);
    setTimeout(async () => {
      setSpinning(false);
      setShowConfetti(true);
      if (audioRef.current) audioRef.current.play();
      // Log the selected task to backend
      if (userId !== null && userId !== undefined) {
        try {
          await fetch('/api/spin-task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, task: CHALLENGES[selectedIdx].text })
          });
          fetchSpinTaskLog();
        } catch (err) {}
      }
    }, 3200);
  };

  const [submitting, setSubmitting] = useState(false);
  const [xpMsg, setXpMsg] = useState('');
  const [doneError, setDoneError] = useState('');

  

  return (
    <div className="spinwheel-root">
      <h2 className="spinwheel-header">🎡 Today’s Wellness Spin</h2>
      <div className="spinwheel-center">
        <div className="spinwheel-wheel-container">
          <motion.svg
            className="spinwheel-wheel"
            width="320" height="320" viewBox="0 0 320 320"
            animate={{ rotate: angle }}
            transition={{ duration: 3, ease: [0.17, 0.67, 0.83, 1] }}
            style={{ pointerEvents: spinning ? 'none' : 'auto', display: 'block' }}
          >
            {CHALLENGES.map((c, i) => {
              // Pie slice math
              const r = 160;
              const startAngle = i * sliceAngle - 90;
              const endAngle = (i + 1) * sliceAngle - 90;
              const x1 = 160 + r * Math.cos((Math.PI / 180) * startAngle);
              const y1 = 160 + r * Math.sin((Math.PI / 180) * startAngle);
              const x2 = 160 + r * Math.cos((Math.PI / 180) * endAngle);
              const y2 = 160 + r * Math.sin((Math.PI / 180) * endAngle);
              const largeArc = sliceAngle > 180 ? 1 : 0;
              const pathData = `M160,160 L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`;
              // Label/icon position (middle angle)
              const midAngle = (startAngle + endAngle) / 2;
              const labelR = 110;
              const lx = 160 + labelR * Math.cos((Math.PI / 180) * midAngle);
              const ly = 160 + labelR * Math.sin((Math.PI / 180) * midAngle);
              return (
                <g key={i}>
                  <path
                    d={pathData}
                    fill={SLICE_COLORS[i % SLICE_COLORS.length]}
                    stroke="#fff"
                    strokeWidth="2"
                    style={{ filter: 'drop-shadow(0 1px 8px #0001)' }}
                  />
                  <text
                    x={lx}
                    y={ly - 10}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize="22"
                    fontWeight="bold"
                    fill="#0F2C25"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >{c.icon}</text>
                  <foreignObject
                    x={lx - 46}
                    y={ly + 6}
                    width="92"
                    height="28"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    <div
                      style={{
                        color: '#5A706C',
                        fontWeight: 600,
                        fontSize: 11,
                        textAlign: 'center',
                        lineHeight: '1.14',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'pre-line',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        maxHeight: 28,
                        maxWidth: 92
                      }}
                    >
                      {c.text}
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </motion.svg>
          <div className="spinwheel-pointer-glow" style={{ transform: 'rotate(180deg)' }}>
            <div className="spinwheel-pointer" />
          </div>
        </div>
        <button
          className={`spinwheel-spin-btn${spinning ? ' spinning' : ''}`}
          onClick={spin}
          disabled={spinning}
        >
          {spinning ? 'Spinning...' : 'Spin the Wheel!'}
        </button>
        <AnimatePresence>
          {showConfetti && <ConfettiExplosion key="confetti" />}
        </AnimatePresence>
        <div className="spinwheel-log">
          {loadingLog ? (
            <div>Loading your spin tasks...</div>
          ) : spinTaskLog.length === 0 ? (
            <div>No spin tasks yet. Spin the wheel!</div>
          ) : (
            spinTaskLog.map((log, idx) => {
              const challenge = CHALLENGES.find(c => c.text === log.task);
              return (
                <div key={log._id || log.timestamp || idx} className="spinwheel-log-item">
                  <div className="spinwheel-log-icon">{challenge ? challenge.icon : '🎯'}</div>
                  <div className="spinwheel-log-text">{log.task}</div>
                  <button
                    className={`spinwheel-done-btn${log.completed ? ' completed' : ''}`}
                    onClick={async () => {
                      if (log.completed) return;
                      setSubmittingIdx(idx);
                      try {
                        const res = await fetch(`/api/spin-task/${log._id}/complete`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' } });
                        if (res.ok) {
                          fetchSpinTaskLog();
                          if (typeof onXpAwarded === 'function') onXpAwarded();
                        }
                      } catch {}
                      setSubmittingIdx(null);
                    }}
                    disabled={submittingIdx === idx}
                  >
                    {submittingIdx === idx ? 'Submitting...' : 'Mark as Done'}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function ConfettiExplosion() {
  // Simple confetti burst using CSS
  return <div className="spinwheel-confetti" />;
}
