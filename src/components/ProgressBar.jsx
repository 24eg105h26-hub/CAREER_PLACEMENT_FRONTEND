import React from 'react';

export const ProgressBar = ({ progress = 0, color = 'var(--primary)', height = 8 }) => {
  const percentage = Math.min(100, Math.max(0, progress));
  return (
    <div className="progress-bar-container" style={{ height: `${height}px` }}>
      <div
        className="progress-bar-fill"
        style={{ width: `${percentage}%`, backgroundColor: color }}
      />
    </div>
  );
};

export const ProgressRing = ({ progress = 0, size = 120, strokeWidth = 10, label }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          stroke="var(--bg-surface-hover)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke="var(--primary)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transition: 'stroke-dashoffset 800ms ease-out' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-semibold)' }} className="tabular-nums">
          {Math.round(progress)}%
        </span>
        {label && <span className="text-xs text-muted">{label}</span>}
      </div>
    </div>
  );
};

export default ProgressBar;
