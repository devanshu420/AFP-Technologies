'use client';

import ContactSettingsPanel from './ContactSettingsPanel';

export default function AdminHeading({ adminName = 'Administrator' }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        margin: '1.5rem 0',
      }}
    >
      {/* Left: Heading Title */}
      <div>
        <h1
          style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            color: '#f8fafc',
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          Control Panel
        </h1>
        <p
          style={{
            fontSize: '0.85rem',
            color: '#94a3b8',
            margin: '4px 0 0 0',
          }}
        >
          Welcome back, <strong style={{ color: '#38bdf8' }}>{adminName}</strong>
        </p>
      </div>

      {/* Right: Direct Edit Contact Info Button */}
      <div>
        <ContactSettingsPanel />
      </div>
    </div>
  );
}