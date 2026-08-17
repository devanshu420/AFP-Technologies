export default function ProductLoading() {
  return (
    <div
      style={{
        backgroundColor: '#030a16',
        minHeight: '100vh',
        padding: '2rem 1.25rem',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '240px 1fr 220px',
          gap: '1.75rem',
        }}
      >
        {/* Left Sidebar Skeleton */}
        <div
          style={{
            height: '420px',
            backgroundColor: '#071526',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.06)',
            animation: 'pulse 1.5s infinite ease-in-out',
          }}
        />

        {/* Center Main Skeleton */}
        <div>
          <div
            style={{
              width: '180px',
              height: '24px',
              backgroundColor: '#071526',
              borderRadius: '9999px',
              marginBottom: '1rem',
            }}
          />
          <div
            style={{
              width: '60%',
              height: '40px',
              backgroundColor: '#071526',
              borderRadius: '8px',
              marginBottom: '1.5rem',
            }}
          />
          <div
            style={{
              width: '100%',
              aspectRatio: '16/9',
              backgroundColor: '#071526',
              borderRadius: '16px',
              marginBottom: '2rem',
              animation: 'pulse 1.5s infinite ease-in-out',
            }}
          />
          <div
            style={{
              width: '100%',
              height: '100px',
              backgroundColor: '#071526',
              borderRadius: '10px',
            }}
          />
        </div>

        {/* Right Sidebar Skeleton */}
        <div
          style={{
            height: '350px',
            backgroundColor: '#071526',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.06)',
            animation: 'pulse 1.5s infinite ease-in-out',
          }}
        />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}