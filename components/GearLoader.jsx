// components/GearLoader.jsx
'use client';

export default function GearLoader({ fullScreen = false, text = "Loading specifications..." }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // Vertically Center
        alignItems: 'center',     // Horizontally Center
        height: fullScreen ? '100vh' : '180px', // 🟢 Height ko kam karke upar la diya gaya hai
        width: '100%',
        backgroundColor: fullScreen ? '#071b32' : 'transparent',
        position: fullScreen ? 'fixed' : 'relative',
        top: 0,
        left: 0,
        zIndex: fullScreen ? 9999 : 10,
        gap: '0.75rem',
        margin: fullScreen ? 0 : 'auto',
        padding: '1rem 0', // 🟢 Extra padding hata kar position upar ki hai
      }}
    >
      {/* Gear Loader SVG */}
      <svg 
        width="75" 
        height="75" 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gearGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#38bdf8', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#0284c7', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Outer Spinning Gear */}
        <g transform="origin(50 50)">
          <path 
            d="M50 15 L56 21.5 L67.5 18 L69 28.5 L80 32 L78 43.5 L87 50 L78 56.5 L80 68 L69 71.5 L67.5 82 L56 78.5 L50 85 L44 78.5 L32.5 82 L31 71.5 L20 68 L22 56.5 L13 50 L22 43.5 L20 32 L31 28.5 L32.5 18 L44 21.5 Z" 
            fill="url(#gearGradient)" 
            stroke="#0ea5e9" 
            strokeWidth="1" 
          />
          <animateTransform 
            attributeName="transform" 
            type="rotate" 
            from="0 50 50" 
            to="360 50 50" 
            dur="4s" 
            repeatCount="indefinite" 
          />
        </g>

        {/* Inner Counter-Spinning Gear */}
        <g transform="origin(50 50)">
          <circle cx="50" cy="50" r="25" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 5" />
          <path 
            d="M50 35 L54 39 L60.6 37.5 L61.5 44 L67 46.5 L66 53.5 L70 57.6 L66 62 L67 68.5 L61.5 71 L60.6 77.5 L54 76 L50 80 L46 76 L39.4 77.5 L38.5 71 L33 68.5 L34 62 L30 57.6 L34 53.5 L33 46.5 L38.5 44 L39.4 37.5 L46 39 Z" 
            fill="#0c4a6e" 
            stroke="#38bdf8" 
            strokeWidth="1"
            transform="scale(0.6) translate(33.3 33.3)"
          />
          <animateTransform 
            attributeName="transform" 
            type="rotate" 
            from="360 50 50" 
            to="0 50 50" 
            dur="2.5s" 
            repeatCount="indefinite" 
            additive="sum"
          />
        </g>
        
        <circle cx="50" cy="50" r="10" fill="#f8fafc" />
        <circle cx="50" cy="50" r="5" fill="#071b32" />
      </svg>

      {text && (
        <span style={{ color: '#0284c7', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.04em' }}>
          {text}
        </span>
      )}
    </div>
  );
}