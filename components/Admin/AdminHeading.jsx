'use client';

import { RefreshCw } from 'lucide-react';

export default function AdminHeading({ adminName = 'operator', onRefresh }) {
  return (
    <div className="admin-heading">
      <div>
        <p className="kicker dark">
          <span /> CONTROL ROOM
        </p>
        <h1>
          Welcome back,
          <br />
          <em>{adminName}.</em>
        </h1>
      </div>
      <button
        className="icon-button refresh"
        onClick={onRefresh}
        aria-label="Refresh dashboard"
      >
        <RefreshCw size={18} />
      </button>
    </div>
  );
}