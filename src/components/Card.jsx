import React from 'react';

export const Card = ({ children, title, subtitle, action, className = '', onClick }) => {
  return (
    <div className={`card ${onClick ? 'card-clickable' : ''} ${className}`} onClick={onClick}>
      {(title || action) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            {title && <h3 style={{ fontSize: 'var(--font-size-lg)' }}>{title}</h3>}
            {subtitle && <p className="text-xs text-muted" style={{ marginTop: '2px' }}>{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export const StatCard = ({ title, value, trend, icon: Icon, description }) => {
  return (
    <Card className="stat-card">
      <div className="stat-header">
        <span>{title}</span>
        {Icon && <Icon size={20} className="text-muted" />}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span className="stat-value tabular-nums">{value}</span>
        {trend && (
          <span className={`stat-trend ${trend.type === 'up' ? 'stat-trend-up' : 'stat-trend-down'}`}>
            {trend.type === 'up' ? '↑' : '↓'} {trend.label}
          </span>
        )}
      </div>
      {description && <span className="text-xs text-muted">{description}</span>}
    </Card>
  );
};

export default Card;
