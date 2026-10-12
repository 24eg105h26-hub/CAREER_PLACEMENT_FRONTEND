import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import Button from '../../components/Button';
import Input from '../../components/Input';

const DEMO_ACCOUNTS = [
  { role: 'Student', email: 'student@smartplacement.ai', password: 'Password123!' },
  { role: 'Recruiter', email: 'recruiter@smartplacement.ai', password: 'Password123!' },
  { role: 'TPO', email: 'tpo@smartplacement.ai', password: 'Password123!' },
  { role: 'Faculty', email: 'faculty@smartplacement.ai', password: 'Password123!' },
  { role: 'Mentor', email: 'mentor@smartplacement.ai', password: 'Password123!' },
  { role: 'Admin', email: 'admin@smartplacement.ai', password: 'Password123!' },
];

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.fullName}!`, 'success');
      // Navigate to corresponding dashboard
      const role = user.role.toLowerCase();
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
      {/* Left Form Panel */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '40px',
          maxWidth: '520px',
          margin: '0 auto',
        }}
      >
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Sparkles color="var(--primary)" size={28} />
            <h2 style={{ fontSize: '24px' }}>SmartPlacement AI</h2>
          </div>
          <h3>Sign in to your account</h3>
          <p className="text-sm text-muted">Select a demo role or enter your credentials.</p>
        </div>

        {error && (
          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger)',
              fontSize: '13px',
              marginBottom: '20px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            placeholder="you@institution.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" loading={loading} className="w-full mt-4">
            Sign In
          </Button>
        </form>

        {/* Quick Demo Sign In Buttons */}
        <div style={{ marginTop: '32px' }}>
          <p className="text-xs text-muted" style={{ marginBottom: '12px', textTransform: 'uppercase', fontWeight: 600 }}>
            Quick Demo Login:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.role}
                onClick={() => fillDemo(acc)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '11px' }}
              >
                {acc.role}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted" style={{ marginTop: '24px', textAlign: 'center' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: '600' }}>
            Register as Student or Recruiter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
