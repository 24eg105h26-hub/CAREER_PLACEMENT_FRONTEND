import React from 'react';
import { FolderOpen, AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({ title = 'No data available', description, actionLabel, onAction }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', textAlign: 'center' }}>
      <FolderOpen size={48} className="text-muted" style={{ marginBottom: '16px', opacity: 0.6 }} />
      <h4 style={{ marginBottom: '4px' }}>{title}</h4>
      {description && <p className="text-sm text-muted" style={{ maxWidth: '400px', marginBottom: '16px' }}>{description}</p>}
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
};

export const ErrorState = ({ message = 'Failed to load data', onRetry }) => {
  return (
    <div style={{ padding: '32px', textAlign: 'center', background: 'var(--danger-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--danger)' }}>
      <AlertTriangle size={32} color="var(--danger)" style={{ marginBottom: '8px' }} />
      <p style={{ color: 'var(--danger)', fontWeight: 'var(--font-weight-medium)', marginBottom: '12px' }}>{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export const Skeleton = ({ height = 20, width = '100%', style = {} }) => {
  return <div className="skeleton" style={{ height, width, ...style }} />;
};

export default EmptyState;
