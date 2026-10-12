import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export const ForbiddenPage = () => {
  const { user } = useAuth();
  const defaultDashboard = user ? `/${user.role.toLowerCase()}/dashboard` : '/login';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '24px' }}>
      <ShieldX size={64} color="var(--danger)" style={{ marginBottom: '16px' }} />
      <h1>403 - Access Forbidden</h1>
      <p className="text-muted" style={{ maxWidth: '440px', margin: '8px 0 24px' }}>
        You do not have the required permissions or role to view this page.
      </p>
      <Link to={defaultDashboard}>
        <Button variant="primary">Return to My Dashboard</Button>
      </Link>
    </div>
  );
};

export default ForbiddenPage;
