import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import Button from '../components/Button';

export const UnauthorizedPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '24px' }}>
      <ShieldAlert size={64} color="var(--warning)" style={{ marginBottom: '16px' }} />
      <h1>401 - Authentication Required</h1>
      <p className="text-muted" style={{ maxWidth: '400px', margin: '8px 0 24px' }}>
        You need to sign in to access this page.
      </p>
      <Link to="/login">
        <Button variant="primary">Sign In to Continue</Button>
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
