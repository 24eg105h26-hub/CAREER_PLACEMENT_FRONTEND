import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';
import Card from './Card';

export const ErrorState = ({ message = 'An unexpected error occurred.', onRetry }) => {
  return (
    <Card style={{ textAlign: 'center', padding: '40px 20px' }}>
      <AlertCircle size={40} color="var(--danger)" style={{ margin: '0 auto 12px' }} />
      <h3 style={{ margin: '0 0 8px' }}>Something went wrong</h3>
      <p className="text-sm text-muted" style={{ margin: '0 0 20px', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" icon={RefreshCw} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </Card>
  );
};

export default ErrorState;
